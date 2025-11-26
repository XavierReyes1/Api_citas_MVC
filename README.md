# 🏥 API de Reservación de Citas - Clínica

API RESTful desarrollada con Node.js, Express y MySQL para la gestión de citas médicas en una clínica.

## 🚀 Instalación

1. Clonar el repositorio
2. Crear archivo `.env` (copiar de `.env.example`)
3. Ejecutar:

```bash
docker-compose up -d
```
  Instalar dependencias:
```bash
npm install
```

  Iniciar el servidor:
```bash
npm run dev
```
La API estará disponible en `http://localhost:3000`


## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Después del login, incluye el token en las peticiones protegidas:

```
Authorization: Bearer tu_token_aqui
```

---

## 📡 Endpoints

### 🔑 Autenticación

#### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123",
  "telefono": "12345678"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "12345678",
    "rol": "cliente"
  }
}
```

#### Iniciar Sesión

Para administrador:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@clinica.com",
  "password": "admin123"
}
```
Para usuario:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "cliente"
  }
}
```

#### Obtener Perfil
```http
GET /api/auth/profile
Authorization: Bearer tu_token
```

---

### 🏥 Servicios

#### Listar Servicios (Público)
```http
GET /api/servicios
```

**Respuesta:**
```json
{
  "servicios": [
    {
      "id": 1,
      "nombre": "Consulta General",
      "descripcion": "Consulta médica general",
      "duracion": 30,
      "precio": 250.00,
      "disponible": true
    }
  ],
  "total": 1
}
```

#### Obtener Servicio por ID
```http
GET /api/servicios/1
```

#### Crear Servicio (Admin)
```http
POST /api/servicios
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nombre": "Consulta Cardiología",
  "descripcion": "Consulta con cardiólogo",
  "duracion": 45,
  "precio": 600.00,
  "disponible": true
}
```

#### Actualizar Servicio (Admin)
```http
PUT /api/servicios/1
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nombre": "Consulta General Actualizada",
  "descripcion": "Nueva descripción",
  "duracion": 30,
  "precio": 300.00,
  "disponible": true
}
```

#### Eliminar Servicio (Admin)
```http
DELETE /api/servicios/1
Authorization: Bearer token_admin
```

---

### 📅 Citas

#### Ver Mis Citas (Cliente)
```http
GET /api/citas
Authorization: Bearer token_cliente
```

**Respuesta:**
```json
{
  "citas": [
    {
      "id": 1,
      "fecha": "2025-11-20",
      "hora": "10:00:00",
      "estado": "pendiente",
      "notas": "Primera consulta",
      "servicio_nombre": "Consulta General",
      "servicio_duracion": 30,
      "servicio_precio": 250.00
    }
  ],
  "total": 1
}
```

#### Crear Cita (Cliente)
```http
POST /api/citas
Authorization: Bearer token_cliente
Content-Type: application/json

{
  "servicio_id": 1,
  "fecha": "2025-11-25",
  "hora": "10:00",
  "notas": "Primera consulta"
}
```
## 📁 Estructura del Proyecto

```
api-citas/
├── server.js                 # Punto de entrada
├── .env                      # Variables de entorno
├── package.json             # Dependencias
├── config/
│   └── database.js          # Configuración de MySQL
├── middlewares/
│   ├── auth.js              # Autenticación JWT
│   └── errorHandler.js      # Manejo de errores
├── models/
│   ├── User.js              # Modelo Usuario
│   ├── Servicio.js          # Modelo Servicio
│   └── Cita.js              # Modelo Cita
├── controllers/
│   ├── authController.js    # Lógica de autenticación
│   ├── servicioController.js # Lógica de servicios
│   └── citaController.js    # Lógica de citas
├── routes/
│   ├── authRoutes.js        # Rutas de autenticación
│   ├── servicioRoutes.js    # Rutas de servicios
│   └── citaRoutes.js        # Rutas de citas
└── utils/
    └── validators.js        # Funciones de validación
```



**Validaciones automáticas:**
- ✅ Fecha no puede ser en el pasado
- ✅ No puede haber citas duplicadas (mismo usuario, fecha, hora)
- ✅ Verifica conflictos de horario según duración del servicio
- ✅ Servicio debe estar disponible

#### Cancelar Cita (Cliente)
```http
DELETE /api/citas/1
Authorization: Bearer token_cliente
```

#### Ver Todas las Citas (Admin)
```http
GET /api/citas/admin/todas
Authorization: Bearer token_admin
```

#### Actualizar Estado de Cita (Admin)
```http
PATCH /api/citas/admin/1/estado
Authorization: Bearer token_admin
Content-Type: application/json

{
  "estado": "confirmada"
}
```

Estados válidos: `pendiente`, `confirmada`, `cancelada`, `completada`

---

## 👥 Roles y Permisos

### Cliente (`rol: cliente`)
- ✅ Registrarse e iniciar sesión
- ✅ Ver servicios disponibles
- ✅ Crear sus propias citas
- ✅ Ver sus propias citas
- ✅ Cancelar sus propias citas
- ❌ No puede gestionar servicios
- ❌ No puede ver citas de otros usuarios

### Administrador (`rol: admin`)
- ✅ Todo lo que puede hacer un cliente
- ✅ Crear, editar y eliminar servicios
- ✅ Ver todas las citas de todos los usuarios
- ✅ Actualizar el estado de cualquier cita

---

## 🧪 Pruebas con cURL

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Password123",
    "telefono": "12345678"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

### Crear cita (guarda el token del login)
```bash
curl -X POST http://localhost:3000/api/citas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "servicio_id": 1,
    "fecha": "2025-11-25",
    "hora": "10:00",
    "notas": "Primera consulta"
  }'
```

---

## 🔒 Seguridad

- **Contraseñas**: Encriptadas con Argon2 (más seguro que bcrypt)
- **JWT**: Tokens con expiración configurable
- **Validaciones**: Validación estricta de datos de entrada
- **SQL Injection**: Protección mediante prepared statements
- **CORS**: Configurado para peticiones cross-origin
- **Variables de entorno**: Credenciales sensibles en archivo .env

---

## 📊 Base de Datos

### Tablas principales:

1. **usuarios**: Información de usuarios del sistema
2. **servicios**: Catálogo de servicios médicos
3. **citas**: Registro de citas programadas

### Diagrama de relaciones:
```
usuarios (1) ----< (N) citas
servicios (1) ----< (N) citas
```

---

## ⚠️ Manejo de Errores

La API maneja los siguientes tipos de errores:

- **400 Bad Request**: Datos inválidos o incompletos
- **401 Unauthorized**: Token inválido o expirado
- **403 Forbidden**: Sin permisos suficientes
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

Ejemplo de respuesta de error:
```json
{
  "error": "Mensaje descriptivo del error"
}
```

---

## 📝 Validaciones Implementadas

### Citas:
- ✅ Fecha en formato YYYY-MM-DD
- ✅ Hora en formato HH:MM o HH:MM:SS
- ✅ Fecha no puede ser en el pasado
- ✅ No duplicar citas (mismo usuario, fecha, hora)
- ✅ Verificar disponibilidad de servicio
- ✅ Evitar conflictos de horario según duración

### Usuarios:
- ✅ Email válido y único
- ✅ Contraseña mínimo 6 caracteres
- ✅ Campos requeridos

### Servicios:
- ✅ Duración mayor a 0
- ✅ Precio mayor a 0
- ✅ Campos requeridos

---

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución
- **Express**: Framework web
- **MySQL**: Base de datos
- **JWT**: Autenticación
- **Argon2**: Encriptación de contraseñas
- **dotenv**: Variables de entorno

---

## 📦 Dependencias

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.5",
  "jsonwebtoken": "^9.0.2",
  "argon2": "^0.31.2",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5"
}
```

---

## 🚧 Mejoras Futuras (Opcionales)

- [ ] Paginación en listados
- [ ] Filtros y búsquedas avanzadas
- [ ] Sistema de notificaciones por email
- [ ] Recordatorios de citas
- [ ] Dashboard de estadísticas
- [ ] Rate limiting
- [ ] Logs de auditoría
- [ ] Tests unitarios y de integración
- [ ] Documentación con Swagger
- [ ] Docker para deployment


---

## 🎯 Notas Importantes

1. **Cambiar JWT_SECRET en producción**: Usa un valor seguro y único
2. **Usuario admin por defecto**: Email: `admin@clinica.com`, Password: debe ser hasheada
3. **CORS**: Configurar dominios permitidos en producción
4. **Rate Limiting**: Implementar en producción para evitar abuso
5. **HTTPS**: Usar en producción para conexiones seguras

---




¡Gracias por usar esta API! 🚀