'use strict'

var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var app = require('./app');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://test:testEdutec1@ds231961.mlab.com:31961/edutec-nodejs-zoo')
mongoose.connect('mongodb://jnicolas:nicoss1@ds231961.mlab.com:31961/edutec_zoo_nico')
//mongoose.connect('mongodb://localhost:27017/zoo');

app.listen(port);
console.log('Edutec Backend is running')
