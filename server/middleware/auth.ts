/**
 * auth.ts
 * Middleware para autenticar y autorizar rutas con JWT.
 */

import { Request, Response, NextFunction } from 'express'
import { verifyToken, JwtPayloadLite } from '../utils/jwt'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadLite
    }
  }
}

/** Extrae el token del header Authorization: Bearer ... */
function getToken(req: Request) {
  const header = req.headers.authorization
  if (!header) return null
  const [type, token] = header.split(' ')
  if (type !== 'Bearer' || !token) return null
  return token
}

/** Requiere usuario autenticado */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req)
  if (!token) return res.status(401).json({ message: 'Usuario No autenticado' })
  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }
}

/** Requiere rol admin */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' })
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'No autorizado' })
  next()
}

