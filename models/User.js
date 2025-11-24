const db = require('../config/database');

class User {
  // Crear nuevo usuario
  static async create(userData) {
    const { nombre, email, password, telefono, rol } = userData;
    const query = `
      INSERT INTO usuarios (nombre, email, password, telefono, rol)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [nombre, email, password, telefono, rol || 'cliente']);
    return result.insertId;
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  // Buscar usuario por ID
  static async findById(id) {
    const query = 'SELECT id, nombre, email, telefono, rol, created_at FROM usuarios WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Obtener todos los usuarios
  static async findAll() {
    const query = 'SELECT id, nombre, email, telefono, rol, created_at FROM usuarios';
    const [rows] = await db.execute(query);
    return rows;
  }

  // Actualizar usuario
  static async update(id, userData) {
    const { nombre, email, telefono } = userData;
    const query = `
      UPDATE usuarios 
      SET nombre = ?, email = ?, telefono = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [nombre, email, telefono, id]);
    return result.affectedRows > 0;
  }

  // Eliminar usuario
  static async delete(id) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Verificar si email existe
  static async emailExists(email, excludeId = null) {
    let query = 'SELECT id FROM usuarios WHERE email = ?';
    const params = [email];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const [rows] = await db.execute(query, params);
    return rows.length > 0;
  }
}

module.exports = User;