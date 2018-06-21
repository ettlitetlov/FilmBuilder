var express = require('express');
let app = express();
const getDuration = require('get-video-duration');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
            console.log(req.body.type);
            if(req.body.type === 'Video')
                cb(null,'../Video/');
            else if(req.body.type === 'Audio')
                cb(null, '../Audio/');
            else
                cb(null, '../Subtitle/');
    },
    filename: function(req, file, cb) {
        cb(null, req.body.name + '.' + file.originalname.split('.')[1]);
    }
});

const fileFilter = function(req, file, cb) {
    if(req.body.type === 'Video')
        if(file.mimetype === 'video/mp4')
            cb(null,true);
        else {
            req.fileValidationError ='Invalid filetype, only accepts .mp4 video files' ;
            return cb(null, false, new Error('Invalid filetype, only accepts .mp4 video files'));
        }
    else if(req.body.type === 'Audio')
        cb(null, true);
    else{
        if(file.mimetype === 'text/srt')
            cb(null, true)
        else {
            req.fileValidationError ='Invalid filetype, only accepts .srt subtitle files' ;
            return cb(null, false, new Error('Invalid filetype, only accepts .srt subtitle files'));
        }
    }
};

const upload = multer({storage: storage, fileFilter: fileFilter}).single('fileUrl');

// Fetching a child process, to be later used for command line ffmpeg operations
const { spawn } = require('child_process');

let fileName = 'exempel';
let fileExtension = '.mp4';
let listOfCommands = [];
let resolution = 0;

// Allowing CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE,');
        return res.status(200).json({});
    }
    next(); 
});

// Using body parser
var jsonParser = bodyParser.json()

const recipes = {
    hej: {
        video: ['../Video/skräckis.mp4','../Video/test.mp4'],
        audio: ['../Audio/PimpMyRide.mp3'],
        subs: []
    },

    hall: {
        video: ['../Video/test.mp4','../Video/skräckis.mp4'],
        audio: [],
        subs: [],
    }
}

//  Post method for creating a movie
app.post('/compose/:type', jsonParser, function (req, res, next) {

    listOfCommands = [];

    const type = req.params.type.toLowerCase();
    
    const body = req.body;

    const recipe = recipes[type];

    // Checking if failed;
    if(recipe == undefined){
         return res.status(404).json({
            message: "Recipe for \"" + type + "\" not found" 
        });
    }

    if(body.res)
        resolution = body.res;

    if(body.format)
        fileExtension = body.format;

    if(body.name)
        fileName = body.name;
    else
        fileName = "exempel";

    const vLength = recipe.video.length;
    const aLength = recipe.audio.length;
    
    // Combining components for building video command list
    populateClipListing(recipe.video);

    populateSoundListing(recipe.audio);
    
    concatinationFilter(vLength, aLength);

    addOutputFile();

    console.log(listOfCommands);
    // Spawning the actual command line call
    const filmData = spawn('ffmpeg', listOfCommands);

        // Response from command line, will probably be empty
    filmData.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    // Error-response from command line, using FFmpeg, the output will be shown here
    filmData.stderr.on('data', (data) => {
        console.log(data.toString());
    });

    // Response message when child process is finished
    filmData.on('exit', function (code) {
        if(code === 0){
            console.log(`"${fileName}_${resolution*(16/9)}x${resolution}${fileExtension}" created successfully`);
            res.status(201).json({
                message: `${fileName}_${resolution*(16/9)}x${resolution}${fileExtension} created successfully`
            })
        }
        else{
            console.log('error creating the file');
            res.status(500).json({
                message: 'error creating the file'
            })
        }

    });
})

app.post('/upload/', upload , function (req,res,next) {
    if(req.fileValidationError)
        return res.status(400).json({
            'error': req.fileValidationError
        });
    else
        res.status(200).json({
            "message": "Upploaded successfully to " + req.file.path
        });
})

app.get('/upload/', function (req, res, next) {
    fs.readFile('./structure.json', (err, data) => {
        if(err){
            return res.status(500).json({
                error: err
            });
        }
        else{
            var jsonData = JSON.parse(data);
        
            console.log(jsonData);
            res.status(200).send(jsonData);
        }
    })
    
})

app.listen(8000, function() {
    console.log('App listening on port 8000!');
})

// Populate the command line arg-list with clips to be concatinated
function populateClipListing(URIs) {
    listOfCommands.push('-y');
    URIs.forEach(element => {
        listOfCommands.push('-i');
        listOfCommands.push(element);
    });
}

// Populate the command line arg-list with sounds to be added to clips
function populateSoundListing(URIs){
    URIs.forEach(element => {
        listOfCommands.push('-i');
        listOfCommands.push(element);
    });
}

// Adding the filter_complex to command line args for stitching together video+sound
// Stitches together correctly if vLength = aLength, also changes resolution if wanted
function concatinationFilter(vLength, aLength){

    // Set and enter the filter
    listOfCommands.push("-filter_complex");
    var tempString = '';

    // Check if change of resolution is of interest.
    if(resolution > 0){
        for(var i = 0; i < vLength; i++){
            tempString = tempString + `[${i}:v]scale=-1:${resolution},setsar=sar=1[vid${i}];`;
        }
    }


    for(var i = 0; i < vLength; i++){
        // Only if resolution is changed
        if(resolution > 0){
            if(i < aLength)
                tempString = tempString + `[vid${i}][${i+vLength}:a:0]`;
            else
                tempString = tempString + `[vid${i}][${i}:a:0]`;
        }
        else{
            if(i < aLength)
                tempString = tempString + `[${i}:v:0][${i+vLength}:a:0]`;
            else
                tempString = tempString + `[${i}:v:0][${i}:a:0]`;
        }

    }   
    tempString = tempString + `concat=n=${vLength}:v=1:a=1[outv][outa]`;

    listOfCommands.push(tempString);
    listOfCommands.push("-map");
    listOfCommands.push("[outv]");
    listOfCommands.push("-map");
    listOfCommands.push("[outa]");
}

// Append output file directory + name + resolution description + file extension to command line.
function addOutputFile() {
    listOfCommands.push('./created/'+fileName+'_'+(resolution*(16/9))+'x'+resolution+fileExtension);
}



