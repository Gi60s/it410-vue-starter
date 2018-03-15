'use strict';
const bodyParser    = require('body-parser');
const config        = require('../config');
const express       = require('express');
const path          = require('path');
const userRouter    = require('./router/users');

/**
 * Questions:
 * 
 * 1. Do we want HTML5 or hash routing? 
 * 
 * 2. Should index.html redirect to /?
 * 
 * 3. How to get initial page load data? Three options:
 *     - Server stores cookies and browser reads cookies
 *     - Create a REST endpoint for initial load
 *     - Generate a dynamic JavaScript file
 */

// create the express app
const app = express();

app.use('/api/users', bodyParser.json(), userRouter);

// serve index.html and static files
app.use(express.static(config.build.dest));

// make HTML5 routes work
app.use((req, res, next) => {
    if (req.method === 'GET') {
        const indexPath = path.resolve(config.build.dest, 'index.html');
        res.sendFile(indexPath);
    } else {
        next();
    }
});

// start listening for requests
const listener = app.listen(config.server.port, function(err) {
    if (err) throw err;

    const port = listener.address().port;
    console.log('Server listening on port: ' + port);

    // in development mode the server is started as a child process and
    // this next line will tell the parent process that the server is ready
    if (process.send) process.send({ type: 'server-listening', port: port });
});