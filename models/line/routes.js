const express = require('express');
const router = express.Router();
const Line = require('./schema');
const auth = require('./../services.js');

/**
 * Add a new Line
 */
router.post('/', (req, res, next) => {

    // // if no user is signed in, then return 401 Unauthorized
    // if (!req.user) {
    //     return res.status(401).json({
    //         success: false,
    //         error: 'loginError'
    //     });
    // }

    console.log(req.body);
    const body = req.body;
    const newLine = new Line({
        name: body.name,
        description: body.description,
        constraints: body.constraints,
        companyId: body.companyId,
        managers: body.managers
    });
    // if (req.user && req.user.userType == 'EMPLOYEE') {
    if (false) {
        res.status(403).json({
            success: false,
            error: 'You don\'t have the privilege necessary to add the line'
        });
    } else {
        newLine.save((err, line) => {
            if (err) {
                return res.status(422).json({
                    error: err.name,
                    message: err.message,
                });
            } else {
                res.status(201).json({
                    message: 'Line Added!',
                    line
                });
            }
        });
    }
});

/**
 * Gets all the lines
 * Params:
 * limit (number)
 * column (value)
 *
 */
router.get('/', (req, res) => {

    // // if no user is signed in, then return 401 Unauthorized
    // if (!req.user) {
    //     return res.status(401).json({
    //         success: false,
    //         error: 'loginError'
    //     });
    // }

    const query = {};
    var limit = query.limit ? parseInt(req.query.limit.toString()) : null;
    const sort = req.query.sortBy ? req.query.sortBy : {};
    const order = req.query.order ? req.query.oder : {};
    for (var key in req.query) {
        if (key != 'limit' && key != 'sort' && key != 'order') {
            query[key] = req.query[key];
        }
    }

    lines = Line.findLines((err, lines) => {
        if (err) {
            res.status(500).json({
                error: err.message
            })
        } else {
            res.status(200).send(lines);
        }
    }, query, limit);

});

module.exports = router;
