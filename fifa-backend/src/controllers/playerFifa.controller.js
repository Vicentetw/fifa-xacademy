const PlayerFifa = require('../models/playerFifa.model');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const { mapToFrontend, mapFromFrontend } = require('../utils/playerFifa.mapper');

// GET /api/players-fifa
const getPlayersFifa = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, team, position, version } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (name) where.long_name = { [Op.like]: `%${name}%` };
    if (team) where.club_name = { [Op.like]: `%${team}%` };
    if (position) where.player_positions = position;
    if (version) where.fifa_version = version;

    const { count, rows } = await PlayerFifa.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows.map(mapToFrontend)
    });
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

    const player = await PlayerFifa.findByPk(id);
    if (!player) return res.status(404).json({ message: 'Jugador no encontrado' });

    const mapped = mapToFrontend(player);

    // devolver en la misma forma que getPlayerById actual (skills agrupadas)
    return res.json({
      id: mapped.id,
      name: mapped.name,
      team: mapped.team,
      position: mapped.position,
      version: mapped.version,
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
    // validación mínima
    if (!body.long_name || !body.fifa_version || typeof body.overall === 'undefined' || typeof body.potential === 'undefined') {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const payload = mapFromFrontend(body);
    const player = await PlayerFifa.create(payload);
    return res.status(201).json({ message: 'Jugador FIFA creado', data: mapToFrontend(player) });
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

    const player = await PlayerFifa.findByPk(id);
    if (!player) return res.status(404).json({ message: 'Jugador no encontrado' });

    // permitir updates parciales: mapear desde los campos del frontend
    const updates = mapFromFrontend(req.body);
    await player.update(updates);
    return res.json(mapToFrontend(player));
  } catch (error) {
    console.error('Error updatePlayerFifa:', error);
    res.status(500).json({ message: 'Error al actualizar player_fifa' });
  }
};

// DELETE /api/players-fifa/:id
const deletePlayerFifa = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    const player = await PlayerFifa.findByPk(id);
    if (!player) return res.status(404).json({ message: 'Jugador no encontrado' });

    await player.destroy();
    return res.json({ message: 'Jugador eliminado' });
  } catch (error) {
    console.error('Error deletePlayerFifa:', error);
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
