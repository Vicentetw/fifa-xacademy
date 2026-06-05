const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
  getPlayersFifa,
  getPlayerFifaById,
  createPlayerFifa,
  updatePlayerFifa,
  deletePlayerFifa,
  exportPlayersFifaCSV
} = require('../controllers/playerFifa.controller');

router.get('/', authMiddleware, getPlayersFifa);
router.get('/export/csv', authMiddleware, exportPlayersFifaCSV);
router.get('/:id', authMiddleware, getPlayerFifaById);
router.post('/', authMiddleware, createPlayerFifa);
router.put('/:id', authMiddleware, updatePlayerFifa);
router.delete('/:id', authMiddleware, deletePlayerFifa);

module.exports = router;
