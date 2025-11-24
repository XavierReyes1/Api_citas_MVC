require('dotenv').config();
const express = require('express');
const errorHandler = require('./middlewares/errorHandler');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const citaRoutes = require('./routes/citaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API de Reservación de Citas - Clínica',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      servicios: '/api/servicios',
      citas: '/api/citas',
      admin: '/api/admin'
    }
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/citas', citaRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);

});