const db = require('../config/database');

class Servicio {
  // Crear nuevo servicio
  static async create(servicioData) {
    const { nombre, descripcion, duracion, precio, disponible } = servicioData;
    const query = `
      INSERT INTO servicios (nombre, descripcion, duracion, precio, disponible)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      nombre, 
      descripcion, 
      duracion, 
      precio, 
      disponible !== undefined ? disponible : true
    ]);
    return result.insertId;
  }

  // Obtener todos los servicios
  static async findAll() {
    const query = 'SELECT * FROM servicios ORDER BY nombre';
    const [rows] = await db.execute(query);
    return rows;
  }

  // Obtener solo servicios disponibles
  static async findAvailable() {
    const query = 'SELECT * FROM servicios WHERE disponible = true ORDER BY nombre';
    const [rows] = await db.execute(query);
    return rows;
  }

  // Buscar servicio por ID
  static async findById(id) {
    const query = 'SELECT * FROM servicios WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Actualizar servicio
  static async update(id, servicioData) {
    const { nombre, descripcion, duracion, precio, disponible } = servicioData;
    const query = `
      UPDATE servicios 
      SET nombre = ?, descripcion = ?, duracion = ?, precio = ?, disponible = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [
      nombre, 
      descripcion, 
      duracion, 
      precio, 
      disponible,
      id
    ]);
    return result.affectedRows > 0;
  }

  // Eliminar servicio
  static async delete(id) {
    const query = 'DELETE FROM servicios WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Verificar si un servicio está disponible
  static async isAvailable(id) {
    const query = 'SELECT disponible FROM servicios WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows.length > 0 && rows[0].disponible;
  }

  // Verificar si existe un servicio
  static async exists(id) {
    const query = 'SELECT id FROM servicios WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows.length > 0;
  }
}

module.exports = Servicio;