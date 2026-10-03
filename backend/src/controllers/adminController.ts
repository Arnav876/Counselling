import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

const SUPER_ADMIN_EMAIL = 'bmsit8@gmail.com';

// 1. Overview Dashboard Stats
export const getOverview = async (_req: Request, res: Response) => {
  try {
    const [
      collegesCount,
      coursesCount,
      studentsCount,
      adminsCount,
      enquiriesCount,
      contactsCount,
      conversationsCount,
      blogsCount,
      recentEnquiries,
      recentUsers
    ] = await Promise.all([
      prisma.college.count(),
      prisma.course.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } }),
      prisma.enquiry.count(),
      prisma.contact.count(),
      prisma.conversation.count(),
      prisma.blog.count(),
      prisma.enquiry.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true, avatar: true } } }
      }),
      prisma.user.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true, lastLoginAt: true }
      })
    ]);

    res.json({
      stats: {
        colleges: collegesCount,
        courses: coursesCount,
        students: studentsCount,
        admins: adminsCount,
        enquiries: enquiriesCount + contactsCount,
        conversations: conversationsCount,
        blogs: blogsCount
      },
      recentEnquiries,
      recentUsers
    });
  } catch (error: any) {
    console.error('Error fetching admin overview:', error);
    res.status(500).json({ error: 'Failed to fetch admin overview stats' });
  }
};

// 2. Colleges Management
export const getAdminColleges = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string || '').trim();
    const state = (req.query.state as string || '').trim();
    const management = (req.query.management as string || '').trim();

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (state && state !== 'All States') {
      where.state = state;
    }
    if (management && management !== 'All') {
      where.management = management;
    }

    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          courses: { select: { id: true, name: true, annualFee: true, seats: true } },
          admissionInfo: true,
          packageStats: true,
          facilities: { select: { id: true, name: true } },
          _count: { select: { savedBy: true } }
        }
      })
    ]);

    res.json({
      colleges,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Error fetching admin colleges:', error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
};

export const getAdminCollegeById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const college = await prisma.college.findUnique({
      where: { id },
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

    res.json(college);
  } catch (error: any) {
    console.error('Error fetching college details:', error);
    res.status(500).json({ error: 'Failed to fetch college details' });
  }
};

export const createAdminCollege = async (req: Request, res: Response) => {
  try {
    const {
      name,
      shortName,
      city,
      state,
      management = 'Private',
      managementTypes = ['General Management'],
      rating = 4.5,
      nirfRank,
      estYear = 2005,
      accreditation = 'NMC Recognized',
      shortDescription,
      fullDescription,
      highlights = [],
      stream = 'Medical',
      address,
      phone = '+91 78790 84889',
      email = 'admissionbychoice@gmail.com',
      website = 'https://admissionbychoice.com',
      campusArea = '25+ Acres',
      studentFacultyRatio = '1:3',
      mbbsSeats = 150,
      pgSeats = 50,
      image = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
      logo = 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
      courses = [],
      facilities = [],
      admissionInfo,
      packageStats
    } = req.body;

    if (!name || !city || !state) {
      return res.status(400).json({ error: 'College Name, City, and State are required' });
    }

    const uniqueSuffix = Date.now().toString(36);
    const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${slugBase}-${uniqueSuffix}`;
    const code = `COL-${Math.floor(10000 + Math.random() * 90000)}`;

    const newCollege = await prisma.college.create({
      data: {
        name,
        shortName: shortName || name.split(' ').slice(0, 3).join(' '),
        slug,
        code,
        city,
        state,
        management,
        managementTypes: Array.isArray(managementTypes) ? managementTypes : [managementTypes],
        rating: Number(rating) || 4.5,
        nirfRank: nirfRank ? Number(nirfRank) : null,
        estYear: Number(estYear) || 2005,
        accreditation,
        shortDescription: shortDescription || `${name} is a premier institution located in ${city}, ${state}.`,
        fullDescription: fullDescription || `${name} offers world-class academic infrastructure, hospital facilities, and clinical exposure in ${city}, ${state}.`,
        highlights: Array.isArray(highlights) ? highlights : [],
        stream,
        address: address || `${city}, ${state}`,
        phone,
        email,
        website,
        campusArea,
        studentFacultyRatio,
        mbbsSeats: Number(mbbsSeats) || 0,
        pgSeats: Number(pgSeats) || 0,
        image,
        logo,
        courses: {
          create: Array.isArray(courses) && courses.length > 0 ? courses.map((c: any) => ({
            name: c.name || 'MBBS',
            degree: c.degree || 'Undergraduate',
            duration: c.duration || '5.5 Years',
            annualFee: c.annualFee || '₹14,50,000 / year',
            seats: Number(c.seats) || 150,
            eligibility: c.eligibility || 'NEET Qualified (50% in PCB)'
          })) : [
            {
              name: 'MBBS - Bachelor of Medicine & Bachelor of Surgery',
              degree: 'Undergraduate',
              duration: '5.5 Years',
              annualFee: '₹14,50,000 / year',
              seats: Number(mbbsSeats) || 150,
              eligibility: 'NEET Qualified with 50% in PCB (10+2)'
            }
          ]
        },
        facilities: {
          create: Array.isArray(facilities) && facilities.length > 0 ? facilities.map((f: any) => ({
            name: f.name || 'Hospital & Clinical Exposure',
            iconName: f.iconName || 'local_hospital',
            description: f.description || 'Full-fledged multi-specialty teaching hospital'
          })) : [
            { name: 'Multi-Specialty Teaching Hospital', iconName: 'local_hospital', description: '750+ Bedded Hospital' },
            { name: 'Central Digital Library', iconName: 'menu_book', description: 'Access to global medical journals' },
            { name: 'Modern Hostels & Mess', iconName: 'hotel', description: 'AC & Non-AC accommodation for boys and girls' }
          ]
        },
        admissionInfo: admissionInfo ? {
          create: {
            process: admissionInfo.process || 'Centralized counseling & direct institutional quota verification.',
            entranceExams: admissionInfo.entranceExams || ['NEET-UG', 'NEET-PG'],
            cutoffPercentile: admissionInfo.cutoffPercentile || '50th Percentile NEET-UG',
            applicationDeadline: admissionInfo.applicationDeadline || 'September 30, 2026',
            eligibilityCriteria: admissionInfo.eligibilityCriteria || '10+2 with minimum 50% in Physics, Chemistry, Biology + NEET qualified.',
            managementQuotaDetails: admissionInfo.managementQuotaDetails || 'Direct counseling assistance available through Admission by Choice.'
          }
        } : {
          create: {
            process: 'State / All India NEET Counseling and NRI/Management Quota seats.',
            entranceExams: ['NEET-UG', 'NEET-PG'],
            cutoffPercentile: '50th Percentile NEET-UG',
            applicationDeadline: 'September 30, 2026',
            eligibilityCriteria: 'Passed 10+2 with PCB and English with min 50% marks, plus valid NEET score.',
            managementQuotaDetails: 'Guidance and admission support available via Admission by Choice counseling desk.'
          }
        },
        packageStats: packageStats ? {
          create: {
            average: packageStats.average || '₹12-16 LPA',
            highest: packageStats.highest || '₹32+ LPA',
            topRecruiters: packageStats.topRecruiters || ['Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare', 'Manipal Hospitals']
          }
        } : {
          create: {
            average: '₹12-16 LPA',
            highest: '₹32+ LPA',
            topRecruiters: ['Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare', 'Manipal Hospitals', 'Medanta']
          }
        }
      },
      include: {
        courses: true,
        facilities: true,
        admissionInfo: true,
        packageStats: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'College created successfully in PostgreSQL database.',
      college: newCollege
    });
  } catch (error: any) {
    console.error('Error creating college:', error);
    res.status(500).json({ error: 'Failed to create college', details: error.message });
  }
};

export const updateAdminCollege = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      name,
      shortName,
      city,
      state,
      management,
      managementTypes,
      rating,
      nirfRank,
      estYear,
      accreditation,
      shortDescription,
      fullDescription,
      highlights,
      stream,
      address,
      phone,
      email,
      website,
      campusArea,
      studentFacultyRatio,
      mbbsSeats,
      pgSeats,
      image,
      logo,
      admissionInfo,
      packageStats
    } = req.body;

    const existing = await prisma.college.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'College not found' });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (shortName !== undefined) updateData.shortName = shortName;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (management !== undefined) updateData.management = management;
    if (managementTypes !== undefined) updateData.managementTypes = Array.isArray(managementTypes) ? managementTypes : [managementTypes];
    if (rating !== undefined) updateData.rating = Number(rating);
    if (nirfRank !== undefined) updateData.nirfRank = nirfRank ? Number(nirfRank) : null;
    if (estYear !== undefined) updateData.estYear = Number(estYear);
    if (accreditation !== undefined) updateData.accreditation = accreditation;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (fullDescription !== undefined) updateData.fullDescription = fullDescription;
    if (highlights !== undefined) updateData.highlights = Array.isArray(highlights) ? highlights : [];
    if (stream !== undefined) updateData.stream = stream;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (website !== undefined) updateData.website = website;
    if (campusArea !== undefined) updateData.campusArea = campusArea;
    if (studentFacultyRatio !== undefined) updateData.studentFacultyRatio = studentFacultyRatio;
    if (mbbsSeats !== undefined) updateData.mbbsSeats = Number(mbbsSeats);
    if (pgSeats !== undefined) updateData.pgSeats = Number(pgSeats);
    if (image !== undefined) updateData.image = image;
    if (logo !== undefined) updateData.logo = logo;

    const updatedCollege = await prisma.college.update({
      where: { id },
      data: updateData,
      include: {
        courses: true,
        facilities: true,
        admissionInfo: true,
        packageStats: true
      }
    });

    if (admissionInfo) {
      await prisma.admissionInfo.upsert({
        where: { collegeId: id },
        create: {
          collegeId: id,
          process: admissionInfo.process || 'Centralized counseling & direct institutional quota verification.',
          entranceExams: admissionInfo.entranceExams || ['NEET-UG', 'NEET-PG'],
          cutoffPercentile: admissionInfo.cutoffPercentile || '50th Percentile NEET-UG',
          applicationDeadline: admissionInfo.applicationDeadline || 'August 31, 2026',
          eligibilityCriteria: admissionInfo.eligibilityCriteria || '10+2 with PCB + valid NEET score.',
          managementQuotaDetails: admissionInfo.managementQuotaDetails || null
        },
        update: {
          process: admissionInfo.process,
          entranceExams: admissionInfo.entranceExams,
          cutoffPercentile: admissionInfo.cutoffPercentile,
          applicationDeadline: admissionInfo.applicationDeadline,
          eligibilityCriteria: admissionInfo.eligibilityCriteria,
          managementQuotaDetails: admissionInfo.managementQuotaDetails
        }
      });
    }

    if (packageStats) {
      await prisma.packageStats.upsert({
        where: { collegeId: id },
        create: {
          collegeId: id,
          average: packageStats.average || '₹12-16 LPA',
          highest: packageStats.highest || '₹32+ LPA',
          topRecruiters: packageStats.topRecruiters || ['Apollo Hospitals', 'Fortis', 'Max Healthcare']
        },
        update: {
          average: packageStats.average,
          highest: packageStats.highest,
          topRecruiters: packageStats.topRecruiters
        }
      });
    }

    res.json({
      success: true,
      message: `College "${updatedCollege.name}" updated successfully in PostgreSQL.`,
      college: updatedCollege
    });
  } catch (error: any) {
    console.error('Error updating college:', error);
    res.status(500).json({ error: 'Failed to update college', details: error.message });
  }
};

export const deleteAdminCollege = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const college = await prisma.college.findUnique({ where: { id } });
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    await prisma.college.delete({ where: { id } });

    res.json({
      success: true,
      message: `College "${college.name}" was successfully deleted from PostgreSQL database.`
    });
  } catch (error: any) {
    console.error('Error deleting college:', error);
    res.status(500).json({ error: 'Failed to delete college' });
  }
};

// 3. Enquiries Management
export const getAdminEnquiries = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const search = (req.query.search as string || '').trim();
    const sort = (req.query.sort as string || 'newest');
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { studentName: { contains: search, mode: 'insensitive' } },
        { collegeName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, enquiries] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: sort === 'oldest' ? 'asc' : 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } }
        }
      })
    ]);

    res.json({
      enquiries,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Error fetching admin enquiries:', error);
    res.status(500).json({ error: 'Failed to fetch student enquiries' });
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, adminNote, notes, note } = req.body;

    const validStatuses = ['NEW', 'IN_PROGRESS', 'CONTACTED', 'RESOLVED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be NEW, IN_PROGRESS, CONTACTED, or RESOLVED' });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    const noteVal = adminNote ?? notes ?? note;
    if (noteVal !== undefined) {
      updateData.adminNote = noteVal;
      updateData.notes = noteVal;
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: `Enquiry updated successfully.`,
      enquiry: updated
    });
  } catch (error: any) {
    console.error('Error updating enquiry status:', error);
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
};

export const exportEnquiriesCSV = async (_req: Request, res: Response) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } }
    });

    const headers = ['Enquiry ID', 'Student Name', 'Phone', 'Email', 'College Name', 'Course', 'State', 'Status', 'Admin Note', 'Submitted At'];
    const rows = enquiries.map(e => [
      `"${e.id}"`,
      `"${e.studentName.replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      `"${e.email || e.user?.email || ''}"`,
      `"${e.collegeName.replace(/"/g, '""')}"`,
      `"${e.preferredCourse}"`,
      `"${e.preferredState || ''}"`,
      `"${e.status}"`,
      `"${(e.adminNote || '').replace(/"/g, '""')}"`,
      `"${new Date(e.createdAt).toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="admission_by_choice_enquiries.csv"');
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('Error exporting enquiries CSV:', error);
    res.status(500).json({ error: 'Failed to export enquiries' });
  }
};

// 4. Contacts / Direct Messages Management
export const getAdminContacts = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [total, contacts] = await Promise.all([
      prisma.contact.count({ where }),
      prisma.contact.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } }
        }
      })
    ]);

    res.json({
      contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Error fetching admin contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contact requests' });
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, adminNote } = req.body;

    const validStatuses = ['NEW', 'IN_PROGRESS', 'CONTACTED', 'RESOLVED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be NEW, IN_PROGRESS, CONTACTED, or RESOLVED' });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNote !== undefined) updateData.adminNote = adminNote;

    const updated = await prisma.contact.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: `Contact request updated`,
      contact: updated
    });
  } catch (error: any) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ error: 'Failed to update contact status' });
  }
};

// 5. AI Conversations Audit
export const getAdminConversations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const [total, conversations] = await Promise.all([
      prisma.conversation.count(),
      prisma.conversation.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
          _count: { select: { messages: true } },
          messages: {
            take: 2,
            orderBy: { createdAt: 'asc' },
            select: { id: true, role: true, content: true, createdAt: true }
          }
        }
      })
    ]);

    res.json({
      conversations,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations audit log' });
  }
};

export const getAdminConversationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error: any) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation details' });
  }
};

// 6. Users Management
export const getAdminUsers = async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;

    const where: any = {};
    if (role && role !== 'ALL') {
      where.role = role;
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              savedColleges: true,
              conversations: true,
              enquiries: true
            }
          }
        }
      })
    ]);

    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users list' });
  }
};

// 7. Admin Management (Super Admin ONLY)
export const getAuthorizedAdmins = async (_req: Request, res: Response) => {
  try {
    const authorizedAdmins = await prisma.authorizedAdmin.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const activeAdminUsers = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: { id: true, email: true, name: true, role: true, avatar: true, lastLoginAt: true, createdAt: true }
    });

    res.json({
      authorizedAdmins,
      activeAdminUsers,
      superAdminEmail: SUPER_ADMIN_EMAIL
    });
  } catch (error: any) {
    console.error('Error fetching authorized admins:', error);
    res.status(500).json({ error: 'Failed to fetch authorized admins list' });
  }
};

export const addAuthorizedAdmin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const currentUser = (req as any).user;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(400).json({ error: 'This email is already the permanent Super Admin.' });
    }

    const existingAuth = await prisma.authorizedAdmin.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingAuth) {
      return res.status(400).json({ error: `Admin with email "${normalizedEmail}" is already authorized.` });
    }

    const newAdminAuth = await prisma.authorizedAdmin.create({
      data: {
        email: normalizedEmail,
        role: 'ADMIN',
        addedBy: currentUser?.email || 'Super Admin'
      }
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      await prisma.user.update({
        where: { email: normalizedEmail },
        data: { role: 'ADMIN' }
      });
    }

    res.status(201).json({
      success: true,
      message: `Admin access authorized for ${normalizedEmail}.`,
      authorizedAdmin: newAdminAuth
    });
  } catch (error: any) {
    console.error('Error adding authorized admin:', error);
    res.status(500).json({ error: 'Failed to authorize new admin', details: error.message });
  }
};

export const revokeAuthorizedAdmin = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const record = await prisma.authorizedAdmin.findUnique({ where: { id } });
    if (!record) {
      return res.status(404).json({ error: 'Authorized admin record not found' });
    }

    if (record.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ error: 'Cannot revoke Super Admin privileges.' });
    }

    await prisma.authorizedAdmin.delete({ where: { id } });

    const userRecord = await prisma.user.findUnique({ where: { email: record.email } });
    if (userRecord && userRecord.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      await prisma.user.update({
        where: { email: record.email },
        data: { role: 'STUDENT' }
      });
    }

    res.json({
      success: true,
      message: `Admin privileges for "${record.email}" have been revoked.`
    });
  } catch (error: any) {
    console.error('Error revoking admin:', error);
    res.status(500).json({ error: 'Failed to revoke admin privileges' });
  }
};
