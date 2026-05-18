const { Sequelize } = require('sequelize');

// Validación mínima de variables de entorno
const hasDatabaseUrl = !!process.env.DATABASE_URL;
const requiredEnvVars = hasDatabaseUrl ? [] : ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing = requiredEnvVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  // Throw here so the caller (app.js / process manager) can decide how to handle.
  throw new Error(`Variables de entorno faltantes: ${missing.join(', ')}`);
}

// Construir opciones comunes
const commonOptions = {
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX, 10) || 5,
    min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000,
  },
};

// Soporte SSL si se solicita (por ejemplo en proveedores cloud)
if (process.env.DB_SSL === 'true' || process.env.DB_SSL === '1') {
  commonOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

let sequelize;
if (hasDatabaseUrl) {
  sequelize = new Sequelize(process.env.DATABASE_URL, commonOptions);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    Object.assign({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    }, commonOptions)
  );
}

// connectDB con retry exponencial
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const connectDB = async ({ retries = 5, initialDelay = 1000 } = {}) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await sequelize.authenticate();
      console.log('✅ Conectado a MySQL (Sequelize)');
      return true;
    } catch (err) {
      attempt += 1;
      const last = attempt >= retries;
      console.error(`⚠️ Intento ${attempt}/${retries} - Error conectando a DB: ${err.message}`);
      if (last) {
        // No llamar process.exit aquí: dejar que el llamador decida (más seguro para deploys y tests)
        throw err;
      }
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.log(`→ Reintentando en ${delay}ms...`);
      // small jitter
      const jitter = Math.floor(Math.random() * 300);
      await sleep(delay + jitter);
    }
  }
};

module.exports = {
  sequelize,
  connectDB,
};