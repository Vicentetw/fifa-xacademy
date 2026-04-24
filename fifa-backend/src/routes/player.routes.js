const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { createPlayer, getPlayers } = require('../controllers/player.controller');

//console.log('Middleware:', authMiddleware);

// Rutas CRUD para jugadores en este orden: GET, POST, PUT, DELETE
router.get('/', authMiddleware, getPlayers);
router.post('/', authMiddleware, createPlayer);

//router.get('/:id', authMiddleware, getPlayerById);
//router.put('/:id', authMiddleware, updatePlayer);
//router.delete('/:id', authMiddleware, deletePlayer);




module.exports = router;