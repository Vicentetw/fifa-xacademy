/**
 * ============================================
 * FIFA XACADEMY - Configuración de Base de Datos
 * ============================================
 * Conexión a MySQL usando mysql2/promise
 * Pool de conexiones para mejor rendimiento
 */
const mysql = require('mysql2/promise');

// Verificar que las variables de entorno estén cargadas
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingEnvVars.join(', '));
  process.exit(1);
}

// ============================================
// CREAR POOL DE CONEXIONES
// ============================================
// Un pool permite múltiples conexiones simultáneas
// Mucho más eficiente que crear una conexión por cada request

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,        // Máximo 10 conexiones simultáneas
  queueLimit: 0,              // Cola de espera ilimitada
  enableKeepAlive: true,      // Mantener conexiones vivas
  keepAliveInitialDelay: 0
});

// ============================================
// FUNCIÓN DE CONEXIÓN
// ============================================

const connectDB = async () => {
  try {
    // Obtener una conexión del pool para probar
    const connection = await db.getConnection();
    
    console.log('✅ Conectado a MySQL (Pool)');
    console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`   Base de datos: ${process.env.DB_NAME}`);
    
    // Liberar la conexión de vuelta al pool
    connection.release();
    
    return true;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:');
    console.error('   ', error.message);
    console.error('\n📋 Verifica que:');
    console.error('   1. Docker MySQL esté corriendo');
    console.error('   2. El puerto esté mapeado (3306:3306)');
    console.error('   3. Las credenciales en .env sean correctas');
    
    process.exit(1);
  }
};

// ============================================
// EXPORTAR
// ============================================

module.exports = {
  db,           // Pool de conexiones para usar en queries
  connectDB     // Función para verificar conexión al iniciar
};