const express = require('express');
const router = express.Router();
const Entry = require('./schema');
const authenticate = require('./../services');

/**
 * Add a new Entry
 */

// router.use(authenticate);

router.post('/', (req, res, next) => {
    const body = req.body;
    const newEntry = new Entry(Object.assign({}, body.constraints, {
        lineId: body.lineId,
        lineName: body.lineName,
        creator: body.creator,
        inProgress: body.ended,
        createdOn: body.createdOn,
        endedOn: body.endedOn,
        ender: body.ender
    }));

    if (false) {
        res.status(403).json({
            success: false,
            error: 'You don\'t have the privilege necessary to add the line'
        });
    } else {
        newEntry.save((err, entry) => {
            if (err) {
                console.log(err);
                return res.status(422).json({
                    error: err.name,
                    message: err.message,
                });
            } else {
                res.status(201).json({
                    message: 'Entry Added!',
                    entry
                });
            }
        });
    }
});

/**
 * Gets all the entries
 * Params:
 * limit (number)
 * column (value)
 *
 */
router.get('/', (req, res) => {
    const query = {};
    var limit = req.query.limit ? parseInt(req.query.limit.toString()) : null;
    const sort = req.query.sortBy ? req.query.sortBy : {};
    const order = req.query.order ? req.query.oder : {};

    for (var key in req.query) {
        if (key != 'limit' && key != 'sort' && key != 'order') {
            query[key] = req.query[key];
        }
    }

    Entry.find(query)
        .limit(limit)
        .sort({
            createdOn: 'desc'
        })
        .exec((err, entries) => {
            if (err) {
                res.status(500).json({
                    error: err.message
                })
            } else {
                Entry.count(query, function(err, count) {
                    res.status(200).json({
                        entries,
                        count
                    });
                });
            }
        });

});
/**
 * Gets all in Progress entries
 * Params:
 * limit (number)
 * column (value)
 *
 */
router.get('/inprogress', (req, res) => {
    const query = {};
    var limit = req.query.limit ? parseInt(req.query.limit.toString()) : null;
    const sort = req.query.sortBy ? req.query.sortBy : {};
    const order = req.query.order ? req.query.oder : {};

    for (var key in req.query) {
        if (key != 'limit' && key != 'sort' && key != 'order') {
            query[key] = req.query[key];
        }
    }

    query.inProgress = true;

    Entry.find(query)
        .limit(limit)
        .sort({
            createdOn: 'desc'
        })
        .exec((err, entries) => {
            if (err) {
                res.status(500).json({
                    error: err.message
                })
            } else {
                Entry.count(query, function(err, count) {
                    res.status(200).json({
                        entries,
                        count
                    });
                });
            }
        });

});

// update entry by id
router.put('/', function(req, res) {
    Entry.findByIdAndUpdate(req.query.id, req.body, {
        new: true
    }, (err, entry) => {
        if (err) {
            res.status(500).json({
                error: err.message
            })
        } else {
            res.status(200).json({
                entry
            });
        }
    });

});

module.exports = router;
ports = router;
