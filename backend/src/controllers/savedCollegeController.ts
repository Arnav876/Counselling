import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

export const getSavedColleges = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        college: {
          include: {
            courses: { take: 3 },
            admissionInfo: true,
            packageStats: true
          }
        }
      }
    });

    res.json({
      savedColleges: saved.map(s => ({
        id: s.id,
        savedAt: s.createdAt,
        college: s.college
      }))
    });
  } catch (error) {
    console.error('Error fetching saved colleges:', error);
    res.status(500).json({ error: 'Failed to fetch saved colleges' });
  }
};

export const getSavedCollegeIds = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.json({ savedIds: [] });
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: user.id },
      select: { collegeId: true }
    });

    res.json({ savedIds: saved.map(s => s.collegeId) });
  } catch (error) {
    console.error('Error fetching saved college ids:', error);
    res.status(500).json({ error: 'Failed to fetch saved college IDs' });
  }
};

export const saveCollege = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const collegeId = req.params.collegeId as string;

    if (!user) {
      return res.status(401).json({ error: 'Please sign in to save colleges' });
    }

    const college = await prisma.college.findUnique({
      where: { id: collegeId }
    });

    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    const saved = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId: user.id,
          collegeId
        }
      },
      create: {
        userId: user.id,
        collegeId
      },
      update: {}
    });

    res.status(201).json({
      success: true,
      message: `${college.name} added to your saved colleges.`,
      saved
    });
  } catch (error) {
    console.error('Error saving college:', error);
    res.status(500).json({ error: 'Failed to save college' });
  }
};

export const unsaveCollege = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const collegeId = req.params.collegeId as string;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.savedCollege.deleteMany({
      where: {
        userId: user.id,
        collegeId
      }
    });

    res.json({
      success: true,
      message: 'College removed from your saved list.'
    });
  } catch (error) {
    console.error('Error removing saved college:', error);
    res.status(500).json({ error: 'Failed to remove saved college' });
  }
};
