//creando rutas para el service
//importando express y creando el router 
const express = require('express');

const router = express.Router();

const {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio
  
} = require('../controllers/servicioController');

const { verifyToken, isAdmin } = require('../middlewares/auth');
//añadiendo las rutas para las rutas publicas
router.get('/', getServicios);
router.get('/:id', getServicioById);

// añadiendo las rutas para los admins (protegidas) con los middleswares necesarios
router.post('/', verifyToken, isAdmin, createServicio);
router.put('/:id', verifyToken, isAdmin, updateServicio);
router.delete('/:id', verifyToken, isAdmin, deleteServicio);

module.exports = router;
