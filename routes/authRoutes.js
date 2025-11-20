//Para la ruta de routes/authRoutes.js
//rutas de autenticación 
const express = require('express')
const router = express.Router() //creando el router 

//importando los controllerss
const { register, login, getProfile } = require('../controllers/authController')