/**
 * auth.ts (router)
 * Registro, login y perfil autenticado.
 */

import { Router } from 'express'
import { User } from '../models/User'
import { signToken } from '../utils/jwt'
import { requireAuth } from '../middleware/auth'

export const authRouter = Router()

/** POST /api/auth/register - Crea un usuario */
authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: 'Campos requeridos' })

  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ message: 'Email ya registrado' })

  const user = await User.create({ name, email, password })
  const token = signToken({ sub: user.id, email: user.email, role: user.role })
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
})

/** POST /api/auth/login - Autentica usuario */
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' })
  const ok = await user.comparePassword(password)
  if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' })
  const token = signToken({ sub: user.id, email: user.email, role: user.role })
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
})

/** GET /api/auth/me - Perfil del usuario autenticado */
authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user!.sub).select('name email role')
  res.json({ user })
})

