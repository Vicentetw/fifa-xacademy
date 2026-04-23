const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

console.log('Middleware:', authMiddleware);

// Ruta protegida
router.get('/', authMiddleware, (req, res) => {
  res.json({
    message: 'Accediste a jugadores',
    user: req.user
  });
});

module.exports = router;