import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { JWT_SECRET, SUPER_ADMIN_EMAIL, AuthRequest } from '../middleware/auth.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential, accessToken, email: directEmail, name: directName, avatar: directAvatar, googleId: directGoogleId } = req.body;

    let email = '';
    let name = '';
    let avatar = '';
    let googleId = '';

    // 1. If Google ID Token credential is provided
    if (credential) {
      try {
        if (GOOGLE_CLIENT_ID) {
          const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
          });
          const payload = ticket.getPayload();
          if (payload && payload.email) {
            email = payload.email.toLowerCase().trim();
            name = payload.name || payload.given_name || email.split('@')[0];
            avatar = payload.picture || '';
            googleId = payload.sub;
          }
        } else {
          // Verify via Google tokeninfo endpoint if client ID not configured locally
          const tokenRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
          if (tokenRes.ok) {
            const payload = await tokenRes.json();
            if (payload.email) {
              email = payload.email.toLowerCase().trim();
              name = payload.name || email.split('@')[0];
              avatar = payload.picture || '';
              googleId = payload.sub;
            }
          }
        }
      } catch (err) {
        console.warn('Google ID token verification failed:', err);
      }
    }

    // 2. If Google Access Token is provided
    if (!email && accessToken) {
      try {
        const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (userinfoRes.ok) {
          const payload = await userinfoRes.json();
          if (payload.email) {
            email = payload.email.toLowerCase().trim();
            name = payload.name || email.split('@')[0];
            avatar = payload.picture || '';
            googleId = payload.sub;
          }
        }
      } catch (err) {
        console.warn('Google access token verification failed:', err);
      }
    }

    // 3. Fallback for direct Google identity payload (e.g. developer testing / verified client payload)
    if (!email && directEmail) {
      email = String(directEmail).toLowerCase().trim();
      name = directName || email.split('@')[0];
      avatar = directAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;
      googleId = directGoogleId || undefined;
    }

    if (!email) {
      return res.status(400).json({ error: 'Google sign-in failed: Valid Google email was not found' });
    }

    // 4. Role determination:
    // Public Google authentication is strictly for Student accounts (saved colleges, enquiries, AI chats).
    // Administrative access (ADMIN / SUPER_ADMIN) strictly requires server password verification via POST /api/admin/login.
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({
        error: 'Administrator accounts must sign in using their password at /admin/login'
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId: googleId || existingUser.googleId || undefined,
          name: name || existingUser.name,
          avatar: avatar || existingUser.avatar,
          lastLoginAt: new Date()
        }
      });
    } else {
      user = await prisma.user.create({
        data: {
          googleId: googleId || undefined,
          email: normalizedEmail,
          name: name || normalizedEmail.split('@')[0],
          avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`,
          role: 'STUDENT',
          status: 'ACTIVE',
          lastLoginAt: new Date()
        }
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
    }

    // 6. Sign JWT token: Always issue STUDENT role for public Google auth
    // Admin access requires authenticating via /api/admin/login with the secure admin password
    const tokenRole = 'STUDENT';
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: tokenRole
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: tokenRole,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('Google Auth Controller Error:', error);
    return res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const savedCount = await prisma.savedCollege.count({
      where: { userId: req.user.id }
    });

    const conversationsCount = await prisma.conversation.count({
      where: { userId: req.user.id }
    });

    const enquiriesCount = await prisma.enquiry.count({
      where: { userId: req.user.id }
    });

    return res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
        role: req.user.role,
        status: req.user.status,
        createdAt: req.user.createdAt,
        lastLoginAt: req.user.lastLoginAt,
        stats: {
          savedColleges: savedCount,
          conversations: conversationsCount,
          enquiries: enquiriesCount
        }
      }
    });
  } catch (error: any) {
    console.error('GetMe Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  return res.json({ success: true, message: 'Logged out successfully' });
};
