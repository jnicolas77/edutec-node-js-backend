'use strict'

var mongoose = require('mongoose');
var port = 3000;
var app = require('./app');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:testEdutec1@ds231961.mlab.com:31961/edutec-nodejs-zoo')
    .then(() => {
        console.log('La consexion a mongo a sido exitosa');
        app.listen(port, () => {
            console.log('El servidor local de node y express esta corriendo');
        });
    })
    .catch(err => console.log(err));