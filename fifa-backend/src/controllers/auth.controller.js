const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// =======================
// REGISTER
// =======================
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validación básica si no hay email o password
    if (!email || !password || password.length < 6) {
  return res.status(400).json({
    message: 'Datos inválidos (password mínimo 6 caracteres)'
  });
}

    // 2. Verificar si existe usuario con ese email y no permite crear otro con el mismo email
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // 3. Hash password con bcrypt y salt rounds de 10 (recomendado)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Crear usuario en la base de datos con el password hasheado
    await User.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Usuario creado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en registro' });
  }
};

// =======================
// LOGIN
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario por email
    const user = await User.findOne({ where: { email } });

    if (!user) {
         //agrego evito ataque te timing attack
      await new Promise(resolve => setTimeout(resolve, 300));
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 2. Comparar password enviado con el hash guardado en la base de datos usando bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Crear token JWT con el id del usuario como payload, cons secret y expiración en .env
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    // 4. Enviar cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax'
    });

    res.json({ message: 'Login exitoso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en login' });
  }
};
// =======================
// LOGOUT
// =======================
const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });

  res.json({ message: 'Logout exitoso' });
};

module.exports = {
  register,
  login,
  logout
};