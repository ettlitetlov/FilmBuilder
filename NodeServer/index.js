var express = require('express');
let app = express();
const getDuration = require('get-video-duration');
const bodyParser = require('body-parser');

// Fetching a child process, to be later used for command line ffmpeg operations
const { spawn } = require('child_process');

let fileName = 'exempel';
let fileExtension = '.mp4';
let filePath = '';
let listOfCommands = [];

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
        audio: [],
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

    if(body.path)
        filePath = body.path;

    if(body.name)
        fileName = body.name;

    const vLength = recipe.video.length;
    const aLength = recipe.audio.length;
    
    populateClipListing(recipe.video);
    
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
            console.log(`"${fileName}${fileExtension}" created successfully`);
            res.status(201).json({
                message: `${fileName}${fileExtension} created successfully`
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
// Stitches together correctly if vLength = aLength
function concatinationFilter(vLength, aLength){
    listOfCommands.push("-filter_complex");
    var tempString = '';
    for(var i = 0; i < vLength; i++){
        if(i < aLength)
            tempString = tempString + `[${i}:v:0][${i+vLength}:a:0]`;
        else
            tempString = tempString + `[${i}:v:0][${i}:a:0]`;
    }   
    tempString = tempString + `concat=n=${vLength}:v=1:a=1[outv][outa]`;

    listOfCommands.push(tempString);
    listOfCommands.push("-map");
    listOfCommands.push("[outv]");
    listOfCommands.push("-map");
    listOfCommands.push("[outa]");
}

// Option to specify resolution to the video
function specifiedResolution(res){

}

function addOutputFile() {
    listOfCommands.push(filePath+fileName+fileExtension);
}



