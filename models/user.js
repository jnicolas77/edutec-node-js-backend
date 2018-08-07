'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    lastname: String,
    image: String,
    email: String,
    role: String,
    password: String
});

module.exports = mongoose.model('User', UserSchema);