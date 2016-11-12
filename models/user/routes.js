var express = require('express');
var router = express.Router();
var User = require('./schema');
const passport = require('passport');

/**
 * Register a new User
 */
router.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        userType: req.body.userType
    });

    User.register(newUser, req.body.password, (err, user) => {
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

/**
 * Login an existing User
 */
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.status(200).json({
        success: true,
        username: req.user.username
    });
});

/**
 * Get Login
 */

router.get('/login', (req, res) => {
    if (req.user) {
        return res.send({
            success: true,
            user: req.user
        });
    }

    res.send({
        success: false,
        message: 'No user logged in.'
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
