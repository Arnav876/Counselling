import { Response } from 'express';
import prisma from '../db/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

interface ChatMessageHistory {
  role: 'user' | 'assistant';
  content: string;
}

const INDIAN_STATES = [
  'Andaman & Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra & Nagar Haveli', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const ACRONYM_MAP: Record<string, string> = {
  'aiims': 'All India Institute of Medical Sciences',
  'gmc': 'Government Medical College',
  'afmc': 'Armed Forces Medical College',
  'mamc': 'Maulana Azad',
  'kmc': 'Kasturba',
  'bhu': 'Banaras Hindu',
  'jipmer': 'Jawaharlal Institute',
  'kgmu': 'King George',
  'lhmc': 'Lady Hardinge',
  'vmmc': 'Vardhman Mahavir',
  'ims': 'Institute of Medical Sciences',
  'rims': 'Regional Institute',
  'pgimer': 'Post Graduate Institute',
  'ucms': 'University College',
  'cmc': 'Christian Medical College',
  'pmch': 'Patna Medical College',
  'dmch': 'Darbhanga Medical College',
  'nmch': 'Nalanda Medical College',
  'kims': 'Kempegowda Institute of Medical Sciences',
  'msrit': 'Ramaiah Medical College',
  'bmc': 'Bangalore Medical College'
};

export const handleChat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, history = [], previousCollegeIds = [] } = req.body;
    const query = String(message || '').trim();

    if (!query) {
      return res.status(400).json({
        message: "Please provide a question about colleges, courses, or admissions.",
        colleges: [],
        suggestions: ["Show top colleges in Karnataka", "Show medical colleges in Bihar", "Which colleges offer MBBS?"]
      });
    }

    const lowerQuery = query.toLowerCase();

    // 1. Detect State
    let detectedState: string | null = null;
    for (const state of INDIAN_STATES) {
      if (lowerQuery.includes(state.toLowerCase())) {
        detectedState = state;
        break;
      }
    }
    // Check state shortcuts
    if (!detectedState) {
      if (lowerQuery.includes('up') || lowerQuery.includes('u.p.')) detectedState = 'Uttar Pradesh';
      else if (lowerQuery.includes('mp') || lowerQuery.includes('m.p.')) detectedState = 'Madhya Pradesh';
      else if (lowerQuery.includes('tn') || lowerQuery.includes('t.n.')) detectedState = 'Tamil Nadu';
      else if (lowerQuery.includes('ap') || lowerQuery.includes('a.p.')) detectedState = 'Andhra Pradesh';
      else if (lowerQuery.includes('wb') || lowerQuery.includes('w.b.')) detectedState = 'West Bengal';
      else if (lowerQuery.includes('bangalore') || lowerQuery.includes('bengaluru') || lowerQuery.includes('mysore') || lowerQuery.includes('mangalore')) detectedState = 'Karnataka';
      else if (lowerQuery.includes('mumbai') || lowerQuery.includes('pune') || lowerQuery.includes('nagpur')) detectedState = 'Maharashtra';
      else if (lowerQuery.includes('patna') || lowerQuery.includes('gaya') || lowerQuery.includes('muzaffarpur') || lowerQuery.includes('bhagalpur') || lowerQuery.includes('nalanda')) detectedState = 'Bihar';
      else if (lowerQuery.includes('chennai') || lowerQuery.includes('coimbatore') || lowerQuery.includes('madurai')) detectedState = 'Tamil Nadu';
      else if (lowerQuery.includes('hyderabad') || lowerQuery.includes('warangal')) detectedState = 'Telangana';
      else if (lowerQuery.includes('kolkata')) detectedState = 'West Bengal';
      else if (lowerQuery.includes('lucknow') || lowerQuery.includes('kanpur') || lowerQuery.includes('varanasi') || lowerQuery.includes('noida') || lowerQuery.includes('agra')) detectedState = 'Uttar Pradesh';
      else if (lowerQuery.includes('jaipur') || lowerQuery.includes('jodhpur') || lowerQuery.includes('udaipur')) detectedState = 'Rajasthan';
      else if (lowerQuery.includes('chandigarh')) detectedState = 'Chandigarh';
      else if (lowerQuery.includes('delhi') || lowerQuery.includes('new delhi')) detectedState = 'Delhi';
    }

    // 2. Detect Management Type
    let detectedManagement: string | null = null;
    if (lowerQuery.includes('private') && !lowerQuery.includes('government') && !lowerQuery.includes('govt')) {
      detectedManagement = 'Private';
    } else if (lowerQuery.includes('government') || lowerQuery.includes('govt')) {
      detectedManagement = 'Government';
    } else if (lowerQuery.includes('deemed')) {
      detectedManagement = 'Deemed';
    } else if (lowerQuery.includes('nri')) {
      detectedManagement = 'NRI';
    }

    // 3. Detect Course/Specialization
    let detectedCourse: string | null = null;
    const courseKeywords = [
      'mbbs', 'pediatrics', 'paediatrics', 'surgery', 'general surgery', 'general medicine',
      'anaesthesiology', 'radiology', 'radio-diagnosis', 'orthopaedics', 'orthopedics',
      'ophthalmology', 'gynaecology', 'obstetrics', 'dermatology', 'pathology',
      'microbiology', 'pharmacology', 'anatomy', 'physiology', 'biochemistry',
      'psychiatry', 'ent', 'community medicine', 'pulmonary', 'respiratory'
    ];
    for (const ck of courseKeywords) {
      if (lowerQuery.includes(ck)) {
        detectedCourse = ck;
        break;
      }
    }

    // Check engineering / CSE query
    const isEngineeringQuery = lowerQuery.includes('engineering') || lowerQuery.includes('cse') || lowerQuery.includes('computer science') || lowerQuery.includes('b.tech') || lowerQuery.includes('btech') || lowerQuery.includes('mechanical') || lowerQuery.includes('civil') || lowerQuery.includes('electrical') || lowerQuery.includes('it branch');

    // 4. Detect Specific College Mention
    let specificCollege: any = null;
    
    // Check previous college context if follow-up
    const isFollowUp = (lowerQuery.includes('these') || lowerQuery.includes('this college') || lowerQuery.includes('them') || lowerQuery.includes('they') || lowerQuery.includes('it') || lowerQuery.includes('the college') || lowerQuery.includes('first one') || lowerQuery.includes('second one')) && previousCollegeIds.length > 0;

    // Check if query mentions a college name directly
    let collegeSearchTerms: string[] = [];
    for (const [acronym, expanded] of Object.entries(ACRONYM_MAP)) {
      if (new RegExp(`\\b${acronym}\\b`, 'i').test(query)) {
        collegeSearchTerms.push(expanded);
        collegeSearchTerms.push(acronym.toUpperCase());
      }
    }

    // Clean query to find specific college names
    const cleanedTerms = query
      .replace(/what courses (does|do|are offered at|are available at|in|at)|what is the fee (of|at)|what are the fees (of|at)|tell me about|what about|information on|details for|fees of|courses in|courses at|admission process in|admission at|cutoff for|how is|is|available at|offer\??|offers\??/gi, ' ')
      .trim();

    if (cleanedTerms.length >= 3 && !isEngineeringQuery) {
      collegeSearchTerms.push(cleanedTerms);
      // Also push key parts (e.g. "Vardhman Mahavir", "Maulana Azad", "Kasturba", etc.)
      const words = cleanedTerms.split(/\s+/).filter(w => w.length > 3 && !['college', 'medical', 'institute', 'hospital', 'which', 'show', 'list', 'find'].includes(w.toLowerCase()));
      if (words.length > 0) {
        collegeSearchTerms.push(words.join(' '));
        if (words.length > 1) {
          collegeSearchTerms.push(words[0] + ' ' + words[1]);
        }
        collegeSearchTerms.push(words[0]);
      }
    }

    if (collegeSearchTerms.length > 0) {
      for (const term of collegeSearchTerms) {
        if (!term || term.length < 3) continue;
        specificCollege = await prisma.college.findFirst({
          where: {
            OR: [
              { name: { contains: term, mode: 'insensitive' } },
              { shortName: { contains: term, mode: 'insensitive' } },
              { code: { contains: term, mode: 'insensitive' } }
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
        if (specificCollege) break;
      }
    }

    // 5. Handle Specific College Details Query
    if (specificCollege) {
      const c = specificCollege;
      const mbbsCourse = c.courses.find((course: any) => course.degree === 'MBBS' || course.name.includes('MBBS'));
      const pgCourses = c.courses.filter((course: any) => course.degree !== 'MBBS');

      let responseText = `### 🏛️ **${c.name}**\n\n`;
      responseText += `📍 **Location:** ${c.city}, ${c.state}  \n`;
      responseText += `🏷️ **Management / Quota:** ${c.management} (${c.managementTypes.join(', ')})  \n`;
      responseText += `⭐ **Rating:** ${c.rating} / 5.0 (${c.reviewsCount} verified reviews)  \n`;
      if (c.nirfRank) responseText += `🏆 **NIRF Ranking:** #${c.nirfRank} in India  \n`;
      responseText += `📅 **Established:** ${c.estYear} | **Accreditation:** ${c.accreditation}\n\n`;

      responseText += `**Institutional Overview:**  \n${c.fullDescription}\n\n`;

      if (mbbsCourse) {
        responseText += `🎓 **MBBS Program:**  \n`;
        responseText += `- **Total MBBS Seats:** ${c.mbbsSeats} Seats  \n`;
        responseText += `- **Annual Tuition Fee:** ${mbbsCourse.annualFee}  \n`;
        responseText += `- **Duration:** ${mbbsCourse.duration}  \n`;
        responseText += `- **Eligibility:** ${mbbsCourse.eligibility}\n\n`;
      }

      if (pgCourses.length > 0) {
        responseText += `📚 **Post-Graduate (MD/MS) Programs (${c.pgSeats} Total PG Seats):**  \n`;
        pgCourses.slice(0, 5).forEach((pg: any) => {
          responseText += `- **${pg.name}**: ${pg.seats} Seats (${pg.duration}, ${pg.annualFee})  \n`;
        });
        if (pgCourses.length > 5) {
          responseText += `- *...and ${pgCourses.length - 5} additional specialized clinical courses.*  \n`;
        }
        responseText += `\n`;
      }

      if (c.admissionInfo) {
        responseText += `📋 **Admissions & Cutoffs:**  \n`;
        responseText += `- **Exams Accepted:** ${c.admissionInfo.entranceExams.join(', ')}  \n`;
        responseText += `- **Expected Cutoff:** ${c.admissionInfo.cutoffPercentile}  \n`;
        responseText += `- **Application Deadline:** ${c.admissionInfo.applicationDeadline}  \n`;
        if (c.admissionInfo.managementQuotaDetails) {
          responseText += `- **Quota Guidance:** ${c.admissionInfo.managementQuotaDetails}  \n`;
        }
        responseText += `\n`;
      }

      if (c.packageStats) {
        responseText += `💼 **Career & Residency Insights:**  \n`;
        responseText += `- **Average Package/Stipend:** ${c.packageStats.average}  \n`;
        responseText += `- **Highest Specialization Package:** ${c.packageStats.highest}  \n`;
        responseText += `- **Key Hospitals & Recruiters:** ${c.packageStats.topRecruiters.join(', ')}\n\n`;
      }

      if (c.facilities && c.facilities.length > 0) {
        responseText += `🏢 **Campus Facilities:**  \n`;
        c.facilities.forEach((f: any) => {
          responseText += `- **${f.name}:** ${f.description || 'Modern on-campus facility'}\n`;
        });
        responseText += `\n`;
      }

      responseText += `📞 **Admissions Office:** ${c.phone} | ✉️ ${c.email}`;

      return res.json({
        message: responseText,
        colleges: [formatCollegeCard(c)],
        suggestions: [
          `What are the hostel facilities at ${c.shortName}?`,
          `Compare ${c.shortName} with other colleges in ${c.state}`,
          `Show other colleges in ${c.state}`,
          `How to apply for Management Quota at ${c.shortName}?`
        ]
      });
    }

    // 6. Handle Follow-up referring to previous colleges
    if (isFollowUp) {
      const targetColleges = await prisma.college.findMany({
        where: { id: { in: previousCollegeIds } },
        include: { courses: true, facilities: true, admissionInfo: true, packageStats: true }
      });

      if (targetColleges.length > 0) {
        if (lowerQuery.includes('hostel') || lowerQuery.includes('facility') || lowerQuery.includes('facilities')) {
          let responseText = `Here is the facility & hostel breakdown for the colleges we discussed:\n\n`;
          targetColleges.forEach(col => {
            responseText += `### 🏥 **${col.name}** (${col.city}, ${col.state})\n`;
            col.facilities.forEach(f => {
              responseText += `- **${f.name}**: ${f.description || 'Available on campus'}\n`;
            });
            responseText += `\n`;
          });
          return res.json({
            message: responseText,
            colleges: targetColleges.map(formatCollegeCard),
            suggestions: ["What are their fee structures?", "Compare their seat counts", "Show admission cutoffs"]
          });
        }

        if (lowerQuery.includes('fee') || lowerQuery.includes('cost') || lowerQuery.includes('budget') || lowerQuery.includes('tuition')) {
          let responseText = `Here is the fee comparison for the colleges:\n\n`;
          targetColleges.forEach(col => {
            const mbbs = col.courses.find(c => c.degree === 'MBBS');
            responseText += `- **${col.name}** (${col.management}): **${mbbs ? mbbs.annualFee : '₹50,000 / year'}** (Seats: ${col.mbbsSeats})\n`;
          });
          return res.json({
            message: responseText,
            colleges: targetColleges.map(formatCollegeCard),
            suggestions: ["Tell me about their admission process", "Which one has higher NIRF ranking?"]
          });
        }

        if (detectedCourse) {
          let responseText = `Here are the courses matching **${detectedCourse.toUpperCase()}** in those colleges:\n\n`;
          let matchedAny = false;
          targetColleges.forEach(col => {
            const matchingCourses = col.courses.filter(c => c.name.toLowerCase().includes(detectedCourse!));
            if (matchingCourses.length > 0) {
              matchedAny = true;
              responseText += `### **${col.name}**\n`;
              matchingCourses.forEach(c => {
                responseText += `- **${c.name}**: ${c.seats} seats (${c.duration}, ${c.annualFee})\n`;
              });
              responseText += `\n`;
            }
          });
          if (!matchedAny) {
            responseText += `None of the previously viewed colleges listed specialized ${detectedCourse} courses. All of them offer full MBBS degrees.`;
          }
          return res.json({
            message: responseText,
            colleges: targetColleges.map(formatCollegeCard),
            suggestions: ["Show other colleges offering this course", "Compare these colleges"]
          });
        }
      }
    }

    // 7. Handle Engineering / Computer Science clarification if asked
    if (isEngineeringQuery) {
      let responseText = `Admission by Choice specializes in higher education counseling across India. Our authoritative database currently features **839 verified National Medical Commission (NMC) accredited medical colleges & teaching universities** offering MBBS and post-graduate medical programs.\n\n`;
      
      let sampleColleges: any[] = [];
      if (detectedState) {
        responseText += `If you or someone in your family is also considering medical and healthcare admissions in **${detectedState}**, here are top institutions in ${detectedState}:\n\n`;
        sampleColleges = await prisma.college.findMany({
          where: { state: { equals: detectedState, mode: 'insensitive' } },
          take: 4,
          orderBy: [{ nirfRank: 'asc' }, { rating: 'desc' }],
          include: { courses: true, facilities: true, admissionInfo: true, packageStats: true }
        });
      } else {
        responseText += `Here are some of India's premier accredited health sciences and medical institutions:\n\n`;
        sampleColleges = await prisma.college.findMany({
          take: 4,
          orderBy: [{ rating: 'desc' }],
          include: { courses: true, facilities: true, admissionInfo: true, packageStats: true }
        });
      }

      return res.json({
        message: responseText,
        colleges: sampleColleges.map(formatCollegeCard),
        suggestions: [
          detectedState ? `Show all colleges in ${detectedState}` : "Show colleges in Karnataka",
          "Show government medical colleges",
          "Show private colleges with NRI quota"
        ]
      });
    }

    // 8. General Database Querying by State / Management / Course / Facility / Rankings
    const where: any = {};

    if (detectedState) {
      where.state = { equals: detectedState, mode: 'insensitive' };
    }

    if (detectedManagement) {
      if (detectedManagement === 'Private') {
        where.management = { contains: 'Private', mode: 'insensitive' };
      } else if (detectedManagement === 'Government') {
        where.management = { contains: 'Government', mode: 'insensitive' };
      } else if (detectedManagement === 'NRI') {
        where.managementTypes = { hasSome: ['NRI'] };
      }
    }

    if (detectedCourse) {
      where.courses = {
        some: {
          name: { contains: detectedCourse, mode: 'insensitive' }
        }
      };
    }

    if (lowerQuery.includes('hostel')) {
      where.facilities = {
        some: {
          name: { contains: 'Hostel', mode: 'insensitive' }
        }
      };
    }

    // If query has specific words that didn't match state or management, try text match
    if (!detectedState && !detectedManagement && !detectedCourse) {
      const cleanKeywords = query
        .replace(/colleges?|institutions?|universities?|show|find|list|which|available|tell|about|in|the|best|top|good/gi, '')
        .trim();
      if (cleanKeywords.length > 2) {
        where.OR = [
          { name: { contains: cleanKeywords, mode: 'insensitive' } },
          { shortName: { contains: cleanKeywords, mode: 'insensitive' } },
          { city: { contains: cleanKeywords, mode: 'insensitive' } },
          { state: { contains: cleanKeywords, mode: 'insensitive' } }
        ];
      }
    }

    // Execute query
    const results = await prisma.college.findMany({
      where,
      take: 6,
      orderBy: [
        { nirfRank: 'asc' },
        { rating: 'desc' },
        { mbbsSeats: 'desc' }
      ],
      include: {
        courses: true,
        facilities: true,
        admissionInfo: true,
        packageStats: true,
        gallery: true
      }
    });

    if (results.length === 0) {
      let notFoundMsg = `I couldn't find any college matching your specific criteria in the Admission by Choice database.`;
      if (detectedState) {
        const stateSummary = await prisma.stateSummary.findFirst({
          where: { name: { equals: detectedState, mode: 'insensitive' } }
        });
        if (stateSummary) {
          notFoundMsg = `In **${detectedState}**, our database has **${stateSummary.collegeCount} verified colleges** with **${stateSummary.totalMbbsSeats} total MBBS seats**. However, none directly matched your exact filter combination.`;
        }
      }
      return res.json({
        message: notFoundMsg + ` Would you like to view all colleges in ${detectedState || 'Karnataka'} or reset the filters?`,
        colleges: [],
        suggestions: [
          `Show all colleges in ${detectedState || 'Karnataka'}`,
          "Show government medical colleges",
          "Show private colleges with NRI quota",
          "Contact our admissions counselor"
        ]
      });
    }

    // Build rich response
    let responseText = `Here are **${results.length} premier colleges** from our database`;
    if (detectedState) responseText += ` in **${detectedState}**`;
    if (detectedManagement) responseText += ` (${detectedManagement} quota)`;
    if (detectedCourse) responseText += ` offering **${detectedCourse.toUpperCase()}**`;
    responseText += `:\n\n`;

    results.forEach((col, idx) => {
      const mbbs = col.courses.find(c => c.degree === 'MBBS');
      responseText += `### ${idx + 1}. **${col.name}**\n`;
      responseText += `- 📍 **City / State:** ${col.city}, ${col.state}\n`;
      responseText += `- 🏷️ **Management:** ${col.management} | ⭐ **Rating:** ${col.rating} ★\n`;
      responseText += `- 🎓 **Seats:** ${col.mbbsSeats} MBBS Seats${col.pgSeats > 0 ? ` + ${col.pgSeats} PG Seats` : ''}\n`;
      responseText += `- 💰 **Tuition:** ${mbbs ? mbbs.annualFee : '₹50,000 / year'}\n`;
      if (col.packageStats?.average) {
        responseText += `- 💼 **Avg Placement / Stipend:** ${col.packageStats.average}\n`;
      }
      responseText += `\n`;
    });

    responseText += `💡 *You can ask me for course breakdowns, hostel & facility details, or comparison between any of these colleges.*`;

    const nextSuggestions = [
      `What are the hostel facilities for these?`,
      `Compare tuition fees of these colleges`,
      `What are the NEET cutoff requirements?`,
      `Show private colleges with NRI quota in ${detectedState || 'Maharashtra'}`
    ];

    const formattedColleges = results.map(formatCollegeCard);

    let currentConversationId = req.body.conversationId || null;
    if (req.user) {
      try {
        if (!currentConversationId) {
          const autoTitle = query.length > 40 ? query.slice(0, 40) + '...' : query;
          const conv = await prisma.conversation.create({
            data: {
              userId: req.user.id,
              title: autoTitle
            }
          });
          currentConversationId = conv.id;
        } else {
          // Update timestamp
          await prisma.conversation.update({
            where: { id: currentConversationId },
            data: { updatedAt: new Date() }
          }).catch(() => {});
        }

        // Save User Message
        await prisma.chatMessage.create({
          data: {
            conversationId: currentConversationId,
            role: 'USER',
            content: query
          }
        });

        // Save Assistant Message
        await prisma.chatMessage.create({
          data: {
            conversationId: currentConversationId,
            role: 'ASSISTANT',
            content: responseText,
            colleges: formattedColleges as any,
            suggestions: nextSuggestions
          }
        });
      } catch (dbErr) {
        console.error('Failed to log conversation to database:', dbErr);
      }
    }

    return res.json({
      message: responseText,
      colleges: formattedColleges,
      suggestions: nextSuggestions,
      conversationId: currentConversationId
    });

  } catch (error) {
    console.error('Chat processing error:', error);
    return res.status(500).json({
      message: "I encountered an error processing your query. Please try asking again or contact our counseling helpline at +91 78790 84889.",
      colleges: [],
      suggestions: ["Show colleges in Karnataka", "Show colleges in Bihar", "Contact admissions helpline"]
    });
  }
};

function formatCollegeCard(col: any) {
  return {
    id: col.id,
    name: col.name,
    shortName: col.shortName || col.name,
    city: col.city,
    state: col.state,
    rating: col.rating,
    nirfRank: col.nirfRank || undefined,
    managementTypes: col.managementTypes || ['General Management'],
    image: col.image,
    distance: col.distance,
    estYear: col.estYear,
    mbbsSeats: col.mbbsSeats,
    pgSeats: col.pgSeats,
    packageStats: col.packageStats ? {
      average: col.packageStats.average,
      highest: col.packageStats.highest
    } : {
      average: '₹12 - ₹15 LPA',
      highest: '₹30+ LPA'
    },
    tuitionFee: col.courses?.[0]?.annualFee || '₹50,000 / year'
  };
}
