import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'admission_by_choice_jwt_super_secure_secret_key_2026';
export const SUPER_ADMIN_EMAIL = 'bmsit8@gmail.com';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User account not found' });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Account suspended. Please contact admissions support.' });
    }

    // Auto-verify Super Admin role if email matches bmsit8@gmail.com
    if (user.email.toLowerCase() === SUPER_ADMIN_EMAIL && user.role !== 'SUPER_ADMIN') {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'SUPER_ADMIN' }
      });
      req.user = updated;
    } else {
      req.user = user;
    }

    next();
  } catch (err: any) {
    console.error('Authentication Error:', err.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (user && user.status === 'ACTIVE') {
          req.user = user;
        }
      }
    }
  } catch {
    // Ignore invalid optional auth
  }
  next();
};

export const requireStudent = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Administrator privileges required' });
  }
  next();
};

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Super Administrator privileges required' });
  }
  next();
};
