const { Sequelize } = require('sequelize');


console.log('👉 CONFIG DB:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  db: process.env.DB_NAME,
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL');
  } catch (error) {
    console.error('❌ ERROR REAL:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB,
};