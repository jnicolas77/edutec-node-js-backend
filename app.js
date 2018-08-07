'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var animalRoutes = require('./routes/animal');
var userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

app.use('/api', animalRoutes);
app.use('/api', userRoutes);

app.get ('/test', (req, res) => {
    res.status(200).send({
        message: 'mi primer'
    });
});

module.exports = app;