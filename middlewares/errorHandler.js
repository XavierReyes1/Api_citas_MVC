// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', err);

  // Error de validación de MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      error: 'Ya existe un registro con esos datos',
      details: err.sqlMessage
    });
  }

  // Error de clave foránea
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: 'Referencia inválida a otro registro'
    });
  }

  // Error de sintaxis SQL
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(500).json({
      error: 'Error en la base de datos',
      details: process.env.NODE_ENV === 'development' ? err.sqlMessage : undefined
    });
  }

  // Error JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado'
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;