var express = require('express');
let app = express();
const getDuration = require('get-video-duration');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const XLSX = require('xlsx');
var workbook = XLSX.readFile('OTC-Database.xlsx');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
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

const listOfCategories = ["Transition","Category1","Category2","Category3","Category4"]

const fileFilter = function(req, file, cb) {
    if(req.body.type === 'Video')
        if(file.mimetype === 'video/mp4')
            cb(null,true);
        else {
            req.fileValidationError ='Invalid filetype, only accepts .mp4 video files' ;
            return cb(null, false, new Error('Invalid filetype, only accepts .mp4 video files'));
        }
    else if(req.body.type === 'Audio'){
        console.log(file.mimetype);
        if(file.mimetype === 'audio/x-m4a')
            cb(null,true);
        else {
            req.fileValidationError ='Invalid filetype, only accepts .mp4 audio files' ;
            return cb(null, false, new Error('Invalid filetype, only accepts .mp4 audio files'));
        }
    }
    else{
        if(file.mimetype === 'application/octet-stream')
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

//  POST-method for creating a movie
app.post('/compose/:type', jsonParser, function (req, res, next) {

    listOfCommands = [];

    const type = req.params.type;
    
    const body = req.body;

    fs.readFile('scripts.json', 'utf8', (err, data) => {
        if(err){
            return res.status(500).json({
                error: err
            })
            throw err;
        }
        else{

            const recipe = JSON.parse(data)[type];

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

            populateSubListing(recipe.subs);
            
            concatinationFilter(vLength, aLength, recipe.audio, recipe.subs);

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
        }
    })
})

// POST-method for uploading entry into database
app.post('/upload/', upload , function (req,res,next) {
    if(req.fileValidationError){
        console.log("FAILED: POST-request  at /upload/ : " + new Date().toLocaleString());
        return res.status(400).json({
            'error': req.fileValidationError
        });
    }
    else{
        fs.readFile('structure.json', 'utf8', (err,data) => {
            if(err) throw err;

            // Handle data
            let database = JSON.parse(data);
            let pathArr = req.body.category.split('/');
            console.log(req.file.path + pathArr);
            var langName;
            if(req.body.type === 'Audio' || req.body.type === 'Subtitles')
                langName = req.body.name + "__" + req.body.language;
            else
                langName = req.body.name;
            if(req.body.type != 'Subtitles'){
                getDuration(req.file.path).then((duration) => {
                    database.category[listOfCategories.indexOf(pathArr[0])][pathArr[0]][pathArr[1]][req.body.type]
                    .push({ 
                        "name" : langName,
                        "dir" : req.file.path,
                        "created" : new Date().toLocaleString(),
                        "duration" : duration,
                        "type": req.body.type});
                    fs.writeFile('structure.json', JSON.stringify(database, null, '\t'), (err) => {
                        if(err) throw err;
                    });      
                });
            }
            else{
                database.category[listOfCategories.indexOf(pathArr[0])][pathArr[0]][pathArr[1]][req.body.type]
                    .push({ 
                        "name" : langName,
                        // Need the use of a regular extression to replaceall backslashes to forward.
                        "dir" : req.file.path.replace(/\\/g, '//'),
                        "created" : new Date().toLocaleString(),
                        "type": req.body.type});
                    fs.writeFile('structure.json', JSON.stringify(database, null, '\t'), (err) => {
                        if(err) throw err;
                    });    
            }

        })
        console.log("SUCCESS: POST-request  at /upload/ : " + new Date().toLocaleString());
        res.status(200).json({
            "message": "Upploaded successfully to " + req.file.path
        });
    }
})

// POST-method for uploading new script
app.post('/script/:name', jsonParser, (req,res,next) => {
    console.log("POST-request at /script/ " + req.body);
    const name = req.params.name;

    fs.readFile('./scripts.json', (err, data) => {
        if(err){
            return res.status(500).json({
                error: err
            });
        }
        else{
            //console.log('GET-request at /upload/ : ' +  new Date().toLocaleString());
            var jsonData = JSON.parse(data);
            jsonData[name] = {
                    video : req.body,
                    audio : [],
                    subs : []
            };
            
            fs.writeFile('./scripts.json', JSON.stringify(jsonData, null, '\t'), (err) => {
                if(err) throw err;

                res.status(200).json({
                    message: "Script stored"
                });
            })

        }
    })


})

// GET for getting existing entries in database
app.get('/upload/', function (req, res, next) {
    fs.readFile('./structure.json', (err, data) => {
        if(err){
            return res.status(500).json({
                error: err
            });
        }
        else{
            console.log('GET-request at /upload/ : ' +  new Date().toLocaleString());
            var jsonData = JSON.parse(data);
            res.status(200).send(jsonData);
        }
    })
    
})

// Fetch types of recipes available in the database
app.get('/compose/types', (req,res,next) => {
    
    fs.readFile('scripts.json', 'utf8', (err, data) => {
        if(err){
            console.log("FAILURE: GET-request at /compose/types : " + new Date().toLocaleString());
            res.status(500).json({
                error: err
            })
            throw err;
        }
        else{
            console.log("SUCCESS: GET-request at /compose/types : " + new Date().toLocaleString());
            res.status(200).send(Object.keys(JSON.parse(data)));
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
        listOfCommands.push(Object.values(element)[0]);
    });
}

// Populate the command line arg-list with sounds to be added to clips
function populateSubListing(URIs){
    URIs.forEach(element => {
        console.log(Object.values(element)[0]);
        listOfCommands.push('-i');
        listOfCommands.push(Object.values(element)[0]);
    });
}



// Adding the filter_complex to command line args for stitching together video+sound
// Stitches together correctly if vLength = aLength, also changes resolution if wanted
function concatinationFilter(vLength, aLength, AudioObj, SubtObj){

    // Set and enter the filter
    listOfCommands.push("-filter_complex");
    var tempString = '';

    // Check if change of resolution is of interest.
    if(resolution > 0){
        var counter = 0;
        //console.log(Object.keys(Object.values(SubtObj)[counter]));

        for(var i = 0; i < vLength; i++){
            if(Object.values(SubtObj)[counter] && parseInt(Object.keys(Object.values(SubtObj)[counter])) === i){
                tempString = tempString + `[${i}:v]scale=-1:${resolution},setsar=sar=1,subtitles=${Object.values(Object.values(SubtObj)[counter])}[vid${i}];`;
                counter++;
            }
            else    
                tempString = tempString + `[${i}:v]scale=-1:${resolution},setsar=sar=1[vid${i}];`;
        }
    }


    for(var i = 0; i < vLength; i++){
        var counter = 0;
        // Only if resolution is changed
        if(resolution > 0){
            if(Object.values(AudioObj)[counter] && parseInt(Object.keys(Object.values(AudioObj)[counter])) === i){
                tempString = tempString + `[vid${i}][${counter+vLength}:a:0]`;
                counter++; 
            }
            else
                tempString = tempString + `[vid${i}][${i}:a:0]`;
        }
        else{
            if(Object.values(AudioObj)[counter] && parseInt(Object.keys(Object.values(AudioObj)[counter])) === i){
                tempString = tempString + `[${i}:v:0][${counter+vLength}:a:0]`;
                counter++;
            }
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



