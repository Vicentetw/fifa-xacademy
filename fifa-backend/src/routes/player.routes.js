const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { createPlayer, getPlayers, getPlayerById, updatePlayer, deletePlayer} = require('../controllers/player.controller');

//console.log('Middleware:', authMiddleware);

// Rutas CRUD para jugadores en este orden:
// 1 rutas generales (/)
// 2 rutas específicas (/:id)
// 3 acciones (POST, PUT, DELETE)
router.get('/', authMiddleware, getPlayers);
router.get('/:id', authMiddleware, getPlayerById);

router.post('/', authMiddleware, createPlayer);
router.put('/:id', authMiddleware, updatePlayer);
router.delete('/:id', authMiddleware, deletePlayer);



module.exports = router;