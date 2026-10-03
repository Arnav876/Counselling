import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

export const createContact = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, subject, message, preferredState } = req.body;
    const userId = (req as any).user?.id || null;

    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields: fullName, email, phone, message' });
    }

    const contact = await prisma.contact.create({
      data: {
        userId,
        fullName,
        email,
        phone,
        subject: subject || 'Admission Guidance Request',
        message,
        preferredState: preferredState || null,
        status: 'NEW'
      }
    });

    res.status(201).json({
      success: true,
      message: `Thank you ${contact.fullName}, your inquiry has been recorded. Our counselor will get in touch shortly.`,
      id: contact.id
    });
  } catch (error) {
    console.error('Error submitting contact request:', error);
    res.status(500).json({ error: 'Failed to submit contact request' });
  }
};

export const getMyContacts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { userId: user.id },
          { email: user.email }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ contacts });
  } catch (error) {
    console.error('Error fetching student contacts:', error);
    res.status(500).json({ error: 'Failed to fetch your contact requests' });
  }
};
