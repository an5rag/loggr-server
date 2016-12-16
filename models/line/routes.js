const express = require('express');
const router = express.Router();
const Line = require('./schema');
const authenticate = require('./../services');

/**
 * Add a new Line
 */

// router.use(authenticate);

router.post('/', (req, res, next) => {
    const body = req.body;
    const newLine = new Line({
        name: body.name,
        description: body.description,
        constraints: body.constraints,
        companyId: body.companyId,
        creator: body.creator,
        managers: body.managers
    });

    if (false) {
        res.status(403).json({
            success: false,
            error: 'You don\'t have the privilege necessary to add the line'
        });
    } else {
        newLine.save((err, line) => {
            if (err) {
                console.log(err);
                return res.status(422).json({
                    error: err.name,
                    message: err.message,
                });
            } else {
                res.status(201).json({
                    message: 'Line Added!',
                    line: line
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
    const query = {};
    var limit = query.limit ? parseInt(req.query.limit.toString()) : null;

    for (var key in req.query) {
        if (key != 'limit' && key != 'sort' && key != 'order') {
            query[key] = req.query[key];
        }
    }

    lines = Line.find((err, lines) => {
        if (err) {
            res.status(500).json({
                error: err.message
            })
        } else {
            res.status(200).json({
                lines
            });
        }
    }, query, limit);

});

// update line by id
router.put('/', function(req, res) {
    const id = req.query.id? req.query.id : req.body.id;
    Line.findByIdAndUpdate(id, req.body, {
        new: true
    }, (err, line) => {
        if (err) {
            res.status(500).json({
                error: err.message
            })
        } else {
            res.status(200).json({
                line
            });
        }
    });

});

router.delete('/:id', function(req, res, next) {
  Line.findById(req.params.id, function (err, line) {
    if(err) {
        return next(err);
    }
    if(!line) {
        return res.send(404);
    }
    line.remove(function(err) {
        if (err) {
            res.statusCode = 403;
            res.send(err);
        } else {
            res.send({
                message: 'Line deleted!'
            });
        }
    });
  });
});

module.exports = router;
