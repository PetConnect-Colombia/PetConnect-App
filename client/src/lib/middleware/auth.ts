import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

// Extendemos el tipo Request de Express para añadir la propiedad `user`
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Extrae el token del encabezado de autorización 'Bearer ...'.
 * @param req La solicitud de Express.
 * @returns El token si existe, de lo contrario null.
 */
function getTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

/**
 * Middleware para requerir un usuario autenticado.
 * Verifica el JWT y adjunta el payload a `req.user`.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ message: 'No autenticado. Se requiere token.' });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

/**
 * Middleware para requerir que el usuario autenticado tenga el rol de 'admin'.
 * Debe usarse siempre *después* de `requireAuth`.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    // Esto no debería ocurrir si `requireAuth` se usa primero
    return res.status(401).json({ message: 'No autenticado.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }

  next();
}