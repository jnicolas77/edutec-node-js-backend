'use strict'

//modulos
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

var User = require('../models/user');
var constants = require('../utils/constants').constants


function register (req, res) {
    var user = new User();
    var params = req.body;

    if (params.name && params.lastname && params.email  && params.password ){

        user.name = params.name;
        user.lastname = params.lastname;
        user.email = params.email;
        //user.password = params.password;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({email: user.email.toLowerCase()}, (err, issetUser)=>{
            if (err){
                res.status(500).send({
                        message: constants.ERROR_IN_REQUEST
                });
            }else {
                if (!issetUser){
                    bcrypt.hash(params.password, null, null, (err,hash)=>{
                        user.password = hash;
                        user.save((err, userStored)=>{
                            if (err){
                                res.status(500).send({
                                        message: constants.ERROR_IN_REQUEST
                                });
                            }else {
                                if (!userStored){
                                    res.status(404).send({
                                        message: constants.USER_NOT_SAVE
                                    });
                                }else {
                                    res.status(200).send({
                                        user: userStored,
                                        message: constants.USER_SAVED
                                    });
                                }
                            }
                        });
                    });
                }else {
                    res.status(200).send({
                        message: constants.USER_NOT_REGISTER
                    });
                }
            }
        });

    }else {
        res.status(200).send({
            message: constants.ERROR_PARAMS
        });
    }
    
}

function login(req, res) {

    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err,issetUser)=>{
        if (err) {
            res.status(500).send({
                message: constants.USER_NOT_FOUND
            });
        }else {
            if (issetUser){
                bcrypt.compare(password,issetUser.password,(err,check)=>{
                    if (check){
                        if (params.gettoken){
                            res.status(200).send({//ok
                                token: jwt.createToken(issetUser)
                            });
                        } else {
                            res.status(200).send({//ok
                                user: issetUser
                            });
                        }
                    }else {
                        res.status(200).send({//ok
                            message: "El usuario no se ha logueado correctamente"
                        });
                    }
                })
            }else {
                res.status(404).send({//not found
                    message: "El usuario no ha podido loguearse"
                });
            }
        }
    });


}

function updatedUser (req, res){

    var userID = req.params.id;
    var updateData = req.body;
    delete updateData.password;

    if (userID != req.user.sub){
        res.status(401).send({//no autorizado
            message: "No tiene permiso para modificar este usuario."
        });
    }else {
        User.findOneAndUpdate(userID, updateData, {new: true},(err,userUpdated)=>{
            if (err){
                res.status(500).send({
                    message: 'Error al actualizar el usuario'
                });
            }else {
                if (!userUpdated){
                    res.status(404).send({//no autorizado
                        message: "No se ha podido actualizar el usuario."
                    });
                }else {
                    res.status(200).send({//no autorizado
                        user: userUpdated
                    });
                }
            }
        });
    }

}

function deleteUser (req, res) {
    var userId = req.params.id;

    User.findByIdAndRemove(userId, (err, userRemoved)=>{

        if (err){
            res.status(500).send({
                message: "Error en la peticion."
            });
        }else {
            if (!userRemoved){
                res.status(404).send({//no autorizado
                    message: "No se ha borrado el usuario."
                });
            }else {
                res.status(200).send({//no autorizado
                    message: `El usuario ${userRemoved.email} se ha eliminado con exito`
                });
            }
        }

    });
}

function convertAdmin (req, res){

    var userId = req.params.id;

    User.findByIdAndUpdate(userId, {role: 'ROLE_ADMIN'}, {new: true},(err,userUpdated)=>{
            if (err){
                console.log(err);
                res.status(500).send({
                    message: 'Error al actualizar el usuario'
                });
            }else {
                if (!userUpdated){
                    res.status(404).send({//no autorizado
                        message: "No se ha podido actualizar el usuario."
                    });
                }else {
                    res.status(200).send({
                        message: `El usuario ${userUpdated.email} se ha convertido en usuario`
                    });
                }
            }
        });

}

function forgotPassword (req, res){
    var body_data = req.body;
    
    if (body_data.email && body_data.password) {

        User.findOne({email: body_data.email.toLowerCase()}, (err, issetUser)=>{
            if (err){
                res.status(500).send({
                        message: 'Error en el servidor'
                });
            }else {
                if (issetUser){
                    bcrypt.hash(body_data.password, null, null, (err,hash)=>{
                        
                        User.findByIdAndUpdate(issetUser._id, {password: hash}, {new: true},(err,userUpdated)=>{
                            if (err){
                                res.status(500).send({
                                    message: 'Error al actualizar el usuario'
                                });
                            }else {
                                if (!userUpdated){
                                    res.status(404).send({//no autorizado
                                        message: "No se ha podido actualizar el usuario."
                                    });
                                }else {
                                    res.status(200).send({
                                        message: "Se ha cambiado tu contraseña"
                                    });
                                }
                            }
                        });

                    });
                }else {
                    res.status(200).send({
                        message: 'No existe usuario asociado a este correo electronico'
                    });
                }
            }
        });

    }else {
        res.status(500).send({
                message: 'Ingrese email y password'
        });
    }

    


}


module.exports = {
    register,
    login,
    updatedUser,
    deleteUser,
    convertAdmin,
    forgotPassword

}