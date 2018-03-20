'use strict';
const bodyParser    = require('body-parser');
const config        = require('../config');
const dbExec        = require('./database')('inventory');
const express       = require('express');
const path          = require('path');
const userRouter    = require('./router/users');
const Users         = require('./controller/Users')(dbExec);

var cookieParser    = require('cookie-parser');
var LocalStrategy   = require('passport-local').Strategy;
var passport        = require('passport');
var session         = require('express-session');

/**
 * Questions:
 *
 * 
 * 3. How to get initial page load data? Three options:
 *     - Server stores cookies and browser reads cookies
 *     - Create a REST endpoint for initial load
 *     - Generate a dynamic JavaScript file
 */

// create the express app
const app = express();

// tell passport to use a local strategy and tell it how to validate a username and password
passport.use(new LocalStrategy(function(username, password, done) {
    Users.authenticate(username, password)
        .then(authenticated => {
            if (authenticated) {
                done(null, { username });
            } else {
                done(null, false);
            }
        })
        .catch(err => {
            done(err);  
        });
}));

// tell passport how to turn a user into serialized data that will be stored with the session
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

// tell passport how to go from the serialized data back to the user
passport.deserializeUser(function(id, done) {
    done(null, { username: id });
});

app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', 
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    userRouter);

app.get('/api/init', (req, res) => {
    res.send({
        friends: [],
        user: req.user
    });
});

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