const PlayerFifa = require('../models/playerFifa.model');
const { Op } = require('sequelize');
const { mapToFrontend, mapFromFrontend } = require('../utils/playerFifa.mapper');

/**
 * Service que encapsula la lógica de acceso a datos para players_fifa
 * Métodos: list, getById, create, update, delete
 */
async function listPlayers({ page = 1, limit = 10, filters = {} } = {}) {
  const offset = (page - 1) * limit;
  const where = {};

  if (filters.name) where.long_name = { [Op.like]: `%${filters.name}%` };
  if (filters.team) where.club_name = { [Op.like]: `%${filters.team}%` };
  if (filters.position) where.player_positions = filters.position;
  if (filters.version) where.fifa_version = filters.version;

  const { count, rows } = await PlayerFifa.findAndCountAll({
    where,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['id', 'DESC']]
  });

  return {
    total: count,
    page: parseInt(page, 10),
    totalPages: Math.ceil(count / limit),
    data: rows.map(mapToFrontend)
  };
}

async function getPlayerById(id) {
  if (!id) throw new Error('ID inválido');
  const player = await PlayerFifa.findByPk(id);
  if (!player) return null;
  return mapToFrontend(player);
}

async function createPlayer(payload) {
  const data = mapFromFrontend(payload);

  // defaults to keep compatibility with old frontend
  data.overall = data.overall ?? 0;
  data.potential = data.potential ?? 0;
  data.age = data.age ?? 18;

  const player = await PlayerFifa.create(data);
  return mapToFrontend(player);
}

async function updatePlayer(id, payload) {
  if (!id) throw new Error('ID inválido');
  const player = await PlayerFifa.findByPk(id);
  if (!player) throw new Error('Jugador no encontrado');

  const updates = mapFromFrontend(payload);
  await player.update(updates);
  return mapToFrontend(player);
}

async function deletePlayer(id) {
  if (!id) throw new Error('ID inválido');
  const player = await PlayerFifa.findByPk(id);
  if (!player) throw new Error('Jugador no encontrado');
  await player.destroy();
  return true;
}

module.exports = {
  listPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
};
