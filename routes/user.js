'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: "./uploads/animals/"});
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');


var api = express.Router();

//api.get('/users', [md_auth.ensureAuth, md_admin.isAdmin], UserController.prueba);
api.post('/register',UserController.register);
api.post('/login',UserController.login);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updatedUser);
api.delete('/delete-user/:id', [md_auth.ensureAuth, md_admin.isAdmin], UserController.deleteUser);
api.put('/set-admin-role/:id', [md_auth.ensureAuth, md_admin.isAdmin], UserController.convertAdmin);
api.put('/forgot-password', UserController.forgotPassword);

module.exports = api;
