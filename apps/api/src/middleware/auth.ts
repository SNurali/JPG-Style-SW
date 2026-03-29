import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_to_a_secure_random_string';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): AdminPayload {
  return jwt.verify(token, JWT_SECRET) as AdminPayload;
}

/**
 * Middleware: require valid admin JWT token.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware: require admin role specifically.
 */
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Authorization required' });
    }
    if (req.admin.role !== role && req.admin.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
