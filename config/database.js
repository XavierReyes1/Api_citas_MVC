//configuracion para la base de datos en docker

// config/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: 3310,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_citas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

// Verificar conexión con reintentos
const conectarConReintentos = async (reintentos = 5, delay = 2000) => {
  for (let i = 0; i < reintentos; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('✅ Conexión exitosa a la base de datos MySQL');
      connection.release();
      return;
    } catch (err) {
      console.log(`Intento ${i + 1}/${reintentos} fallido. Esperando ${delay}ms...`);
      if (i < reintentos - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('❌ Error al conectar a la base de datos:', err.message);
      }
    }
  }
};

conectarConReintentos();

module.exports = pool;
