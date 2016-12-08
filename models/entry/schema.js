/**
 * Created by an5ra on 11/2/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrySchema = Schema({
    lineId: {
        type: String,
        required: true,
        trim: true
    },
    lineName: {
        type: String
    },
    creator: {
        type: String
    },
    ender: {
        type: String
    },
    inProgress: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date
    },
    endedOn: {
        type: Date
    }
}, {
    strict: false
});

module.exports = mongoose.model('entry', EntrySchema, 'entries');
