// controllers/servicioController.js
const Servicio = require('../models/Servicio');

// Obtener todos los servicios
const getServicios = async (req, res, next) => {
  try {
    const servicios = await Servicio.findAll();
    res.json({
      servicios,
      total: servicios.length
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un servicio por ID
const getServicioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findById(id);

    if (!servicio) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    res.json({ servicio });
  } catch (error) {
    next(error);
  }
};

// Crear nuevo servicio (solo admin)
const createServicio = async (req, res, next) => {
  try {
    const { nombre, descripcion, duracion, precio, disponible } = req.body;

    // Validaciones
    if (!nombre || !duracion || !precio) {
      return res.status(400).json({
        error: 'Nombre, duración y precio son requeridos'
      });
    }

    if (duracion <= 0) {
      return res.status(400).json({
        error: 'La duración debe ser mayor a 0 minutos'
      });
    }

    if (precio <= 0) {
      return res.status(400).json({
        error: 'El precio debe ser mayor a 0'
      });
    }

    const servicioId = await Servicio.create({
      nombre,
      descripcion: descripcion || null,
      duracion,
      precio,
      disponible: disponible !== undefined ? disponible : true
    });

    const nuevoServicio = await Servicio.findById(servicioId);

    res.status(201).json({
      message: 'Servicio creado exitosamente',
      servicio: nuevoServicio
    });

  } catch (error) {
    next(error);
  }
};

// Actualizar servicio (solo admin)
const updateServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, duracion, precio, disponible } = req.body;

    // Verificar que el servicio existe
    const servicioExistente = await Servicio.findById(id);
    if (!servicioExistente) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    // Validaciones
    if (!nombre || !duracion || !precio) {
      return res.status(400).json({
        error: 'Nombre, duración y precio son requeridos'
      });
    }

    if (duracion <= 0) {
      return res.status(400).json({
        error: 'La duración debe ser mayor a 0 minutos'
      });
    }

    if (precio <= 0) {
      return res.status(400).json({
        error: 'El precio debe ser mayor a 0'
      });
    }

    const actualizado = await Servicio.update(id, {
      nombre,
      descripcion: descripcion || null,
      duracion,
      precio,
      disponible: disponible !== undefined ? disponible : true
    });

    if (!actualizado) {
      return res.status(500).json({
        error: 'No se pudo actualizar el servicio'
      });
    }

    const servicioActualizado = await Servicio.findById(id);

    res.json({
      message: 'Servicio actualizado exitosamente',
      servicio: servicioActualizado
    });

  } catch (error) {
    next(error);
  }
};

// Eliminar servicio (solo admin)
const deleteServicio = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que el servicio existe
    const servicioExistente = await Servicio.findById(id);
    if (!servicioExistente) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    const eliminado = await Servicio.delete(id);

    if (!eliminado) {
      return res.status(500).json({
        error: 'No se pudo eliminar el servicio'
      });
    }

    res.json({
      message: 'Servicio eliminado exitosamente'
    });

  } catch (error) {
    // Si hay citas asociadas, no se puede eliminar
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        error: 'No se puede eliminar el servicio porque tiene citas asociadas'
      });
    }
    next(error);
  }
};

module.exports = {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio
};
