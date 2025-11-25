// controllers/authController.js
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrar nuevo usuario
const register = async (req, res, next) => {
  try {
    const { nombre, email, password, telefono, rol } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Nombre, email y contraseña son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Formato de email inválido'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el email ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'El email ya está registrado'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await argon2.hash(password);

    // Crear usuario
    const userId = await User.create({
      nombre,
      email,
      password: hashedPassword,
      telefono: telefono || null,
      rol: rol || 'cliente'
    });

    // Obtener usuario creado (sin contraseña)
    const newUser = await User.findById(userId);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: newUser
    });

  } catch (error) {
    next(error);
  }
};

// Iniciar sesión
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );

    // Respuesta exitosa
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    next(error);
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      usuario: user
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
