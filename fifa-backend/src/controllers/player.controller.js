const Player = require('../models/player.model');

const createPlayer = async (req, res, next) => {
  try {
    const { 
        name,
        team,
        position,
        pace,
        shooting,
        passing,
        dribbling,
        defending,
        physical
    } = req.body;

    //1 validación básica
    if (
        !name || !team || !position ||
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

module.exports = {
    createPlayer
};