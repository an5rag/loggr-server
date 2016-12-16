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
    'Employee Clock In': {
        type: String
    },
    'Employee Clock Out': {
        type: String
    },
    inProgress: {
        type: Boolean,
        default: true
    },
    'System Clock In': {
        type: Date
    },
    'System Clock Out': {
        type: Date
    }
}, {
    strict: false
});

module.exports = mongoose.model('entry', EntrySchema, 'entries');
