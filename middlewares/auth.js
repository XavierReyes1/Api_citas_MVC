// middlewares/auth.js
const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Formato de token inválido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar datos del usuario al request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }
    return res.status(500).json({
      error: 'Error al verificar token'
    });
  }
};

// Middleware para verificar rol de administrador
const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      error: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
  next();
};

// Middleware para verificar que el usuario sea cliente
const isCliente = (req, res, next) => {
  if (req.user.rol !== 'cliente' && req.user.rol !== 'admin') {
    return res.status(403).json({
      error: 'Acceso denegado'
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isCliente
};