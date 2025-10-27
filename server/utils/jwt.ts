/**
 * jwt.ts
 * Utilidades para manejo de JWT tokens.
 */

import jwt from 'jsonwebtoken'

export interface JwtPayloadLite {
  sub: string
  email: string
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export function generateToken(payload: JwtPayloadLite): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const signToken = generateToken

export function verifyToken(token: string): JwtPayloadLite {
  return jwt.verify(token, JWT_SECRET) as JwtPayloadLite
}