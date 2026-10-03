import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { collegeName, studentName, phone, preferredCourse, notes } = req.body;
    const userId = (req as any).user?.id || null;

    if (!studentName || !phone || !collegeName) {
      return res.status(400).json({ error: 'Missing required fields: studentName, phone, collegeName' });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        userId,
        collegeName,
        studentName,
        phone,
        preferredCourse: preferredCourse || 'MBBS',
        notes: notes || '',
        status: 'NEW'
      }
    });

    res.status(201).json({
      success: true,
      message: `Enquiry for ${enquiry.collegeName} successfully registered for ${enquiry.studentName}.`,
      id: enquiry.id
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
};

export const getMyEnquiries = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const enquiries = await prisma.enquiry.findMany({
      where: {
        OR: [
          { userId: user.id },
          { user: { email: user.email } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ enquiries });
  } catch (error) {
    console.error('Error fetching student enquiries:', error);
    res.status(500).json({ error: 'Failed to fetch your enquiries' });
  }
};
