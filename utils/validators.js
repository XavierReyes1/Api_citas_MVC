// utils/validators.js

// Validar email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar formato de fecha (YYYY-MM-DD)
const isValidDate = (dateString) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Validar formato de hora (HH:MM:SS)
const isValidTime = (timeString) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return timeRegex.test(timeString);
};

// Validar que la fecha no sea en el pasado
const isDateInFuture = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

// Validar contraseña segura
const isStrongPassword = (password) => {
  // Al menos 6 caracteres
  if (password.length < 6) return false;
  return true;
};

// Validar número de teléfono (formato simple)
const isValidPhone = (phone) => {
  if (!phone) return true; // Teléfono es opcional
  const phoneRegex = /^[0-9\s\-\+\(\)]{8,20}$/;
  return phoneRegex.test(phone);
};

// Sanitizar string (remover caracteres peligrosos)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim();
};

// Validar número positivo
const isPositiveNumber = (num) => {
  return !isNaN(num) && num > 0;
};

module.exports = {
  isValidEmail,
  isValidDate,
  isValidTime,
  isDateInFuture,
  isStrongPassword,
  isValidPhone,
  sanitizeString,
  isPositiveNumber
};
