const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: {type: String, required: true, trim: true},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, trim: true},
    email: {type: String, required: true, trim: true},
    userType: {
        type: String,
        enum: ['EMPLOYEE', 'MANAGER', 'OWNER'],
        default: 'EMPLOYEE'
    },
    phone: {type: String, required: true, trim: true},
    companyId: {type: String, default: '000'}
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema, 'users');
