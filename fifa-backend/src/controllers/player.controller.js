//1. imports
//2. createPlayer
//3. getPlayers  
//4. export

const Player = require('../models/player.model');
const { Op } = require('sequelize');
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
        if (
            !name || !team || !position || !version ||
            pace === null || shooting === null ||
            passing === null || dribbling === null || defending === null || physical === null
        ) {
            return res.status(400).json({
                message: 'Faltan datos que son obligatorios'
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
        res.status(201).json(player);
        // manejo de errores
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


//EXPORTS
module.exports = {
    createPlayer,
    getPlayers
};