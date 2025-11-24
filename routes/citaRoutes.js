// routes/citaRoutes.js
//importando express 
const express = require('express');
//creando el router para las rutas de citas
const router = express.Router();
//llamando los controllers para las citas
const {

  getMisCitas,
  createCita,
  cancelarCita,
  getAllCitas,
  updateCitaStatus
} = require('../controllers/citaController');