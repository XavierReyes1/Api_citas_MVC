//Para la ruta de routes/authRoutes.js
//rutas de autenticación 
const express = require('express')
const router = express.Router() //creando el router 

//importando los controllerss 
const { register, login, getProfile } = require('../controllers/authController')

//llamando al middleware de autenticacion de token
const { verifyToken } = require('../middlewares/auth');

//para las rutas públicas
router.post('/register', register);
router.post('/login', login);

// para las rutas protegidas
router.get('/profile', verifyToken, getProfile);

//exportar el router
module.exports = router;