import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

export const getStates = async (_req: Request, res: Response) => {
  try {
    const states = await prisma.stateSummary.findMany({
      where: {
        NOT: {
          name: {
            contains: 'grand total',
            mode: 'insensitive'
          }
        }
      },
      orderBy: { totalMbbsSeats: 'desc' }
    });

    // Also get popular cities for states
    const formatted = await Promise.all(
      states.map(async (st) => {
        let popularCities = st.popularCities;
        if (!popularCities || popularCities.length === 0) {
          const distinctCities = await prisma.college.findMany({
            where: { state: st.name },
            select: { city: true },
            distinct: ['city'],
            take: 4
          });
          popularCities = distinctCities.map(c => c.city).filter(c => c && c !== st.name);
          if (popularCities.length === 0) popularCities = [st.name];
        }

        return {
          name: st.name,
          code: st.code,
          collegeCount: st.collegeCount,
          totalMbbsSeats: st.totalMbbsSeats,
          totalPgSeats: st.totalPgSeats,
          image: st.image,
          popularCities
        };
      })
    );

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: 'Failed to retrieve states' });
  }
};
