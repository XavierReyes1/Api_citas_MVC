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

const { verifyToken, isAdmin } = require('../middlewares/auth');

// Añadiendo las rutas para clientes (autenticados)
router.get('/', verifyToken, getMisCitas);
router.post('/', verifyToken, createCita);
router.delete('/:id', verifyToken, cancelarCita);

// Añadiendo las rutas para administrador
router.get('/admin/todas', verifyToken, isAdmin, getAllCitas);
router.patch('/admin/:id/estado', verifyToken, isAdmin, updateCitaStatus);

module.exports = router;