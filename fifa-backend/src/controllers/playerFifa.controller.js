const PlayerFifa = require('../models/playerFifa.model');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const { mapToFrontend, mapFromFrontend } = require('../utils/playerFifa.mapper');
const playerFifaService = require('../services/playerFifa.service');

// GET /api/players-fifa
const getPlayersFifa = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, team, position, version } = req.query;
    const filters = { name, team, position, version };

    const result = await playerFifaService.listPlayers({ page, limit, filters });

    return res.json(result);
  } catch (error) {
    console.error('Error getPlayersFifa:', error);
    res.status(500).json({ message: 'Error al obtener players_fifa' });
  }
};

// GET /api/players-fifa/:id
const getPlayerFifaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    const mapped = await playerFifaService.getPlayerById(id);
    if (!mapped) return res.status(404).json({ message: 'Jugador no encontrado' });

    // devolver el objeto mapeado completo junto a la estructura de skills
    return res.json({
      ...mapped,
      skills: {
        labels: ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'],
        values: [mapped.pace, mapped.shooting, mapped.passing, mapped.dribbling, mapped.defending, mapped.physical]
      }
    });
  } catch (error) {
    console.error('Error getPlayerFifaById:', error);
    res.status(500).json({ message: 'Error al obtener player_fifa' });
  }
};

// POST /api/players-fifa
const createPlayerFifa = async (req, res) => {
  try {
    const body = req.body;
    const payload = mapFromFrontend(body);

    if (!payload.long_name || !payload.fifa_version) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Delego la creación al service (el service mapeará internamente)
    const created = await playerFifaService.createPlayer(body);
    return res.status(201).json({ message: 'Jugador FIFA creado', data: created });
  } catch (error) {
    console.error('Error createPlayerFifa:', error);
    res.status(500).json({ message: 'Error al crear player_fifa' });
  }
};

// PUT/PATCH /api/players-fifa/:id
const updatePlayerFifa = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    // Delego al servicio - este lanza si no existe
    const updated = await playerFifaService.updatePlayer(id, req.body);
    return res.json(updated);
  } catch (error) {
    console.error('Error updatePlayerFifa:', error);
    if (String(error.message).includes('no encontrado') || String(error.message).includes('not found')) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }
    res.status(500).json({ message: 'Error al actualizar player_fifa' });
  }
};

// DELETE /api/players-fifa/:id
const deletePlayerFifa = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    await playerFifaService.deletePlayer(id);
    return res.json({ message: 'Jugador eliminado' });
  } catch (error) {
    console.error('Error deletePlayerFifa:', error);
    if (String(error.message).includes('no encontrado') || String(error.message).includes('not found')) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }
    res.status(500).json({ message: 'Error al eliminar player_fifa' });
  }
};

// Export CSV
const exportPlayersFifaCSV = async (req, res) => {
  try {
    const { name, team, position, version } = req.query;
    const where = {};
    if (name) where.long_name = { [Op.like]: `%${name}%` };
    if (team) where.club_name = { [Op.like]: `%${team}%` };
    if (position) where.player_positions = position;
    if (version) where.fifa_version = version;

    const players = await PlayerFifa.findAll({ where });
    const data = players.map(p => p.toJSON());
    const fields = Object.keys(data[0] || {});
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('players_fifa.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Error exportPlayersFifaCSV:', error);
    res.status(500).json({ message: 'Error exportando CSV' });
  }
};

module.exports = {
  getPlayersFifa,
  getPlayerFifaById,
  createPlayerFifa,
  updatePlayerFifa,
  deletePlayerFifa,
  exportPlayersFifaCSV
};
