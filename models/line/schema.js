var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LineSchema = Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        dropDups: true,
        trim: true
    },
    description: {
        type: String
    },
    constraints: {
        type: []
    },
    companyId: {
        type: String,
        default: '000'
    },
    managers: {
        type: [String],
    },
    creator: {
        type: String
    }
});

LineSchema.statics.findLines = function search(cb, query, limit, sort, lesserThan, greaterThan) {
    this.find(query)
        .limit(limit)
        .exec(function(err, lines) {
            if (err) {
                cb(err, []);
            } else {
                cb(null, lines);
            }
        });
};

module.exports = mongoose.model('Line', LineSchema, 'lines');
