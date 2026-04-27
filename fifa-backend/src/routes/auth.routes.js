/**
 * ============================================
 * FIFA XACADEMY - Rutas de Autenticación
 * ============================================
 */

const express = require('express');
const router = express.Router();


const { register, login, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Placeholder - se implementará en Fase 4
/* router.get('/', (req, res) => {
  res.json({ message: 'Auth routes - Fase 4' });
}); */
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
module.exports = router;