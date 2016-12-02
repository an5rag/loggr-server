var express = require('express');
var router = express.Router();
var User = require('./schema');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../../config'); // get our config file

/**
 * Register a new User
 */
router.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        userType: req.body.userType,
        password: req.body.password
    });

    newUser.save((err, user) => {
        if (err) {
            var errors = [];
            if (err.name == 'ValidationError') {
                for (field in err.errors) {
                    errors.push(err.errors[field].message);
                }
            }
            return res.status(422).json({
                success: false,
                error: err.name,
                message: err.message,
                details: errors
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'New User Added.',
                user
            });
        }
    });
});

router.get('/', (req, res) => {
    const users = User.find().exec((err, users) => {
        res.send({
            success: true,
            users
        });
    });

});

router.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
        username: req.body.username
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {

                // if user is found and password is right
                // create a token
                var userToken = {
                    username: user.username,
                    userType: user.userType
                };

                var token = jwt.sign(userToken, config.secret, {
                    expiresIn: 1 * 60 * 60 // expires in 1 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    token: token,
                    username: user.username,
                    name: user.firstName,
                    userType: user.userType
                });
            }

        }

    });
});

/**
 * Log out the current user
 */
router.get('/logout', function(req, res) {
    const user = req.user;
    req.logout();
    res.status(200).json({
        sucess: true,
        message: "Logged out!",
        user
    });
});

module.exports = router;
