const express = require('express');
const fs = require('fs');
const path = require('path');
// Cross-origin
const cors = require('cors');
// Thumb Supply
const thumbsupply = require('thumbsupply');

// SHOULD GO IN TEST FILE - In deployment comes from DB
const videos = [
    {
        id: 0,
        // poster is to a link with poster image
        poster: '/video/0/poster',
        duration: '3 mins',
        name: 'Sample 1'
    },
    {
        id: 1,
        poster: '/video/1/poster',
        duration: '4 mins',
        name: 'Sample 2'
    },
    {
        id: 2,
        poster: '/video/2/poster',
        duration: '2 mins',
        name: 'Sample 3'
    },
];

const app = express();

const portNo = 4000;

// Route sends a complete video file back to the client, in one chunk
//app.get('/video', (req, res) => {
//    res.sendFile('assets/sample.mp4', {root: __dirname});
//});

// Routes stream back to the client in small chunks


// Enable cors
app.use(cors());

// Routes: return json response
// Request from enpoint
app.get('/video', (req, res) => res.json(videos));

// The Player view makes a request to matching endpoint
app.get('/video/:id/data', (req, res) => {
    // Request returns an object where the ID is parsed to an integer...
    const id = parseInt(req.params.id, 10);
    // .. use the ID to send requested matadata for the video back to the client
    res.json(video[id]);
})

// Request stream from route
app.get('/video/:id', (req, res) => {
    // Get ID and generate path then read the file, obtaining the size...
    const path = `assets/${req.params.id}.mp4`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    // The range param lets server know whick chunk to sent to the client
    const range = req.headers.range;
    // If a range has been included in the browsers request
    if (range) {
        // Find the start and end values from the range
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        // This chunk size
        const chunksize = (end-start) + 1;
        // Stream from start - end from the path
        const file = fs.createReadStream(path, {start, end});
        // Send the updated info in the header
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        // HTTP 206 = partial content, browser keeps making requests until all content is sent
        res.writeHead(206, head);
        file.pipe(res);
    // If the browser doesnt send a range
    } else {
        // Get file size and...
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        // ...send the first few chunks of the video...
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
        // ...after this subsiquent requests will include a range
    }
});

// Get the poster thumbnail - uses thumbsupply package
app.get('/video/:id/poster', (req, res) => {
    thumbsupply.generateThumbnail(`assets/${req.params.id}.mp4`)
    .then(thumb => res.sendFile(thumb));
});

// Serves the caption for any ID, *change for each ID
app.get('/video/:id/caption', (req, res) => 
    res.sendFile('assets/captions/sample.vtt', { root: __dirname })
);

// Server port
app.listen(portNo, () => {
    console.log("Listening on port " + portNo + "!");
});
// http://localhost:4000/video

