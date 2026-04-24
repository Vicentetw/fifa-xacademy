const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { createPlayer, getAllPlayers, getPlayerById, updatePlayer, deletePlayer } = require('../controllers/player.controller');

//console.log('Middleware:', authMiddleware);

// Rutas CRUD para jugadores

router.post('/', authMiddleware, createPlayer);
//router.get('/', authMiddleware, getAllPlayers);
//router.get('/:id', authMiddleware, getPlayerById);
//router.put('/:id', authMiddleware, updatePlayer);
//router.delete('/:id', authMiddleware, deletePlayer);

// Ruta protegida
router.get('/', authMiddleware, (req, res) => {
  res.json({
    message: 'Accediste a jugadores, test de ruta protegida',
    user: req.user
  });
});

module.exports = router;