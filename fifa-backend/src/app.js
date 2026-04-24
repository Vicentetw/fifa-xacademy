/**
 * ============================================
 * FIFA XACADEMY - Servidor Principal
 * ============================================
 * Punto de entrada de la aplicación Express
 * Acá configuro middlewares y rutas
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
// Importar modelos para crear tablas en const startServer


// Importar rutas
const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/player.routes');

//leer cookies
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// CORS - Permite solicitudes del frontend Angular
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true // Permite enviar cookies
}));

// Parser de JSON - Transforma el body a objeto JavaScript
app.use(express.json());

// Parser de URL encoded - Para formularios
app.use(express.urlencoded({ extended: true }));

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Health check - Verifica que el servidor está funcionando
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API FIFA funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// RUTAS PROTEGIDAS (con prefijo /api)
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);

// ============================================
// MANEJO DE ERRORES 404
// ============================================

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Nada por aquí - Ruta no encontrada'
  });
});

// ============================================
// MANEJO DE ERRORES GENÉRICOS
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Error no controlado:', err);

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const startServer = async () => {
  try {
    // 1. Conectar a la base de datos
    await connectDB();
    console.log('✅ Base de datos conectada');

    // 2. Creo la tabla users y players si no existen (sync)

    const User = require('./models/user.model');
    const Player = require('./models/player.model');


    await User.sync();
    console.log('✅ Tabla users sincronizada');

    //await Player.sync();
    //CAMBIAR A ALTER PARA DESARROLLO, EN PRODUCCIÓN SE RECOMIENDA MIGRACIONES
    await Player.sync({ alter: true });
    console.log('✅ Tabla players sincronizada');
    // 3. Iniciar servidor
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();