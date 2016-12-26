const express = require('express');
const router = express.Router();
const Entry = require('./schema');
const Line = require('../line/schema');
const authenticate = require('./../services');
const json2csv = require('json2csv');
var fs = require('fs');
const _ = require('lodash');

/**
 * Add a new Entry
 */

// router.use(authenticate);

router.post('/', (req, res, next) => {
    const body = req.body;
    const newEntry = new Entry(Object.assign({}, body.constraints, {
        lineId: body.lineId,
        lineName: body.lineName,
        'Employee Clock In': body['Employee Clock In'],
        'Employee Clock Out': body['Employee Clock Out'],
        'System Clock In': body['System Clock In'],
        'System Clock Out': body['System Clock Out'],
        'inProgress': body.inProgress
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

    for (var key in req.query) {
        if (key != 'limit' && key != 'sort' && key != 'order') {
            query[key] = req.query[key];
        }
    }

    Entry.find(query)
        .lean()
        .limit(limit)
        .sort({
            'System Clock In': 'desc'
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
Gets csv file
**/
router.get('/export/', function(req, res) {
    const query = {lineId: req.query.lineId};
    query['System Clock In']={"$gte": (req.query.startDate ? req.query.startDate : new Date(-8640000000000000)), "$lt": (req.query.endDate? req.query.endDate : new Date())};

    const fields = [
        'System Clock In',
        'System Clock Out',
        'Employee Clock In',
        'Employee Clock Out',
        'inProgress'
    ]

    Line.findById(req.query.lineId, function (err, line) {
          if(err) {
              return next(err);
          }
          if(!line) {
              return res.send(404);
          }
          for(var i = 0; i <line.constraints.length; i++){
              fields.push(line.constraints[i].name);
          }
          Entry.find(query)
            .lean()
              .sort({
                  'System Clock In': 'desc'
              })
              .exec((err, entries) => {
                  if (err) {
                      res.status(500).json({
                          error: err.message
                      })
                  } else {
                      var csv = '';
                      _.forEach(fields, function(field) {
                            csv += (field + ',')
                      });
                      csv = csv.slice(0, -1);
                      csv+='\n';

                      _.forEach(entries, function(entry) {
                          _.forEach(fields, function(field){

                              csv += (entry[field] != undefined? String(entry[field])+',' : ',');
                          })
                          csv+='\n';
                        });

                      //csv = json2csv({ data: entries, fields});
                      console.log(csv);
                      res.set({"Content-Disposition":"attachment; filename=\"export.csv\""});
                      res.send(csv);
                  }
          });
    });
})

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
