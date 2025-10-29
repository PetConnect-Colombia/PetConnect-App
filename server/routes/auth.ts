import { Router } from 'express';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';

export const authRouter = Router();

/**
 * POST /api/auth/register
 * Registra un nuevo usuario.
 */
authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'El nombre, el email y la contraseña son requeridos.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
  }

  // Creamos el usuario pero no lo guardamos todavía para poder seleccionar los campos
  const user = new User({ name, email, password });
  await user.save();

  const token = signToken({ sub: user._id, email: user.email, role: user.role });

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * POST /api/auth/login
 * Autentica un usuario y devuelve un token.
 */
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'El email y la contraseña son requeridos.' });
  }

  // Buscamos al usuario y seleccionamos explícitamente la contraseña
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  const token = signToken({ sub: user._id, email: user.email, role: user.role });

  res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * GET /api/auth/me
 * Devuelve el perfil del usuario autenticado.
 * Ruta protegida.
 */
authRouter.get('/me', requireAuth, async (req, res) => {
  // req.user está disponible gracias al middleware requireAuth
  const userId = req.user?.sub;

  const user = await User.findById(userId).select('-password'); // Excluir la contraseña

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }

  res.status(200).json({ user });
});