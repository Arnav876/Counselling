import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { JWT_SECRET, SUPER_ADMIN_EMAIL } from '../middleware/auth.js';

const PRIMARY_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admissionbychoice@gmail.com').toLowerCase().trim();

// Fallback bcrypt hash (rounds=10) for initial client setup if ADMIN_PASSWORD_HASH env var is not set.
// Note: In production, the client sets ADMIN_PASSWORD_HASH in Vercel environment variables.
const DEFAULT_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD || 'Admission@2026', 10);

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // 1. Check if email is an authorized admin
    const isSuperAdminEmail = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase() || normalizedEmail === PRIMARY_ADMIN_EMAIL;
    
    let authorizedAdmin = null;
    if (!isSuperAdminEmail) {
      authorizedAdmin = await prisma.authorizedAdmin.findUnique({
        where: { email: normalizedEmail }
      });
      if (!authorizedAdmin) {
        return res.status(401).json({ error: 'Access denied: Email is not authorized for administrative access' });
      }
    }

    // 2. Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    let isPasswordValid = false;

    // Check user's stored password hash in database first, otherwise use environment variable hash
    if (user?.passwordHash) {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    } else {
      const targetHash = process.env.ADMIN_PASSWORD_HASH || DEFAULT_HASH;
      isPasswordValid = await bcrypt.compare(password, targetHash);
    }

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Determine Role: Super Admin for primary emails, otherwise AuthorizedAdmin role
    const assignedRole = isSuperAdminEmail ? 'SUPER_ADMIN' : (authorizedAdmin?.role || 'ADMIN');

    // Create or update admin user in PostgreSQL
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: isSuperAdminEmail ? 'Admission by Choice Admin' : normalizedEmail.split('@')[0],
          role: assignedRole,
          status: 'ACTIVE',
          lastLoginAt: new Date()
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: assignedRole,
          status: 'ACTIVE',
          lastLoginAt: new Date()
        }
      });
    }

    // Sign secure JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        lastLoginAt: user.lastLoginAt
      }
    });

  } catch (error: any) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ error: 'Internal authentication error' });
  }
};
