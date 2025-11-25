const db = require('../config/database');

class Cita {
  // Crear nueva cita
  static async create(citaData) {
    const { usuario_id, servicio_id, fecha, hora, notas } = citaData;
    const query = `
      INSERT INTO citas (usuario_id, servicio_id, fecha, hora, estado, notas)
      VALUES (?, ?, ?, ?, 'pendiente', ?)
    `;
    const [result] = await db.execute(query, [usuario_id, servicio_id, fecha, hora, notas || null]);
    return result.insertId;
  }

  // Obtener todas las citas de un usuario
  static async findByUserId(usuario_id) {
    const query = `
      SELECT 
        c.id,
        c.fecha,
        c.hora,
        c.estado,
        c.notas,
        c.created_at,
        s.nombre as servicio_nombre,
        s.descripcion as servicio_descripcion,
        s.duracion as servicio_duracion,
        s.precio as servicio_precio
      FROM citas c
      INNER JOIN servicios s ON c.servicio_id = s.id
      WHERE c.usuario_id = ?
      ORDER BY c.fecha DESC, c.hora DESC
    `;
    const [rows] = await db.execute(query, [usuario_id]);
    return rows;
  }

  // Obtener todas las citas (para admin)
  static async findAll() {
    const query = `
      SELECT 
        c.id,
        c.fecha,
        c.hora,
        c.estado,
        c.notas,
        c.created_at,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
        u.telefono as usuario_telefono,
        s.nombre as servicio_nombre,
        s.descripcion as servicio_descripcion,
        s.duracion as servicio_duracion,
        s.precio as servicio_precio
      FROM citas c
      INNER JOIN usuarios u ON c.usuario_id = u.id
      INNER JOIN servicios s ON c.servicio_id = s.id
      ORDER BY c.fecha DESC, c.hora DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Buscar cita por ID
  static async findById(id) {
    const query = `
      SELECT 
        c.*,
        s.nombre as servicio_nombre,
        s.duracion as servicio_duracion,
        s.precio as servicio_precio,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM citas c
      INNER JOIN servicios s ON c.servicio_id = s.id
      INNER JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Verificar disponibilidad (evitar citas duplicadas)
  static async checkAvailability(usuario_id, fecha, hora, excludeCitaId = null) {
    let query = `
      SELECT id FROM citas 
      WHERE usuario_id = ? AND fecha = ? AND hora = ? AND estado != 'cancelada'
    `;
    const params = [usuario_id, fecha, hora];

    if (excludeCitaId) {
      query += ' AND id != ?';
      params.push(excludeCitaId);
    }

    const [rows] = await db.execute(query, params);
    return rows.length === 0; // true si está disponible
  }

  // Verificar conflictos de horario considerando la duración del servicio
  static async checkTimeConflict(servicio_id, fecha, hora, excludeCitaId = null) {
    // Obtener duración del servicio
    const [servicioRows] = await db.execute(
      'SELECT duracion FROM servicios WHERE id = ?',
      [servicio_id]
    );

    if (servicioRows.length === 0) {
      return false;
    }

    const duracion = servicioRows[0].duracion;

    // Verificar si hay citas que se traslapen
    let query = `
      SELECT c.id, c.hora, s.duracion
      FROM citas c
      INNER JOIN servicios s ON c.servicio_id = s.id
      WHERE c.fecha = ? AND c.estado != 'cancelada'
    `;
    const params = [fecha];

    if (excludeCitaId) {
      query += ' AND c.id != ?';
      params.push(excludeCitaId);
    }

    const [rows] = await db.execute(query, params);

    // Convertir hora a minutos para comparación
    const [h, m] = hora.split(':').map(Number);
    const horaInicio = h * 60 + m;
    const horaFin = horaInicio + duracion;

    for (const cita of rows) {
      const [ch, cm] = cita.hora.split(':').map(Number);
      const citaInicio = ch * 60 + cm;
      const citaFin = citaInicio + cita.duracion;

      // Verificar traslape
      if (
        (horaInicio >= citaInicio && horaInicio < citaFin) ||
        (horaFin > citaInicio && horaFin <= citaFin) ||
        (horaInicio <= citaInicio && horaFin >= citaFin)
      ) {
        return false; // Hay conflicto
      }
    }

    return true; // No hay conflicto
  }

  // Cancelar cita (marcar como cancelada)
  static async cancel(id) {
    const query = 'UPDATE citas SET estado = "cancelada" WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Eliminar cita completamente
  static async delete(id) {
    const query = 'DELETE FROM citas WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Actualizar estado de cita
  static async updateStatus(id, estado) {
    const query = 'UPDATE citas SET estado = ? WHERE id = ?';
    const [result] = await db.execute(query, [estado, id]);
    return result.affectedRows > 0;
  }

  // Verificar si una cita pertenece a un usuario
  static async belongsToUser(citaId, userId) {
    const query = 'SELECT id FROM citas WHERE id = ? AND usuario_id = ?';
    const [rows] = await db.execute(query, [citaId, userId]);
    return rows.length > 0;
  }
}

module.exports = Cita;