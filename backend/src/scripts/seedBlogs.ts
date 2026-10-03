import prisma from '../db/prisma.js';

const INITIAL_BLOGS = [
  {
    title: 'Top Private Medical Colleges in Karnataka: 2026 Admissions & Quota Guide',
    slug: 'top-private-medical-colleges-karnataka-2026-guide',
    category: 'PRIVATE',
    author: 'Admission by Choice Medical Advisory',
    excerpt: 'Comprehensive overview of Karnataka private medical colleges, management & NRI quota seat matrix, counseling steps, and fee structures.',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    tags: ['Karnataka', 'Private Colleges', 'MBBS', 'Management Quota', 'Admissions 2026'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-15T10:00:00Z'),
    content: `
# Top Private Medical Colleges in Karnataka: 2026 Admissions & Quota Guide

Karnataka continues to be the most sought-after destination for medical aspirants across India due to its premier private medical colleges, high patient inflow, and established clinical teaching hospitals.

---

### Key Advantages of Private Medical Colleges in Karnataka
1. **Diverse Seat Categories**: Karnataka offers General Management (KPCF / Private), NRI Quota, and Other Quota seats through KEA centralized counseling.
2. **Superior Infrastructure & Multi-Specialty Hospitals**: Top colleges like MS Ramaiah, Kempegowda Institute (KIMS), and St. John's feature 1000+ bedded teaching hospitals with cutting-edge ICU units.
3. **Transparent Admission Process**: All institutional and private quotas are strictly allocated via verified state merit lists.

---

### Top Institutions Breakdown

#### 1. MS Ramaiah Medical College, Bengaluru
- **Established**: 1979 | **Recognized by**: NMC
- **MBBS Intake**: 150 Seats
- **Key Highlight**: Located in central Bengaluru with exceptional clinical exposure and postgraduate residency opportunities.

#### 2. Kempegowda Institute of Medical Sciences (KIMS), Bengaluru
- **Hospital Capacity**: 1000+ Beds
- **Specialties**: Cardiology, Oncology, Neurology, Emergency Medicine.

#### 3. Father Muller Medical College, Mangalore
- **Accreditation**: NAAC 'A' Grade
- **Clinical Exposure**: Outstanding daily outpatient numbers ensuring hands-on procedural experience.

---

### 2026 Quota & Fee Structure Insights
- **General Management Tuition**: Ranges from ₹10.5 Lakhs to ₹16.5 Lakhs per year depending on the institution.
- **NRI / Other Quota**: Available for eligible candidates seeking direct institutional admission counseling.

> **Counselor Advice**: Always verify annual security deposits and clinical bond terms prior to choice-filling in KEA rounds. For personalized guidance, connect with the Admission by Choice counseling desk at +91 78790 84889.
`
  },
  {
    title: 'Private vs Deemed Medical Colleges: Key Differences, Fee Analysis & Clinical Exposure',
    slug: 'private-vs-deemed-medical-colleges-fee-analysis',
    category: 'PRIVATE',
    author: 'Senior Medical Counselor',
    excerpt: 'Detailed comparison between State Private Medical Colleges and Deemed Universities to help students make the right choice.',
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
    tags: ['Deemed Universities', 'Private Colleges', 'MCC Counseling', 'MBBS Fees'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-20T11:30:00Z'),
    content: `
# Private vs Deemed Medical Colleges: Key Differences, Fee Analysis & Clinical Exposure

Choosing between a State Private Medical College and a Deemed University is one of the most critical decisions for NEET-UG aspirants and their parents.

---

### 1. Governing Body & Counseling Authority
- **State Private Colleges**: Counseling is conducted by the respective State Counseling Authority (e.g., KEA in Karnataka, DMER in Maharashtra, BCECE in Bihar).
- **Deemed Universities**: 100% of seats across all deemed institutions (KMC Manipal, DY Patil, Amrita, Sri Ramachandra) are filled through All India MCC Central Counseling.

---

### 2. Fee Comparison
- **State Private Colleges**: Tuition fees are regulated by State Fee Regulatory Committees (typically ₹12L - ₹18L/yr).
- **Deemed Universities**: Fees are independently fixed by university trusts (ranging from ₹18L to ₹25L/yr).

---

### 3. Infrastructure & Research Opportunities
Deemed medical universities frequently feature extensive research infrastructure, international student exchange collaborations, and university-funded simulation laboratories.
`
  },
  {
    title: 'Top Government Medical Colleges in India: NEET Cutoffs, Bonds & Seat Matrix',
    slug: 'top-government-medical-colleges-india-neet-cutoffs',
    category: 'GOVERNMENT',
    author: 'Admission by Choice Editorial Board',
    excerpt: 'A comprehensive breakdown of premier government medical colleges, AIQ 15% quota cutoffs, and state mandatory service bonds.',
    coverImage: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&auto=format&fit=crop&q=80',
    tags: ['AIIMS', 'Government Colleges', 'NEET Cutoffs', 'State Quota', 'Bonds'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-25T09:15:00Z'),
    content: `
# Top Government Medical Colleges in India: NEET Cutoffs, Bonds & Seat Matrix

Government medical colleges (GMCs) in India offer top-tier clinical training with negligible tuition fees and unmatched patient density.

---

### Apex Government Medical Institutions

#### 1. AIIMS New Delhi & INI Institutions
- **Annual Tuition**: Under ₹2,000 per year.
- **NEET Requirement**: AIR 1 to 55 in general category.
- **Clinical Training**: Premier research grants, robotic surgery suites, and global medical alumni networks.

#### 2. Maulana Azad Medical College (MAMC), New Delhi
- **Associated Hospitals**: Lok Nayak Hospital & GB Pant Hospital.
- **Patient Inflow**: Over 10,000 daily outpatients ensuring unparalleled diagnosis experience.

#### 3. King George's Medical University (KGMU), Lucknow
- **Historical Legacy**: 110+ years of excellence in North India.
- **Beds**: 4,500+ across super-specialty departments.

---

### Understanding Mandatory Rural Service Bonds
State government colleges require candidates to execute rural service indemnity bonds ranging from 1 year (₹5 Lakhs - ₹10 Lakhs penalty) to 5 years depending on state policies.
`
  },
  {
    title: 'Government Medical Colleges in Bihar: PMCH, NMCH, DMCH & New GMCs 2026',
    slug: 'government-medical-colleges-bihar-pmch-nmch-guide',
    category: 'GOVERNMENT',
    author: 'Bihar State Counseling Desk',
    excerpt: 'Complete guide to Bihar state government medical colleges including PMCH world-class redevelopment, seat matrix, and BCECE counseling rounds.',
    coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=1200&auto=format&fit=crop&q=80',
    tags: ['Bihar', 'PMCH', 'NMCH', 'Government Medical Colleges', 'BCECE'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-28T14:00:00Z'),
    content: `
# Government Medical Colleges in Bihar: PMCH, NMCH, DMCH & New GMCs 2026

Bihar's medical education landscape has expanded substantially with the addition of new GMCs and the mega-redevelopment of Patna Medical College into a 5,462-bed world-class medical hub.

---

### Leading Government Medical Colleges in Bihar

1. **Patna Medical College & Hospital (PMCH), Patna**
   - Established in 1925; historical cornerstone of healthcare in Eastern India.
   - 200 MBBS seats through NEET-UG.

2. **Nalanda Medical College & Hospital (NMCH), Patna**
   - Modern super-specialty emergency blocks and 150 MBBS seats.

3. **Darbhanga Medical College & Hospital (DMCH), Laheriasarai**
   - Major referral center serving North Bihar and neighboring districts.

4. **Indira Gandhi Institute of Medical Sciences (IGIMS), Patna**
   - Autonomous super-specialty medical institute offering MBBS and broad-specialty MD/MS seats.

---

### Counseling & Cutoff Trends (BCECE / UGMAC)
Candidates with valid Bihar domicile can participate in the 85% state quota counseling conducted by BCECEB.
`
  }
];

async function seed() {
  console.log('🌱 Seeding initial blog articles into PostgreSQL...');
  for (const b of INITIAL_BLOGS) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      create: b,
      update: b
    });
    console.log(`  ✓ Blog: "${b.title}" [${b.category}]`);
  }
  const count = await prisma.blog.count();
  console.log(`✅ Total blogs in PostgreSQL: ${count}`);
}

seed().catch(console.error).finally(() => prisma.$disconnect());
