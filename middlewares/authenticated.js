'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'desencriptacion-de-token';

exports.ensureAuth = function(req, res, next) {
	var authorizationHeader = req.headers.authorization;
	if (!authorizationHeader){

		return res.status(403).send({//forbiden
			message: 'La petición debe de contener un header de autenticación'
		});

	}

	var token = req.headers.authorization.replace(/['"]+/g,'');
	try{

		var payload = jwt.decode(token, secret);
		var expiredDate = payload.exp;
		var currentDate = moment().unix();
		if (expiredDate <= currentDate){
			return res.status(401).send({
				message: 'El token ha expirado'
			});
		}

		console.log(payload);

	}  catch (exception){
		return res.status(404).send({
				message: 'Token inválido'
			});
	}

	req.user = payload;

	next();
};