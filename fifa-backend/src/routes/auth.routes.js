/**
 * ============================================
 * FIFA XACADEMY - Rutas de Autenticación
 * ============================================
 */

const express = require('express');
const router = express.Router();


const { register, login } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);


// Placeholder - se implementará en Fase 4
/* router.get('/', (req, res) => {
  res.json({ message: 'Auth routes - Fase 4' });
}); */

module.exports = router;