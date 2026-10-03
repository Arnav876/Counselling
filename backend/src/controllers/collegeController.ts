import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

// Format database college entity into frontend shape
function formatCollege(col: any) {
  return {
    id: col.id,
    code: col.code,
    name: col.name,
    shortName: col.shortName || col.name,
    slug: col.slug,
    logo: col.logo,
    image: col.image,
    city: col.city,
    state: col.state,
    distance: col.distance,
    managementTypes: col.managementTypes || ['General Management'],
    rating: col.rating,
    reviewsCount: col.reviewsCount,
    nirfRank: col.nirfRank || undefined,
    estYear: col.estYear,
    accreditation: col.accreditation,
    shortDescription: col.shortDescription,
    fullDescription: col.fullDescription,
    highlights: col.highlights || [],
    stream: col.stream || 'Medical',
    address: col.address,
    phone: col.phone,
    email: col.email,
    website: col.website,
    campusArea: col.campusArea || '50+ Acres',
    studentFacultyRatio: col.studentFacultyRatio || '1:2.5',
    mbbsSeats: col.mbbsSeats,
    pgSeats: col.pgSeats,
    courses: (col.courses || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      degree: c.degree,
      duration: c.duration,
      annualFee: c.annualFee,
      seats: c.seats,
      eligibility: c.eligibility
    })),
    facilities: (col.facilities || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      iconName: f.iconName,
      description: f.description || undefined
    })),
    admissionInfo: col.admissionInfo ? {
      process: col.admissionInfo.process,
      entranceExams: col.admissionInfo.entranceExams || ['NEET-UG'],
      cutoffPercentile: col.admissionInfo.cutoffPercentile,
      applicationDeadline: col.admissionInfo.applicationDeadline,
      eligibilityCriteria: col.admissionInfo.eligibilityCriteria,
      managementQuotaDetails: col.admissionInfo.managementQuotaDetails || undefined
    } : {
      process: 'Merit-based admission counseling through state and all-India quotas.',
      entranceExams: ['NEET-UG'],
      cutoffPercentile: '90+ Percentile',
      applicationDeadline: 'August 31, 2026',
      eligibilityCriteria: '10+2 with Physics, Chemistry, Biology + NEET Qualified'
    },
    packageStats: col.packageStats ? {
      average: col.packageStats.average,
      highest: col.packageStats.highest,
      topRecruiters: col.packageStats.topRecruiters || []
    } : {
      average: '₹12 - ₹15 LPA',
      highest: '₹30+ LPA',
      topRecruiters: ['AIIMS', 'Apollo Hospitals', 'Max Healthcare']
    },
    gallery: (col.gallery || []).map((g: any) => g.url)
  };
}

export const getColleges = async (req: Request, res: Response) => {
  try {
    const {
      search,
      state,
      managementType,
      stream,
      distance,
      sort = 'relevance',
      page,
      limit,
      ids
    } = req.query;

    const where: any = {};

    // 1. Multiple IDs (for compare mode)
    if (ids) {
      const idList = Array.isArray(ids) 
        ? ids.map(String) 
        : String(ids).split(',').map(s => s.trim());
      where.id = { in: idList };
    }

    // 2. Search
    if (search && String(search).trim() !== '') {
      const q = String(search).trim();
      const qLower = q.toLowerCase();
      const aliases: Record<string, string> = {
        'aiims': 'All India Institute of Medical Sciences',
        'gmc': 'Government Medical College',
        'afmc': 'Armed Forces Medical College',
        'mamc': 'Maulana Azad',
        'kmc': 'Kasturba Medical College',
        'bhu': 'Banaras Hindu',
        'jipmer': 'Jawaharlal Institute',
        'kgmu': 'King George',
        'lhmc': 'Lady Hardinge',
        'vmmc': 'Vardhman Mahavir',
        'ims': 'Institute of Medical Sciences',
        'rims': 'Regional Institute',
        'pgimer': 'Post Graduate Institute',
        'ucms': 'University College of Medical Sciences',
        'cmc': 'Christian Medical College'
      };
      
      const searchTerms = [q];
      if (aliases[qLower]) {
        searchTerms.push(aliases[qLower]);
      }

      const orConditions: any[] = [];
      for (const term of searchTerms) {
        orConditions.push(
          { name: { contains: term, mode: 'insensitive' } },
          { shortName: { contains: term, mode: 'insensitive' } },
          { city: { contains: term, mode: 'insensitive' } },
          { state: { contains: term, mode: 'insensitive' } },
          { code: { contains: term, mode: 'insensitive' } },
          { courses: { some: { name: { contains: term, mode: 'insensitive' } } } }
        );
      }
      where.OR = orConditions;
    }

    // 3. State filter
    if (state && String(state).toUpperCase() !== 'ALL') {
      where.state = { equals: String(state).trim(), mode: 'insensitive' };
    }

    // 4. Stream filter
    if (stream && String(stream).toUpperCase() !== 'ALL') {
      where.stream = { equals: String(stream).trim(), mode: 'insensitive' };
    }

    // 5. Management Type filter
    if (managementType) {
      const mgmtList = Array.isArray(managementType)
        ? managementType.map(String)
        : String(managementType).split(',').map(s => s.trim());
      
      if (mgmtList.length > 0 && !mgmtList.includes('ALL')) {
        where.managementTypes = {
          hasSome: mgmtList
        };
      }
    }

    // 6. Distance filter
    if (distance && distance !== 'all') {
      const distStr = String(distance);
      if (distStr.includes('+')) {
        where.distance = { gte: 100 };
      } else {
        const maxDist = parseInt(distStr, 10);
        if (!isNaN(maxDist)) {
          where.distance = { lte: maxDist };
        }
      }
    }

    // 7. Sorting
    let orderBy: any = {};
    switch (sort) {
      case 'distance-asc':
        orderBy = { distance: 'asc' };
        break;
      case 'distance-desc':
        orderBy = { distance: 'desc' };
        break;
      case 'rating-desc':
        orderBy = { rating: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'relevance':
      default:
        orderBy = [{ nirfRank: 'asc' }, { rating: 'desc' }, { name: 'asc' }];
        break;
    }

    // Pagination (if specified)
    const pageNum = page ? parseInt(String(page), 10) : undefined;
    const limitNum = limit ? parseInt(String(limit), 10) : undefined;
    const skip = pageNum && limitNum ? (pageNum - 1) * limitNum : undefined;
    const take = limitNum;

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          courses: true,
          facilities: true,
          admissionInfo: true,
          packageStats: true,
          gallery: true
        }
      }),
      prisma.college.count({ where })
    ]);

    const formatted = colleges.map(formatCollege);

    // Return as array if no pagination query, or paginated object if requested
    if (pageNum || limitNum) {
      res.json({
        data: formatted,
        pagination: {
          total,
          page: pageNum || 1,
          limit: limitNum || total,
          totalPages: limitNum ? Math.ceil(total / limitNum) : 1
        }
      });
    } else {
      res.json(formatted);
    }
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ error: 'Failed to retrieve colleges' });
  }
};

export const getCollegeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = String(id || '');

    const college = await prisma.college.findFirst({
      where: {
        OR: [
          { id: idStr },
          { slug: idStr },
          { code: idStr }
        ]
      },
      include: {
        courses: true,
        facilities: true,
        admissionInfo: true,
        packageStats: true,
        gallery: true
      }
    });

    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    res.json(formatCollege(college));
  } catch (error) {
    console.error('Error fetching college details:', error);
    res.status(500).json({ error: 'Failed to retrieve college details' });
  }
};

export const searchColleges = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const query = String(q || '').trim();

    if (!query) {
      return res.json([]);
    }

    const qLower = query.toLowerCase();
    const aliases: Record<string, string> = {
      'aiims': 'All India Institute of Medical Sciences',
      'gmc': 'Government Medical College',
      'afmc': 'Armed Forces Medical College',
      'mamc': 'Maulana Azad',
      'kmc': 'Kasturba Medical College',
      'bhu': 'Banaras Hindu',
      'jipmer': 'Jawaharlal Institute',
      'kgmu': 'King George',
      'lhmc': 'Lady Hardinge',
      'vmmc': 'Vardhman Mahavir',
      'ims': 'Institute of Medical Sciences',
      'rims': 'Regional Institute',
      'pgimer': 'Post Graduate Institute',
      'ucms': 'University College of Medical Sciences',
      'cmc': 'Christian Medical College'
    };

    const terms = [query];
    if (aliases[qLower]) {
      terms.push(aliases[qLower]);
    }

    const orConditions: any[] = [];
    for (const term of terms) {
      orConditions.push(
        { name: { contains: term, mode: 'insensitive' } },
        { shortName: { contains: term, mode: 'insensitive' } },
        { city: { contains: term, mode: 'insensitive' } },
        { state: { contains: term, mode: 'insensitive' } },
        { code: { contains: term, mode: 'insensitive' } }
      );
    }

    const colleges = await prisma.college.findMany({
      where: {
        OR: orConditions
      },
      take: 20,
      include: {
        courses: true,
        facilities: true,
        admissionInfo: true,
        packageStats: true,
        gallery: true
      }
    });

    res.json(colleges.map(formatCollege));
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

export const getManagementTypes = async (_req: Request, res: Response) => {
  res.json([
    { id: 'General Management', label: 'General Management Quota' },
    { id: 'NRI', label: 'NRI Quota' }
  ]);
};
