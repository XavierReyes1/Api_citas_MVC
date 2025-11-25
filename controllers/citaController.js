// controllers/citaController.js
const Cita = require('../models/Cita');
const Servicio = require('../models/Servicio');

// Obtener todas las citas del usuario autenticado
const getMisCitas = async (req, res, next) => {
  try {
    const citas = await Cita.findByUserId(req.user.id);
    res.json({
      citas,
      total: citas.length
    });
  } catch (error) {
    next(error);
  }
};

// Crear nueva cita
const createCita = async (req, res, next) => {
  try {
    const { servicio_id, fecha, hora, notas } = req.body;
    const usuario_id = req.user.id;

    // Validaciones básicas
    if (!servicio_id || !fecha || !hora) {
      return res.status(400).json({
        error: 'Servicio, fecha y hora son requeridos'
      });
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      return res.status(400).json({
        error: 'Formato de fecha inválido. Use YYYY-MM-DD'
      });
    }

    // Validar formato de hora (HH:MM:SS)
    const horaRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (!horaRegex.test(hora)) {
      return res.status(400).json({
        error: 'Formato de hora inválido. Use HH:MM:SS o HH:MM'
      });
    }

    // Agregar segundos si no están presentes
    const horaFormateada = hora.length === 5 ? `${hora}:00` : hora;

    // Verificar que la fecha no sea en el pasado
    const fechaCita = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaCita < hoy) {
      return res.status(400).json({
        error: 'No se pueden crear citas en fechas pasadas'
      });
    }

    // Verificar que el servicio existe y está disponible
    const servicio = await Servicio.findById(servicio_id);
    if (!servicio) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    if (!servicio.disponible) {
      return res.status(400).json({
        error: 'El servicio no está disponible actualmente'
      });
    }

    // Verificar disponibilidad del usuario (evitar citas duplicadas)
    const disponible = await Cita.checkAvailability(usuario_id, fecha, horaFormateada);
    if (!disponible) {
      return res.status(400).json({
        error: 'Ya tienes una cita programada en esta fecha y hora'
      });
    }

    // Verificar conflictos de horario considerando la duración
    const sinConflicto = await Cita.checkTimeConflict(servicio_id, fecha, horaFormateada);
    if (!sinConflicto) {
      return res.status(400).json({
        error: 'El horario solicitado no está disponible debido a conflictos con otras citas'
      });
    }

    // Crear la cita
    const citaId = await Cita.create({
      usuario_id,
      servicio_id,
      fecha,
      hora: horaFormateada,
      notas: notas || null
    });

    const nuevaCita = await Cita.findById(citaId);

    console.log(`✅ Nueva cita creada - ID: ${citaId}, Usuario: ${usuario_id}, Fecha: ${fecha} ${horaFormateada}`);

    res.status(201).json({
      message: 'Cita creada exitosamente',
      cita: nuevaCita
    });

  } catch (error) {
    next(error);
  }
};

// Cancelar/Eliminar una cita del usuario
const cancelarCita = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    // Verificar que la cita existe
    const cita = await Cita.findById(id);
    if (!cita) {
      return res.status(404).json({
        error: 'Cita no encontrada'
      });
    }

    // Verificar que la cita pertenece al usuario
    if (cita.usuario_id !== usuario_id) {
      return res.status(403).json({
        error: 'No tienes permiso para cancelar esta cita'
      });
    }

    // Verificar que la cita no esté ya cancelada
    if (cita.estado === 'cancelada') {
      return res.status(400).json({
        error: 'La cita ya está cancelada'
      });
    }

    // Cancelar la cita (marcar como cancelada)
    const cancelada = await Cita.cancel(id);

    if (!cancelada) {
      return res.status(500).json({
        error: 'No se pudo cancelar la cita'
      });
    }

    console.log(`❌ Cita cancelada - ID: ${id}, Usuario: ${usuario_id}`);

    res.json({
      message: 'Cita cancelada exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

// Obtener todas las citas (solo admin)
const getAllCitas = async (req, res, next) => {
  try {
    const citas = await Cita.findAll();
    res.json({
      citas,
      total: citas.length
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar estado de cita (solo admin)
const updateCitaStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar estado
    const estadosValidos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: `Estado inválido. Use: ${estadosValidos.join(', ')}`
      });
    }

    // Verificar que la cita existe
    const cita = await Cita.findById(id);
    if (!cita) {
      return res.status(404).json({
        error: 'Cita no encontrada'
      });
    }

    // Actualizar estado
    const actualizado = await Cita.updateStatus(id, estado);

    if (!actualizado) {
      return res.status(500).json({
        error: 'No se pudo actualizar el estado de la cita'
      });
    }

    const citaActualizada = await Cita.findById(id);

    console.log(`📝 Estado de cita actualizado - ID: ${id}, Nuevo estado: ${estado}`);

    res.json({
      message: 'Estado de cita actualizado exitosamente',
      cita: citaActualizada
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMisCitas,
  createCita,
  cancelarCita,
  getAllCitas,
  updateCitaStatus
};
