'use strict';

// GET PACKAGES
// ==============================================
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('cookie-session');


// DATABASE CONFIGURATIONS
// ==============================================
const DB_URL = 'mongodb://localhost:27017/loggr-sample-db';


// CREATE EXPRESS APPLICATION
// ==============================================
const app = express();


// DEFINE MIDDLEWARE FOR THE APPLICATION
// ==============================================
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Allow CORS so that backend and frontend could be put on different servers
const allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    next();
};
app.use(allowCrossDomain);

//passport
app.use(cookieParser());
app.use(session({
        secret: 'somesecretmessage',
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge: 60000, httpOnly: false  },

}));
app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user/schema');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ROUTES
// ==============================================
app.use('/api/user', require('./models/user/routes'));
app.use('/api/line', require('./models/line/routes'));

// CONNECT DATABASE AND START THE SERVER
// ==============================================

// Use environment defined port or 4000
const port = process.env.PORT || 4000;

mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to the database!");
    app.listen(port, ()=> {
        console.log("Listening on port:", port);
    });
});

