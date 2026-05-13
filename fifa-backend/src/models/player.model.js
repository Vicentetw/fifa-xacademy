const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  team: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
  pace: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  shooting: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  passing: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  dribbling: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  defending: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  physical: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }

}, {
  tableName: 'players',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Player;