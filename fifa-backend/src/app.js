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
const { connectDB, sequelize } = require('./config/database.js');
// Importar modelos para crear tablas en const startServer


// Importar rutas
const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/player.routes');
const playerFifaRoutes = require('./routes/playerFifa.routes');

//leer cookies
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// CORS - Permite solicitudes del frontend Angular
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:4200',
  'http://127.0.0.1:4200'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Readiness - Verifica que la aplicación puede atender tráfico (DB)
app.get('/ready', async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (err) {
    return res.status(503).json({ status: 'error', db: 'unavailable', message: err.message });
  }
});

// ============================================
// RUTAS PROTEGIDAS (con prefijo /api)
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/players-fifa', playerFifaRoutes);

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
    const PlayerFifa = require('./models/playerFifa.model');


    await User.sync();
    console.log('✅ Tabla users sincronizada');

    await Player.sync();
    console.log('✅ Tabla players sincronizada');

    await PlayerFifa.sync();
    console.log('✅ Tabla players_fifa sincronizada');
    
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