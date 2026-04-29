/**
 * ============================================
 * FIFA XACADEMY - Rutas de Autenticación
 * ============================================
 */

const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); // para obtener el email del usuario en /me


const { register, login, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Placeholder - se implementará en Fase 4
/* router.get('/', (req, res) => {
  res.json({ message: 'Auth routes - Fase 4' });
}); */
router.get('/me2', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
router.get('/me', authMiddleware, async (req, res) => {
  try {

    // 👉 obtengo el id desde el token
    const userId = req.user.id;

    // 👉 busco el usuario en la base de datos
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email'] // 👈 solo lo que quiero devolver
    });

    // 👉 si no existe
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 👉 devuelvo usuario completo
    res.json({ user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en servidor' });
  }
});
module.exports = router;