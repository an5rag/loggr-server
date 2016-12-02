'use strict';

// GET PACKAGES
// ==============================================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const config = require('./config'); // get our config file


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
const allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    next();
};
app.use(allowCrossDomain);



// ROUTES
// ==============================================
app.use('/api/user', require('./models/user/routes'));
app.use('/api/line', require('./models/line/routes'));
app.use('/api/entry', require('./models/entry/routes'));

// CONNECT DATABASE AND START THE SERVER
// ==============================================

// Use environment defined port or 4000
const port = process.env.PORT || 4000;

mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to the database!");
    app.listen(port, () => {
        console.log("Listening on port:", port);
    });
});
