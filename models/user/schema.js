const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: {type: String, required: true, trim: true, unique: true},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, trim: true},
    email: {type: String, trim: true},
    userType: {
        type: String,
        enum: ['EMPLOYEE', 'MANAGER', 'ADMIN'],
        default: 'EMPLOYEE'
    },
    phone: {type: String, trim: true},
    companyId: {type: String, default: '000'},
    password: {type: String, required: true}
});

module.exports = mongoose.model('User', UserSchema, 'users');
