//1. imports
//2. createPlayer
//3. getPlayers  
//3.1 getPlayers por id
//3.2 updatePlayer
//3.3 deletePlayer
//4. export

const Player = require('../models/player.model');
const { Op } = require('sequelize');
const { validatePlayer } = require('../utils/player.validator');
const createPlayer = async (req, res, next) => {
    try {
        const {
            name,
            team,
            position,
            version,
            pace,
            shooting,
            passing,
            dribbling,
            defending,
            physical
        } = req.body;

        //1 validación básica
        const validation = validatePlayer(req.body);
        if (!validation.valid) {
            return res.status(400).json({
                message: validation.message
            });
        }


        //2 crear el jugador
        const player = await Player.create({
            name,
            team,
            position,
            version,
            pace,
            shooting,
            passing,
            dribbling,
            defending,
            physical
        });
        // responder con el jugador creado
        res.status(201).json({
            message: 'Jugador creado',
            data: player
        });
    } catch (error) {
        console.error('X Error al crear jugador:', error);
        res.status(500).json({ message: 'Error al crear el jugador' });
    }
};
//termina de crear jugador
//getPlayers (busca todos los jugadores)
const getPlayers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            name,
            team,
            position,
            version
        } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (name) {
            where.name = { [Op.like]: `%${name}%` };
        }

        if (team) {
            where.team = { [Op.like]: `%${team}%` };
        }

        if (position) {
            where.position = position;
        }

        if (version) {
            where.version = version;
        }

        const { count, rows } = await Player.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });
        res.json({
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    } catch (error) {
        console.error('X Error al obtener jugadores:', error);
        res.status(500).json({ message: 'Error al obtener los jugadores' });
    }
};

//getPlayersById
const getPlayerById = async (req, res) => {
    try {
        // 1. Obtener ID
        const { id } = req.params;

        // 2. Validar ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            });
        }

        // 3. Buscar jugador
        const player = await Player.findByPk(id);

        // 4. Si no existe
        if (!player) {
            return res.status(404).json({
                message: 'Jugador no encontrado'
            });
        }

        // 5. Responder
        res.json(player);

    } catch (error) {
        console.error('X Error al obtener jugador:', error);
        res.status(500).json({
            message: 'Error al obtener el jugador'
        });
    }
};

//updatePlayer
const updatePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            team,
            position,
            version,
            pace,
            shooting,
            passing,
            dribbling,
            defending,
            physical
        } = req.body;

        const player = await Player.findByPk(id);
        if (!player) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }

        const validation = validatePlayer(req.body);

        if (!validation.valid) {
            return res.status(400).json({
                message: validation.message
            });
        }


        await player.update({
            name,
            team,
            position,
            version,
            pace,
            shooting,
            passing,
            dribbling,
            defending,
            physical
        });

        res.json(player);
    } catch (error) {
        console.error('X Error al actualizar jugador:', error);
        res.status(500).json({ message: 'Error al actualizar el jugador' });
    }
};

//deletePlayer
const deletePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const player = await Player.findByPk(id);
        if (!player) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }
        await player.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('X Error al eliminar jugador:', error);
        res.status(500).json({ message: 'Error al eliminar el jugador' });
    }
};

//EXPORTS
module.exports = {
    createPlayer,
    getPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer
};