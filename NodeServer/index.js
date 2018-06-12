var express = require('express');
let app = express();
const getDuration = require('get-video-duration');

// Fetching a child process, to be later used for command line ffmpeg operations
const { spawn } = require('child_process');

let name = "exempel";
let fileExtension = '.mp4';
let listOfImports = [];


app.get('/', function (req, res, next) {
    res.send('Hello World!');
})

app.listen(8000, function() {
    console.log('App listening on port 8000!');
})

populateClipListing(['../Video/skräckis.mp4', '../Video/test.mp4'])

// Spawning the actual command line call
const filmData = spawn('ffmpeg', listOfImports)

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
    if(code === 0)
        console.log(`"${name}${fileExtension}" created successfully`);
    else
        console.log('error creating the file');
});

// Populate the command line arg-list with clips to be concatinated
function populateClipListing(URIs) {
    listOfImports.push('-y');
    URIs.forEach(element => {
        listOfImports.push('-i');
        listOfImports.push(element);
    });
}

// Populate the command line arg-list with sounds to be added to clips
function populateSoundListing(URIs){

}

// Adding the filter_complex to command line args for stitching together video+sound
function concatinationFilter(){

}

// Option to specify resolution to the video
function specifiedResolution(res){

}



