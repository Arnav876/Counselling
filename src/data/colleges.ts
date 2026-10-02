import type { College, StateData } from '../types/college';

export const COLLEGE_DATA: College[] = [
  {
    id: "col-1",
    name: "RV College of Engineering",
    shortName: "RVCE",
    slug: "rv-college-of-engineering",
    logo: "RV",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    city: "Bengaluru",
    state: "Karnataka",
    distance: 18,
    managementTypes: ["General Management"],
    rating: 4.8,
    reviewsCount: 1420,
    nirfRank: 89,
    estYear: 1963,
    accreditation: "NAAC A++",
    shortDescription: "Consistently ranked among the top autonomous engineering colleges in India with world-class faculty and industry-driven R&D hubs.",
    fullDescription: "RV College of Engineering (RVCE) established in 1963 is an autonomous engineering college in Bangalore. Affiliated to Visvesvaraya Technological University, Belagavi, it offers 15 undergraduate and 14 postgraduate programs. Recognized as a Center of Excellence by various global technical societies, RVCE produces top-ranking tech talent recruited by Tier-1 tech giants.",
    highlights: [
      "Washington Accord Tier-1 Accreditation",
      "Over ₹35+ Crore in Sponsored Research Grants",
      "97.4% Placement Rate for Eligible Batches",
      "Dedicated Autonomous Tech Center & Incubator"
    ],
    stream: "Engineering",
    courses: [
      { id: "c1", name: "Computer Science & Engineering", degree: "B.E.", duration: "4 Years", annualFee: "₹3,80,000", seats: 180, eligibility: "10+2 PCM with min 50% + KCET/COMEDK/JEE" },
      { id: "c2", name: "Artificial Intelligence & Machine Learning", degree: "B.E.", duration: "4 Years", annualFee: "₹3,90,000", seats: 120, eligibility: "10+2 PCM with min 50% + KCET/COMEDK" },
      { id: "c3", name: "Information Science & Engineering", degree: "B.E.", duration: "4 Years", annualFee: "₹3,50,000", seats: 120, eligibility: "10+2 PCM with min 50% + KCET/COMEDK" },
      { id: "c4", name: "Electronics & Communication Engineering", degree: "B.E.", duration: "4 Years", annualFee: "₹3,20,000", seats: 180, eligibility: "10+2 PCM with min 50% + KCET/COMEDK" },
      { id: "c5", name: "Mechanical Engineering", degree: "B.E.", duration: "4 Years", annualFee: "₹2,50,000", seats: 120, eligibility: "10+2 PCM with min 45% + KCET/COMEDK" }
    ],
    address: "Mysore Road, RV Vidyanikethan Post, Bengaluru, Karnataka 560059",
    phone: "+91 80 6818 8100",
    email: "admissions@rvce.edu.in",
    website: "https://rvce.edu.in",
    facilities: [
      { id: "f1", name: "Advanced AI Labs", iconName: "computer", description: "State-of-the-art supercomputing and machine learning clusters" },
      { id: "f2", name: "Central Tech Library", iconName: "local_library", description: "Over 150,000 volumes, IEEE digital access & research portals" },
      { id: "f3", name: "Separate Hostels", iconName: "hotel", description: "Wi-Fi enabled secure hostel wings for boys and girls" },
      { id: "f4", name: "Gigabit Campus Wi-Fi", iconName: "wifi", description: "Unrestricted high-speed internet backbone across campus" },
      { id: "f5", name: "Sports Arena & Gym", iconName: "fitness_center", description: "Cricket ground, basketball court, indoor badminton and gym" },
      { id: "f6", name: "Incubation Hub", iconName: "lightbulb", description: "Venture-funded startup incubator and maker space" }
    ],
    admissionInfo: {
      process: "Admissions are conducted through KCET (Karnataka CET), COMEDK-UGET, and Direct Institutional General Management Counseling.",
      entranceExams: ["KCET", "COMEDK-UGET", "JEE Main"],
      cutoffPercentile: "98.5+ percentile for CSE; 96+ percentile for ECE",
      applicationDeadline: "May 30, 2025",
      eligibilityCriteria: "Passed 10+2 or equivalent examination with Physics and Mathematics as compulsory subjects along with Chemistry / Bio-Technology / Biology.",
      managementQuotaDetails: "Merit-based institutional allocation under General Management Quota with structured tuition schedule."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹14.2 LPA",
      highest: "₹62.0 LPA",
      topRecruiters: ["Microsoft", "Amazon", "Cisco", "Qualcomm", "Texas Instruments", "Atlassian"]
    },
    campusArea: "52 Acres",
    studentFacultyRatio: "14:1"
  },
  {
    id: "col-2",
    name: "BMS Institute of Technology & Management",
    shortName: "BMSIT",
    slug: "bms-institute-of-technology",
    logo: "BM",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    city: "Bengaluru",
    state: "Karnataka",
    distance: 12,
    managementTypes: ["General Management"],
    rating: 4.6,
    reviewsCount: 980,
    nirfRank: 151,
    estYear: 2002,
    accreditation: "NAAC A+",
    shortDescription: "Renowned technical institute known for exceptional computing placements, international student symposiums, and robust innovation labs.",
    fullDescription: "BMSIT&M is an autonomous engineering college located in Yelahanka, Bangalore. Established by the prestigious BMS Educational Trust, the institute has rapidly grown into one of Karnataka's top private engineering destinations offering multidisciplinary engineering programs.",
    highlights: [
      "Autonomous Curriculum aligned with Silicon Valley standards",
      "Over 92% Placement Records across IT and Electronics streams",
      "Industry Innovation centers by Intel, Texas Instruments & Bosch",
      "Sprawling green Wi-Fi enabled North Bangalore campus"
    ],
    stream: "Engineering",
    courses: [
      { id: "c21", name: "Computer Science & Engineering", degree: "B.E.", duration: "4 Years", annualFee: "₹3,20,000", seats: 180, eligibility: "10+2 PCM min 45% + KCET/COMEDK" },
      { id: "c22", name: "AI & Data Science", degree: "B.E.", duration: "4 Years", annualFee: "₹3,40,000", seats: 120, eligibility: "10+2 PCM min 45% + KCET/COMEDK" },
      { id: "c23", name: "Electronics & Communication", degree: "B.E.", duration: "4 Years", annualFee: "₹2,80,000", seats: 120, eligibility: "10+2 PCM min 45% + KCET/COMEDK" }
    ],
    address: "Doddaballapur Main Road, Avalahalli, Yelahanka, Bengaluru, Karnataka 560064",
    phone: "+91 80 2856 1576",
    email: "principal@bmsit.in",
    website: "https://bmsit.ac.in",
    facilities: [
      { id: "f21", name: "Robotics & IoT Labs", iconName: "smart_toy", description: "Advanced hardware fabrication and robotics design" },
      { id: "f22", name: "Digital Library", iconName: "menu_book", description: "Comprehensive electronic textbook repositories and journal access" },
      { id: "f23", name: "Campus Hostels", iconName: "apartment", description: "Separate modern boarding quarters with hygienic dining" }
    ],
    admissionInfo: {
      process: "KCET and COMEDK rank counseling. Direct General Management seats available with transparent fee schedules.",
      entranceExams: ["KCET", "COMEDK-UGET"],
      cutoffPercentile: "94+ percentile for CSE; 90+ percentile for ECE",
      applicationDeadline: "June 15, 2025",
      eligibilityCriteria: "10+2 with PCM minimum 45% (40% for reserved categories).",
      managementQuotaDetails: "Seats allocated based on merit evaluation of entrance test rank and qualifying examination marks."
    },
    gallery: [
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹9.8 LPA",
      highest: "₹44.0 LPA",
      topRecruiters: ["Amazon", "Oracle", "SAP Labs", "Capgemini", "Dell"]
    },
    campusArea: "21 Acres",
    studentFacultyRatio: "15:1"
  },
  {
    id: "col-3",
    name: "Ramaiah Institute of Technology - NRI Wing",
    shortName: "MSRIT NRI",
    slug: "ramaiah-institute-of-technology-nri",
    logo: "RI",
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1200&q=80",
    city: "Bengaluru",
    state: "Karnataka",
    distance: 14,
    managementTypes: ["NRI", "General Management"],
    rating: 4.7,
    reviewsCount: 1120,
    nirfRank: 67,
    estYear: 1962,
    accreditation: "NAAC A++",
    shortDescription: "Dedicated international and NRI quota academic wing providing global technical curriculum and extensive multinational hiring drives.",
    fullDescription: "Ramaiah Institute of Technology (MSRIT) NRI Division provides dedicated international admission pathways for Non-Resident Indians, Persons of Indian Origin (PIO), and foreign students. Featuring international curriculum alignments, dedicated mentors, and premium campus amenities.",
    highlights: [
      "Designated NRI & International Student Welfare Council",
      "Over 300+ Global MNCs Visiting Campus Annually",
      "Direct Sponsorship & International Passport Quota Verification",
      "Executive Air-Conditioned NRI Student Residence Towers"
    ],
    stream: "Engineering",
    courses: [
      { id: "c31", name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹5,50,000", seats: 60, eligibility: "10+2 / High School Diploma with PCM + Valid NRI Sponsorship" },
      { id: "c32", name: "Information Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹4,80,000", seats: 40, eligibility: "10+2 / High School Diploma + NRI status" },
      { id: "c33", name: "Artificial Intelligence & Data Science", degree: "B.Tech", duration: "4 Years", annualFee: "₹5,20,000", seats: 40, eligibility: "10+2 PCM min 50% + NRI credentials" }
    ],
    address: "MSR Nagar, MSRIT Post, Mathikere, Bengaluru, Karnataka 560054",
    phone: "+91 80 2360 0822",
    email: "nri-admissions@msrit.edu",
    website: "https://msrit.edu",
    facilities: [
      { id: "f31", name: "Global Research Centers", iconName: "biotech", description: "Joint research laboratories in partnership with European universities" },
      { id: "f32", name: "AC NRI Hostels", iconName: "hotel", description: "Air-conditioned single & double occupancy rooms with continental cuisine" },
      { id: "f33", name: "Olympic Sports Complex", iconName: "pool", description: "Heated swimming pool, squash courts, and gymnasium" }
    ],
    admissionInfo: {
      process: "Direct NRI Quota evaluation based on 10+2 / IB Diploma / SAT / JEE credentials with embassy sponsorship verification.",
      entranceExams: ["SAT", "JEE Main", "Direct NRI Merit"],
      cutoffPercentile: "Min 60% in High School PCM / SAT Score 1150+",
      applicationDeadline: "July 10, 2025",
      eligibilityCriteria: "Candidate must be an NRI / Ward of NRI or have valid NRI sponsorship with requisite overseas bank proof.",
      managementQuotaDetails: "Dedicated NRI seat matrix with transparent foreign remittance fee structure."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹12.6 LPA",
      highest: "₹55.0 LPA",
      topRecruiters: ["Adobe", "Morgan Stanley", "Google", "JP Morgan", "Goldman Sachs"]
    },
    campusArea: "65 Acres",
    studentFacultyRatio: "12:1"
  },
  {
    id: "col-4",
    name: "College of Engineering, Pune (COEP)",
    shortName: "COEP",
    slug: "college-of-engineering-pune",
    logo: "CO",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
    city: "Pune",
    state: "Maharashtra",
    distance: 35,
    managementTypes: ["General Management"],
    rating: 4.9,
    reviewsCount: 2150,
    nirfRank: 73,
    estYear: 1854,
    accreditation: "NAAC A++",
    shortDescription: "One of the oldest premier engineering institutions in Asia, offering distinguished heritage, stellar alumni network, and top core placements.",
    fullDescription: "Established in 1854, COEP Technological University is the third oldest engineering college in Asia. Located in the cultural and educational capital of Maharashtra, COEP boasts illustrious alumni including Bharat Ratna Sir M. Visvesvaraya.",
    highlights: [
      "170+ Years of Academic Heritage & Institutional Prestige",
      "Autonomous Status with University Tier-1 Governance",
      "Over 98% Core & Software Engineering Placement Record",
      "Historic Campus with 150+ Technical & Cultural Clubs"
    ],
    stream: "Engineering",
    courses: [
      { id: "c41", name: "Computer Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹1,45,000", seats: 150, eligibility: "10+2 PCM min 50% + MHT-CET / JEE Main" },
      { id: "c42", name: "Electronics & Telecommunication", degree: "B.Tech", duration: "4 Years", annualFee: "₹1,45,000", seats: 120, eligibility: "10+2 PCM min 50% + MHT-CET / JEE Main" },
      { id: "c43", name: "Mechanical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹1,40,000", seats: 150, eligibility: "10+2 PCM min 45% + MHT-CET / JEE Main" }
    ],
    address: "Wellesley Road, Shivajinagar, Pune, Maharashtra 411005",
    phone: "+91 20 2550 7000",
    email: "admissions@coeptech.ac.in",
    website: "https://coep.org.in",
    facilities: [
      { id: "f41", name: "Heritage Library", iconName: "history_edu", description: "Historic archive of rare engineering blueprints and digital journals" },
      { id: "f42", name: "Param Supercomputing Node", iconName: "memory", description: "High-performance computational infrastructure for AI simulations" },
      { id: "f43", name: "COEP Boating Club", iconName: "kayaking", description: "Historic Mula river rowing and regatta facility dating back to 1928" }
    ],
    admissionInfo: {
      process: "MHT-CET (Maharashtra Common Entrance Test) and All India JEE Main rank counseling under DTE Maharashtra CAP rounds.",
      entranceExams: ["MHT-CET", "JEE Main"],
      cutoffPercentile: "99.2+ percentile for Computer Engineering",
      applicationDeadline: "June 25, 2025",
      eligibilityCriteria: "Passed 10+2 with Physics, Mathematics along with Chemistry/Biology with minimum 50% marks.",
      managementQuotaDetails: "Autonomous Institutional round allocations following state government directives."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹13.5 LPA",
      highest: "₹50.5 LPA",
      topRecruiters: ["Tata Motors", "Mercedes-Benz", "Mastercard", "Goldman Sachs", "NVIDIA"]
    },
    campusArea: "38 Acres",
    studentFacultyRatio: "14:1"
  },
  {
    id: "col-5",
    name: "PSG College of Technology",
    shortName: "PSG Tech",
    slug: "psg-college-of-technology",
    logo: "PS",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    city: "Coimbatore",
    state: "Tamil Nadu",
    distance: 45,
    managementTypes: ["General Management"],
    rating: 4.7,
    reviewsCount: 1340,
    nirfRank: 63,
    estYear: 1951,
    accreditation: "NAAC A++",
    shortDescription: "Industry-integrated premier institution celebrated for research partnerships, patent filings, and exceptional mechanical & software engineering.",
    fullDescription: "PSG College of Technology is a government-aided autonomous institution in Coimbatore. It was established in 1951 by the PSG & Sons' Charities Trust. The unique feature of PSG Tech is its close integration with in-house heavy manufacturing industries and commercial industrial units.",
    highlights: [
      "Unique Industrial Collaboration & In-House Heavy Production Units",
      "Over 120+ Patents Registered by Student & Faculty Teams",
      "Top NIRF Ranking among Tamil Nadu Autonomous Engineering Colleges",
      "Distinguished Global Alumni in Fortune 500 Leadership"
    ],
    stream: "Engineering",
    courses: [
      { id: "c51", name: "Computer Science & Engineering", degree: "B.E.", duration: "4 Years", annualFee: "₹1,80,000", seats: 120, eligibility: "10+2 PCM min 50% + TNEA / Institutional Counseling" },
      { id: "c52", name: "Robotics & Automation", degree: "B.E.", duration: "4 Years", annualFee: "₹2,10,000", seats: 60, eligibility: "10+2 PCM min 50% + TNEA" },
      { id: "c53", name: "Mechanical Engineering (Sandwich)", degree: "B.E.", duration: "5 Years", annualFee: "₹1,60,000", seats: 90, eligibility: "10+2 PCM min 50% + TNEA" }
    ],
    address: "Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004",
    phone: "+91 422 257 2177",
    email: "admissions@psgtech.edu",
    website: "https://psgtech.edu",
    facilities: [
      { id: "f51", name: "Industry Collaborative Labs", iconName: "factory", description: "Heavy machinery and automated assembly training units" },
      { id: "f52", name: "GRD Central Tech Library", iconName: "local_library", description: "Multilevel research library with 2.5 lakh books" },
      { id: "f53", name: "Indoor Sports Complex", iconName: "sports_tennis", description: "Badminton, table tennis, gymnastics and squash arenas" }
    ],
    admissionInfo: {
      process: "TNEA (Tamil Nadu Engineering Admissions) single window counseling and General Management institutional quota.",
      entranceExams: ["TNEA", "JEE Main", "Institutional Merit"],
      cutoffPercentile: "TNEA Cutoff 197.5/200 for CSE",
      applicationDeadline: "June 20, 2025",
      eligibilityCriteria: "Passed 10+2 with minimum 50% marks in Physics, Chemistry, and Mathematics.",
      managementQuotaDetails: "Merit-based institutional admissions for General Management quota."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹10.5 LPA",
      highest: "₹42.0 LPA",
      topRecruiters: ["Caterpillar", "Qualcomm", "Siemens", "TCS Digital", "Zoho", "L&T"]
    },
    campusArea: "45 Acres",
    studentFacultyRatio: "13:1"
  },
  {
    id: "col-6",
    name: "Vellore Institute of Technology (VIT)",
    shortName: "VIT Vellore",
    slug: "vellore-institute-of-technology",
    logo: "VI",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=80",
    city: "Vellore",
    state: "Tamil Nadu",
    distance: 85,
    managementTypes: ["NRI", "General Management"],
    rating: 4.6,
    reviewsCount: 3400,
    nirfRank: 11,
    estYear: 1984,
    accreditation: "NAAC A++",
    shortDescription: "A truly global campus hosting students from 50+ countries with advanced modular credit systems and intensive international tie-ups.",
    fullDescription: "VIT Vellore is one of India's top-ranked deemed-to-be universities. Established in 1984, the university follows the Flexible Credit System (FFCS) allowing students to design their own timetable and electives with 350+ international university collaborations.",
    highlights: [
      "NIRF #11 Ranked University in India",
      "Limca Book of Records for Highest Number of Campus Placements",
      "Flexible Choice Based Credit System (FFCS)",
      "Global Semester Abroad Programs (SAP) with MIT, Stanford & Oxford"
    ],
    stream: "Engineering",
    courses: [
      { id: "c61", name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹4,20,000", seats: 1200, eligibility: "10+2 PCM min 60% + VITEEE / NRI Quota" },
      { id: "c62", name: "AI & Machine Learning", degree: "B.Tech", duration: "4 Years", annualFee: "₹4,50,000", seats: 300, eligibility: "10+2 PCM min 60% + VITEEE" },
      { id: "c63", name: "Biotechnology Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,50,000", seats: 180, eligibility: "10+2 PCB/PCM min 60% + VITEEE" }
    ],
    address: "VIT, Katpadi, Vellore, Tamil Nadu 632014",
    phone: "+91 416 220 2020",
    email: "nriadmission@vit.ac.in",
    website: "https://vit.ac.in",
    facilities: [
      { id: "f61", name: "Smart Digital Classrooms", iconName: "co_present", description: "Interactive audio-visual smart amphitheaters" },
      { id: "f62", name: "24/7 Digital Library", iconName: "local_library", description: "Peragallo Central Library spanning 6 floors" },
      { id: "f63", name: "Multi-Cuisine Hostels", iconName: "restaurant", description: "North Indian, South Indian, Continental and Asian dietary options" }
    ],
    admissionInfo: {
      process: "VITEEE (VIT Engineering Entrance Exam) counseling rank allotment and direct NRI / Foreign National admissions.",
      entranceExams: ["VITEEE", "SAT", "Direct NRI Quota"],
      cutoffPercentile: "VITEEE Rank under 7,500 for Category 1 CSE",
      applicationDeadline: "April 30, 2025",
      eligibilityCriteria: "Passed 10+2 with 60% aggregate marks in PCM/PCB.",
      managementQuotaDetails: "Dedicated NRI / Foreign Category seat matrix evaluated through 12th board/SAT scores."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹10.2 LPA",
      highest: "₹1.02 Crore",
      topRecruiters: ["Microsoft", "Intel", "AppDynamics", "Motorq", "DE Shaw"]
    },
    campusArea: "372 Acres",
    studentFacultyRatio: "15:1"
  },
  {
    id: "col-7",
    name: "International Institute of Information Technology (IIIT-H)",
    shortName: "IIIT Hyderabad",
    slug: "iiit-hyderabad",
    logo: "II",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    city: "Hyderabad",
    state: "Telangana",
    distance: 22,
    managementTypes: ["General Management"],
    rating: 4.9,
    reviewsCount: 1890,
    nirfRank: 55,
    estYear: 1998,
    accreditation: "NAAC A++",
    shortDescription: "Premier research-led university at the cutting edge of Computer Science, NLP, and Artificial Intelligence with highest tier placement records.",
    fullDescription: "IIIT Hyderabad is an autonomous research university established in 1998 under a not-for-profit Public Private Partnership (PPP). It has evolved into India's foremost research powerhouse in Computer Vision, Natural Language Processing, Robotics, and Cognitive Science.",
    highlights: [
      "World-Renowned Kohli Center on Intelligent Systems (KCIS)",
      "India's Highest Placement Averages for Undergraduate Batches",
      "World Finalist teams in ACM-ICPC Competitive Programming for 15+ years",
      "Over 100+ Research Papers in Top-Tier A* Conferences Annually"
    ],
    stream: "Engineering",
    courses: [
      { id: "c71", name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹4,00,000", seats: 150, eligibility: "10+2 PCM + JEE Main / UGEE / Olympiad" },
      { id: "c72", name: "Electronics & Communication", degree: "B.Tech", duration: "4 Years", annualFee: "₹4,00,000", seats: 90, eligibility: "10+2 PCM + JEE Main / UGEE" },
      { id: "c73", name: "Dual Degree (B.Tech + M.S. in CSE)", degree: "Dual Degree", duration: "5 Years", annualFee: "₹3,80,000", seats: 60, eligibility: "10+2 PCM + UGEE Examination" }
    ],
    address: "Gachibowli, Hyderabad, Telangana 500032",
    phone: "+91 40 6653 1000",
    email: "ugadmissions@iiit.ac.in",
    website: "https://iiit.ac.in",
    facilities: [
      { id: "f71", name: "Kohli Center on AI", iconName: "psychology", description: "Premier AI and Machine Learning research laboratory in South Asia" },
      { id: "f72", name: "CIE Startup Incubator", iconName: "rocket_launch", description: "One of India's largest academic technology incubators" },
      { id: "f73", name: "Fiber Gigabit Backbone", iconName: "wifi", description: "10 Gbps dedicated research network connecting all dorms and labs" }
    ],
    admissionInfo: {
      process: "Undergraduate admissions via JEE Main CRL rank, UGEE (Undergraduate Engineering Entrance), Olympiads and SPEC channel.",
      entranceExams: ["JEE Main", "UGEE", "Direct Olympiad"],
      cutoffPercentile: "JEE Main 99.85+ percentile for CSE",
      applicationDeadline: "May 10, 2025",
      eligibilityCriteria: "Class 12 or equivalent with Physics, Chemistry, and Mathematics.",
      managementQuotaDetails: "No commercial management quota; transparent DASA NRI and Olympiad admissions only."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹32.0 LPA",
      highest: "₹1.15 Crore",
      topRecruiters: ["Google", "Meta", "Apple", "Uber", "Tower Research", "Jane Street"]
    },
    campusArea: "66 Acres",
    studentFacultyRatio: "11:1"
  },
  {
    id: "col-8",
    name: "Delhi Technological University (DTU)",
    shortName: "DTU Delhi",
    slug: "delhi-technological-university",
    logo: "DT",
    image: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=1200&q=80",
    city: "New Delhi",
    state: "Delhi",
    distance: 15,
    managementTypes: ["General Management"],
    rating: 4.8,
    reviewsCount: 2800,
    nirfRank: 29,
    estYear: 1941,
    accreditation: "NAAC A",
    shortDescription: "Formerly Delhi College of Engineering (DCE), an institutional titan in national technology education with unmatched entrepreneurial ecosystem.",
    fullDescription: "Delhi Technological University (DTU), formerly known as Delhi College of Engineering (DCE), is a premier public university located in New Delhi. Established in 1941, DTU has pioneered engineering education producing founders of Unicorns, global CEOs, and top researchers.",
    highlights: [
      "80+ Years of Historic Engineering Eminence",
      "Home to DCE/DTU Alumni Network of 60,000+ Engineers",
      "Over 450+ Companies Recruited on Campus in 2024",
      "State-of-the-Art Innovation & Prototyping Hub"
    ],
    stream: "Engineering",
    courses: [
      { id: "c81", name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹2,25,000", seats: 480, eligibility: "10+2 PCM + JEE Main rank via JAC Delhi" },
      { id: "c82", name: "Software Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹2,25,000", seats: 180, eligibility: "10+2 PCM + JEE Main" },
      { id: "c83", name: "Mathematics & Computing", degree: "B.Tech", duration: "4 Years", annualFee: "₹2,25,000", seats: 180, eligibility: "10+2 PCM + JEE Main" }
    ],
    address: "Shahbad Daulatpur, Bawana Road, Delhi 110042",
    phone: "+91 11 2787 1018",
    email: "academic@dtu.ac.in",
    website: "https://dtu.ac.in",
    facilities: [
      { id: "f81", name: "DTU Innovation Hub", iconName: "lightbulb", description: "Design workshop with 3D printers, CNC laser cutters, and electronics benches" },
      { id: "f82", name: "Central Library Complex", iconName: "local_library", description: "Automated RFID library with 3 lakh physical and digital books" },
      { id: "f83", name: "Olympic Synthetic Track", iconName: "sports_score", description: "Full-sized athletic track, floodlit football arena, and gymnasium" }
    ],
    admissionInfo: {
      process: "Joint Admission Counseling (JAC Delhi) based on JEE Main All India CRL rankings.",
      entranceExams: ["JEE Main", "DASA Scheme"],
      cutoffPercentile: "JEE Main 99.1+ percentile for Delhi Region CSE",
      applicationDeadline: "June 28, 2025",
      eligibilityCriteria: "Passed 10+2 with 60% aggregate in Physics, Chemistry, and Mathematics.",
      managementQuotaDetails: "Public university governed under Delhi State JAC allocation quotas."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹16.5 LPA",
      highest: "₹82.5 LPA",
      topRecruiters: ["Microsoft", "Google", "Amazon", "Bain & Co", "Atlassian", "Samsung R&D"]
    },
    campusArea: "164 Acres",
    studentFacultyRatio: "14:1"
  },
  {
    id: "col-9",
    name: "National Institute of Technology Calicut (NITC)",
    shortName: "NIT Calicut",
    slug: "nit-calicut",
    logo: "NC",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
    city: "Kozhikode",
    state: "Kerala",
    distance: 110,
    managementTypes: ["General Management"],
    rating: 4.8,
    reviewsCount: 1650,
    nirfRank: 23,
    estYear: 1961,
    accreditation: "NIRF Top 25",
    shortDescription: "An Institute of National Importance cradled in scenic Western Ghats, renowned for top tier research, academic rigour, and placements.",
    fullDescription: "National Institute of Technology Calicut is an autonomous technical university of National Importance in Kerala. Set against the scenic backdrop of the Western Ghats foothills, NITC offers comprehensive engineering, architecture, and technology degrees.",
    highlights: [
      "Institute of National Importance (INI) Status",
      "NIRF #23 in Engineering Rankings",
      "Pioneering Renewable Energy & Microelectronics Research Centers",
      "100% Resident Student & Faculty Community"
    ],
    stream: "Engineering",
    courses: [
      { id: "c91", name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹1,75,000", seats: 180, eligibility: "10+2 PCM + JEE Main rank via JoSAA / CSAB" },
      { id: "c92", name: "Electrical & Electronics", degree: "B.Tech", duration: "4 Years", annualFee: "₹1,75,000", seats: 150, eligibility: "10+2 PCM + JEE Main" },
      { id: "c93", name: "Chemical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹1,75,000", seats: 110, eligibility: "10+2 PCM + JEE Main" }
    ],
    address: "NIT Campus P.O, Kozhikode, Kerala 673601",
    phone: "+91 495 228 6100",
    email: "director@nitc.ac.in",
    website: "https://nitc.ac.in",
    facilities: [
      { id: "f91", name: "Nalanda Digital Library", iconName: "menu_book", description: "State-of-the-art open-access digital learning resource center" },
      { id: "f92", name: "Microelectronics Cleanroom", iconName: "biotech", description: "Semiconductor fabrication and nanotech cleanroom laboratory" },
      { id: "f93", name: "Campus Swimming Complex", iconName: "pool", description: "Olympic standard swimming pool and gymnasium" }
    ],
    admissionInfo: {
      process: "JoSAA / CSAB National Level Counseling based on All India JEE Main rank. DASA scheme for foreign/NRI nationals.",
      entranceExams: ["JEE Main", "DASA Scheme"],
      cutoffPercentile: "JEE Main 99.3+ percentile for CSE (All India Quota)",
      applicationDeadline: "June 25, 2025",
      eligibilityCriteria: "Class 12 with Physics, Mathematics and Chemistry/Biology/Tech Vocational subject.",
      managementQuotaDetails: "Central government statutory admission allocation via JoSAA/CSAB."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹14.8 LPA",
      highest: "₹50.0 LPA",
      topRecruiters: ["Cisco", "Oracle", "Qualcomm", "Texas Instruments", "ExxonMobil"]
    },
    campusArea: "290 Acres",
    studentFacultyRatio: "12:1"
  },
  {
    id: "col-10",
    name: "Symbiosis Global Engineering Institute",
    shortName: "SIT Pune",
    slug: "symbiosis-engineering-institute",
    logo: "SY",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    city: "Pune",
    state: "Maharashtra",
    distance: 28,
    managementTypes: ["NRI", "General Management"],
    rating: 4.5,
    reviewsCount: 870,
    nirfRank: 95,
    estYear: 2008,
    accreditation: "NAAC A++",
    shortDescription: "Multidisciplinary global technical school offering specialized degrees in Autonomous Systems, Industry 4.0, and Applied Artificial Intelligence.",
    fullDescription: "Symbiosis Institute of Technology (SIT) is a constituent of Symbiosis International (Deemed University). SIT offers international learning pedagogy, global faculty exchanges, and extensive project-based industry collaboration.",
    highlights: [
      "Global Semester Exchange with Universities in USA, Germany & Japan",
      "Interdisciplinary Minors in FinTech, AI, and Robotics",
      "Executive NRI & International Student Mentorship Wing",
      "Picturesque Lavale Hilltop Eco-Campus in Pune"
    ],
    stream: "Engineering",
    courses: [
      { id: "c101", name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,40,000", seats: 180, eligibility: "10+2 PCM min 50% + SITEEE / JEE Main / NRI" },
      { id: "c102", name: "AI & Machine Learning", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,60,000", seats: 120, eligibility: "10+2 PCM min 50% + SITEEE" },
      { id: "c103", name: "Robotics & Automation", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,10,000", seats: 60, eligibility: "10+2 PCM min 50% + SITEEE" }
    ],
    address: "Near Lupin Research Park, Gram: Lavale, Tal: Mulshi, Pune, Maharashtra 412115",
    phone: "+91 20 2811 6300",
    email: "admissions@sitpune.edu.in",
    website: "https://sitpune.edu.in",
    facilities: [
      { id: "f101", name: "Maker Space & FabLab", iconName: "hardware", description: "Design prototyping with high-precision rapid manufacturing equipment" },
      { id: "f102", name: "Global Resource Library", iconName: "local_library", description: "Subscription to IEEE, ACM, Springer and Scopus databases" },
      { id: "f103", name: "Executive Residence Halls", iconName: "hotel", description: "Modern hilltop student apartments with high-speed internet" }
    ],
    admissionInfo: {
      process: "SITEEE Exam / JEE Main / MHT-CET and Direct International / NRI Student Quota for 2025 Admissions.",
      entranceExams: ["SITEEE", "JEE Main", "MHT-CET", "Direct NRI Merit"],
      cutoffPercentile: "SITEEE Score 85+ marks out of 120",
      applicationDeadline: "May 20, 2025",
      eligibilityCriteria: "Passed 10+2 with minimum 50% marks (45% for reserved categories).",
      managementQuotaDetails: "Transparent NRI seat quota and General Management institutional rounds."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹10.8 LPA",
      highest: "₹45.0 LPA",
      topRecruiters: ["Microsoft", "Dell Technologies", "IBM", "Persistent Systems", "Symantec"]
    },
    campusArea: "350 Acres",
    studentFacultyRatio: "14:1"
  },
  {
    id: "col-11",
    name: "Christ University Faculty of Engineering",
    shortName: "Christ University",
    slug: "christ-university-bangalore",
    logo: "CU",
    image: "https://images.unsplash.com/photo-1576495199011-ef9030c2c98c?auto=format&fit=crop&w=1200&q=80",
    city: "Bengaluru",
    state: "Karnataka",
    distance: 24,
    managementTypes: ["General Management", "NRI"],
    rating: 4.7,
    reviewsCount: 1540,
    nirfRank: 60,
    estYear: 1969,
    accreditation: "NAAC A+",
    shortDescription: "Celebrated deemed university known for holistic academic rigor, global student exchange, and ethical leadership development.",
    fullDescription: "Christ (Deemed to be University) Kengeri Campus in Bangalore hosts the Faculty of Engineering. With verdant 78-acre eco-friendly campus grounds, it delivers experiential technical education infused with service learning and industry incubation.",
    highlights: [
      "QS Asia Top Ranked Deemed University",
      "Strong Global Alumni in Fortune 500 leadership",
      "Dedicated NRI / International Admissions Cell",
      "Expansive 78-Acre Green Kengeri Campus"
    ],
    stream: "Engineering",
    courses: [
      { id: "c111", name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,10,000", seats: 240, eligibility: "10+2 PCM min 50% + Christ Entrance Test (CUET) / NRI" },
      { id: "c112", name: "AI & Machine Learning", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,30,000", seats: 120, eligibility: "10+2 PCM min 50% + CUET" },
      { id: "c113", name: "Automobile Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹2,40,000", seats: 60, eligibility: "10+2 PCM min 50% + CUET" }
    ],
    address: "Kumbalgodu, Mysore Road, Kengeri, Bengaluru, Karnataka 560074",
    phone: "+91 80 4012 9600",
    email: "admissions.engg@christuniversity.in",
    website: "https://christuniversity.in",
    facilities: [
      { id: "f111", name: "Center for Digital Innovation", iconName: "terminal", description: "Collaborative computing labs with NVIDIA GPUs" },
      { id: "f112", name: "Auditorium & Amphitheater", iconName: "theater_comedy", description: "2,500 seater acoustic performance center" },
      { id: "f113", name: "Sports Complex", iconName: "sports_basketball", description: "Floodlit synthetic basketball courts and football stadium" }
    ],
    admissionInfo: {
      process: "Christ University Entrance Test (CUET) followed by Skill Assessment, Micro Presentation, and Personal Interview. NRI direct quota available.",
      entranceExams: ["CUET", "COMEDK-UGET", "JEE Main", "Direct NRI Merit"],
      cutoffPercentile: "Qualifying exam min 50% aggregate + CUET score",
      applicationDeadline: "May 15, 2025",
      eligibilityCriteria: "Passed 10+2 with Physics and Mathematics along with Chemistry/Biotech.",
      managementQuotaDetails: "Admissions processed through institutional selection and NRI merit evaluation."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹9.2 LPA",
      highest: "₹38.5 LPA",
      topRecruiters: ["Deloitte", "KPMG", "EY", "Infosys", "Mercedes-Benz", "Bosch"]
    },
    campusArea: "78 Acres",
    studentFacultyRatio: "15:1"
  },
  {
    id: "col-12",
    name: "Manipal Institute of Technology (MIT)",
    shortName: "MIT Manipal",
    slug: "manipal-institute-of-technology",
    logo: "MI",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    city: "Manipal",
    state: "Karnataka",
    distance: 120,
    managementTypes: ["NRI", "General Management"],
    rating: 4.8,
    reviewsCount: 2900,
    nirfRank: 51,
    estYear: 1957,
    accreditation: "NAAC A++",
    shortDescription: "Pioneering private technology institute renowned for innovation hubs, international student body, and outstanding tech placements.",
    fullDescription: "Manipal Institute of Technology (MIT), established in 1957, is the flagship constituent institute of Manipal Academy of Higher Education (MAHE) — an Institution of Eminence (IoE). Renowned alumni include Satya Nadella (CEO, Microsoft) and Rajeev Suri (former CEO, Nokia).",
    highlights: [
      "Institution of Eminence (IoE) Deemed Status",
      "Alma Mater of Satya Nadella (Microsoft CEO)",
      "Dedicated Center for Innovation & Entrepreneurship",
      "Over 300+ Top Global Recruiters Visiting Yearly"
    ],
    stream: "Engineering",
    courses: [
      { id: "c121", name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹4,80,000", seats: 240, eligibility: "10+2 PCM min 50% + MET / NRI Quota" },
      { id: "c122", name: "Data Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹4,90,000", seats: 120, eligibility: "10+2 PCM min 50% + MET" },
      { id: "c123", name: "Aeronautical Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,90,000", seats: 60, eligibility: "10+2 PCM min 50% + MET" }
    ],
    address: "Udupi Karkala Road, Eshwar Nagar, Manipal, Karnataka 576104",
    phone: "+91 92437 77733",
    email: "admissions@manipal.edu",
    website: "https://manipal.edu/mit.html",
    facilities: [
      { id: "f121", name: "MAHE Innovation Center", iconName: "lightbulb", description: "Multi-crore prototyping lab with student incubation funds" },
      { id: "f122", name: "Marena Sports Arena", iconName: "sports", description: "Air-conditioned 6-level sports complex with indoor track" },
      { id: "f123", name: "International Residence Halls", iconName: "hotel", description: "Modern AC single/double rooms with high-speed Wi-Fi" }
    ],
    admissionInfo: {
      process: "Manipal Entrance Test (MET) merit counseling and dedicated DASA / NRI Quota direct admission stream.",
      entranceExams: ["MET", "Direct NRI / Foreign National"],
      cutoffPercentile: "MET Rank within top 1,500 for Core CSE",
      applicationDeadline: "May 25, 2025",
      eligibilityCriteria: "Passed 10+2 with Physics, Mathematics and English with minimum 50% marks.",
      managementQuotaDetails: "Dedicated NRI seat matrix evaluated through high school grades and international passport verification."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹13.8 LPA",
      highest: "₹54.7 LPA",
      topRecruiters: ["Microsoft", "Amazon", "BlackRock", "Schneider Electric", "Goldman Sachs"]
    },
    campusArea: "313 Acres",
    studentFacultyRatio: "13:1"
  },
  {
    id: "col-13",
    name: "PES University - Ring Road Campus",
    shortName: "PES University",
    slug: "pes-university-bangalore",
    logo: "PE",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    city: "Bengaluru",
    state: "Karnataka",
    distance: 16,
    managementTypes: ["General Management", "NRI"],
    rating: 4.7,
    reviewsCount: 1780,
    nirfRank: 84,
    estYear: 1972,
    accreditation: "NAAC A",
    shortDescription: "High-ranked private research university leading in software engineering, computing competitions, and competitive compensation packages.",
    fullDescription: "PES University is one of India's leading teaching and research universities. Located in Bengaluru, PES focuses on creating an inspiring learning environment that transforms students into technically adept and socially responsible leaders.",
    highlights: [
      "Ranked #1 in Karnataka by New Indian Express Survey",
      "Over ₹40+ Lakhs Average for Tier-1 Tech Offers",
      "PESSAT National Entrance Test with 150+ Exam Centers",
      "State-of-the-Art Research Labs in Quantum Computing & AI"
    ],
    stream: "Engineering",
    courses: [
      { id: "c131", name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹4,20,000", seats: 480, eligibility: "10+2 PCM min 50% + PESSAT / KCET / NRI" },
      { id: "c132", name: "AI & Machine Learning", degree: "B.Tech", duration: "4 Years", annualFee: "₹4,40,000", seats: 180, eligibility: "10+2 PCM min 50% + PESSAT" },
      { id: "c133", name: "Electronics & Communication", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,60,000", seats: 180, eligibility: "10+2 PCM min 50% + PESSAT" }
    ],
    address: "100 Feet Ring Road, Banashankari 3rd Stage, Bengaluru, Karnataka 560085",
    phone: "+91 80 2672 1983",
    email: "admissions@pes.edu",
    website: "https://pes.edu",
    facilities: [
      { id: "f131", name: "Quantum Tech Lab", iconName: "computer", description: "Next-generation quantum simulation and algorithm testbeds" },
      { id: "f132", name: "Prof. CNR Rao Research Center", iconName: "science", description: "Advanced nanotechnology and material science testing" },
      { id: "f133", name: "High-Tech Smart Hostels", iconName: "apartment", description: "Secured biometrically access-controlled residences" }
    ],
    admissionInfo: {
      process: "PESSAT (PES Scholastic Aptitude Test), KCET counseling, and Direct Management / NRI quota rounds.",
      entranceExams: ["PESSAT", "KCET", "JEE Main", "Direct NRI"],
      cutoffPercentile: "PESSAT Rank under 800 for RR Campus CSE",
      applicationDeadline: "May 31, 2025",
      eligibilityCriteria: "Passed 10+2 with minimum 50% marks in Physics and Mathematics.",
      managementQuotaDetails: "Institutional and NRI quota admissions evaluated through merit counseling."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹14.0 LPA",
      highest: "₹65.0 LPA",
      topRecruiters: ["Microsoft", "Amazon", "Akamai", "Cisco", "Intuit", "Walmart Labs"]
    },
    campusArea: "30 Acres",
    studentFacultyRatio: "14:1"
  },
  {
    id: "col-14",
    name: "BITS Pilani - International & NRI Programs",
    shortName: "BITS Pilani",
    slug: "bits-pilani-nri",
    logo: "BP",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
    city: "Pilani",
    state: "Rajasthan",
    distance: 140,
    managementTypes: ["NRI"],
    rating: 4.9,
    reviewsCount: 3800,
    nirfRank: 20,
    estYear: 1964,
    accreditation: "NAAC A++",
    shortDescription: "Institution of Eminence featuring zero attendance mandate, stellar startup culture, and designated international admissions channel.",
    fullDescription: "Birla Institute of Technology and Science (BITS), Pilani is an all-India Institute for higher education declared as an Institution of Eminence. BITS Pilani offers its designated International Student Admission (ISA) scheme for candidates with international citizenship or NRI background.",
    highlights: [
      "Institution of Eminence (IoE) by Govt. of India",
      "Zero Mandatory Attendance Policy Fostering Entrepreneurship",
      "Over 1,000+ Startups Founded by BITSians Worldwide",
      "Designated International Student Admission Scheme (ISA)"
    ],
    stream: "Engineering",
    courses: [
      { id: "c141", name: "Computer Science", degree: "B.E. (Hons)", duration: "4 Years", annualFee: "₹6,20,000", seats: 120, eligibility: "10+2 with PCM min 75% + SAT / ISA Scheme" },
      { id: "c142", name: "Electrical & Electronics", degree: "B.E. (Hons)", duration: "4 Years", annualFee: "₹5,80,000", seats: 90, eligibility: "10+2 with PCM min 75% + SAT" },
      { id: "c143", name: "Mechanical Engineering", degree: "B.E. (Hons)", duration: "4 Years", annualFee: "₹5,20,000", seats: 90, eligibility: "10+2 with PCM min 75% + SAT" }
    ],
    address: "Vidya Vihar, Pilani, Rajasthan 333031",
    phone: "+91 1596 242 205",
    email: "isa@pilani.bits-pilani.ac.in",
    website: "https://bitsadmission.com/international.aspx",
    facilities: [
      { id: "f141", name: "Sandpaper Maker Center", iconName: "construction", description: "Comprehensive electronics and rapid prototyping workspace" },
      { id: "f142", name: "BITS Digital Heritage Library", iconName: "local_library", description: "Vast collection with over 300,000 print and digital titles" },
      { id: "f143", name: "Student Hostels (Bhawans)", iconName: "hotel", description: "Single occupancy rooms with fiber optic internet connectivity" }
    ],
    admissionInfo: {
      process: "International Student Admissions (ISA) mode based on SAT scores (Math Level 2, Physics, Chemistry / Digital SAT) for foreign passport holders / NRI candidates.",
      entranceExams: ["SAT / Digital SAT", "BITSAT"],
      cutoffPercentile: "SAT Score 1350+ out of 1600",
      applicationDeadline: "April 15, 2025",
      eligibilityCriteria: "Passed Grade 12 or equivalent with minimum 75% aggregate in Physics, Chemistry, Mathematics.",
      managementQuotaDetails: "Direct international merit evaluation channel under ISA regulations."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹22.5 LPA",
      highest: "₹95.0 LPA",
      topRecruiters: ["Google", "Microsoft", "Uber", "Apple", "D.E. Shaw", "Rubrik"]
    },
    campusArea: "328 Acres",
    studentFacultyRatio: "12:1"
  },
  {
    id: "col-15",
    name: "Amrita Vishwa Vidyapeetham",
    shortName: "Amrita University",
    slug: "amrita-vishwa-vidyapeetham",
    logo: "AV",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    city: "Coimbatore",
    state: "Tamil Nadu",
    distance: 52,
    managementTypes: ["General Management", "NRI"],
    rating: 4.8,
    reviewsCount: 1950,
    nirfRank: 7,
    estYear: 2003,
    accreditation: "NAAC A++",
    shortDescription: "Multidisciplinary research institution ranked #7 overall in India by NIRF with prominent cyber security and humanitarian tech initiatives.",
    fullDescription: "Amrita Vishwa Vidyapeetham is a multi-campus, multi-disciplinary research institution accredited with highest NAAC A++ grade. NIRF 2024 ranked Amrita 7th best university in India. Amrita focuses on value-based education and research for societal empowerment.",
    highlights: [
      "NIRF #7 Ranked University in India",
      "UNESCO Chair on Experiential Learning for Sustainable Innovation",
      "Cyber Security (TIFAC-CORE) Center of Excellence",
      "Dual Degree Programs with Top 100 Global Universities"
    ],
    stream: "Engineering",
    courses: [
      { id: "c151", name: "Computer Science & Engineering", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,50,000", seats: 360, eligibility: "10+2 PCM min 55% + AEEE / JEE Main / NRI" },
      { id: "c152", name: "Cyber Security & Forensics", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,80,000", seats: 120, eligibility: "10+2 PCM min 55% + AEEE" },
      { id: "c153", name: "AI & Robotics", degree: "B.Tech", duration: "4 Years", annualFee: "₹3,60,000", seats: 120, eligibility: "10+2 PCM min 55% + AEEE" }
    ],
    address: "Amritanagar, Ettimadai, Coimbatore, Tamil Nadu 641112",
    phone: "+91 422 268 5000",
    email: "admissions@amrita.edu",
    website: "https://amrita.edu",
    facilities: [
      { id: "f151", name: "Cyber Security Threat Lab", iconName: "security", description: "Real-time threat monitoring and digital forensics sandbox" },
      { id: "f152", name: "Central Research Library", iconName: "local_library", description: "Extensive collections with open research repositories" },
      { id: "f153", name: "Ayurvedic & Modern Hospital", iconName: "local_hospital", description: "24/7 on-campus multi-specialty healthcare center" }
    ],
    admissionInfo: {
      process: "Amrita Engineering Entrance Examination (AEEE), JEE Main CRL ranks, and NRI direct admissions.",
      entranceExams: ["AEEE", "JEE Main", "Direct NRI Quota"],
      cutoffPercentile: "AEEE Rank within top 2,500 for Coimbatore CSE",
      applicationDeadline: "May 18, 2025",
      eligibilityCriteria: "Passed 10+2 with minimum 55% in Physics, Chemistry, and Mathematics.",
      managementQuotaDetails: "Transparent NRI seat quota with direct scholarship evaluation."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹11.2 LPA",
      highest: "₹56.9 LPA",
      topRecruiters: ["Microsoft", "Cisco", "Bosch", "Amazon", "Honeywell", "Intel"]
    },
    campusArea: "400 Acres",
    studentFacultyRatio: "11:1"
  },
  {
    id: "col-16",
    name: "Thapar Institute of Engineering & Technology",
    shortName: "TIET Patiala",
    slug: "thapar-institute-of-engineering",
    logo: "TH",
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1200&q=80",
    city: "Patiala",
    state: "Punjab",
    distance: 95,
    managementTypes: ["General Management", "NRI"],
    rating: 4.6,
    reviewsCount: 1620,
    nirfRank: 22,
    estYear: 1956,
    accreditation: "NAAC A+",
    shortDescription: "High ranking deemed technical university with academic partnership with Trinity College Dublin and vibrant campus culture.",
    fullDescription: "Thapar Institute of Engineering and Technology (TIET), established in 1956, is one of India's oldest and finest private deemed universities. It has a prestigious contemporary partnership with Trinity College Dublin (TCD), Ireland for credit transfers and joint research.",
    highlights: [
      "Contemporization Partnership with Trinity College Dublin",
      "Over 90% Placements across 350+ Global Recruiters",
      "Expansive 250-Acre State-of-the-Art Residential Campus",
      "Dedicated Venture Lab and Incubator for Student Startups"
    ],
    stream: "Engineering",
    courses: [
      { id: "c161", name: "Computer Engineering", degree: "B.E.", duration: "4 Years", annualFee: "₹4,60,000", seats: 360, eligibility: "10+2 PCM min 60% + JEE Main / Class 12 Board Score" },
      { id: "c162", name: "Computer Science & Business Systems", degree: "B.E.", duration: "4 Years", annualFee: "₹4,70,000", seats: 120, eligibility: "10+2 PCM min 60% + JEE Main" },
      { id: "c163", name: "Electronics & Computer Engineering", degree: "B.E.", duration: "4 Years", annualFee: "₹4,10,000", seats: 180, eligibility: "10+2 PCM min 60% + JEE Main" }
    ],
    address: "Bhadson Road, Patiala, Punjab 147004",
    phone: "+91 175 239 3021",
    email: "admissions@thapar.edu",
    website: "https://thapar.edu",
    facilities: [
      { id: "f161", name: "Nava Nalanda Central Library", iconName: "local_library", description: "Iconic architectural masterpiece with 2.5 lakh books" },
      { id: "f162", name: "Venture Lab & Maker Space", iconName: "rocket_launch", description: "Design thinking studio with funding support for startups" },
      { id: "f163", name: "Sports Complexes & Pools", iconName: "pool", description: "Olympic standard athletic tracks, indoor badminton, and pools" }
    ],
    admissionInfo: {
      process: "Dual Mode admissions via JEE Main score and Class 12 PCM Board marks. Dedicated NRI quota seats available.",
      entranceExams: ["JEE Main", "12th Board Merit", "Direct NRI Quota"],
      cutoffPercentile: "JEE Main 95+ percentile or 92%+ in 10+2 PCM for Computer Engineering",
      applicationDeadline: "May 30, 2025",
      eligibilityCriteria: "Passed 10+2 with minimum 60% aggregate in Physics, Chemistry, and Mathematics.",
      managementQuotaDetails: "Direct institutional quota and NRI sponsored allocation according to TIET guidelines."
    },
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    ],
    packageStats: {
      average: "₹12.1 LPA",
      highest: "₹55.7 LPA",
      topRecruiters: ["Microsoft", "DE Shaw", "Amazon", "Optum", "Zomato", "JP Morgan"]
    },
    campusArea: "250 Acres",
    studentFacultyRatio: "13:1"
  }
];

export const POPULAR_STATES: StateData[] = [
  {
    name: "Karnataka",
    code: "KA",
    collegeCount: 140,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    popularCities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"]
  },
  {
    name: "Maharashtra",
    code: "MH",
    collegeCount: 115,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    popularCities: ["Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad"]
  },
  {
    name: "Tamil Nadu",
    code: "TN",
    collegeCount: 95,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    popularCities: ["Chennai", "Coimbatore", "Vellore", "Madurai", "Tiruchirappalli"]
  },
  {
    name: "Telangana",
    code: "TS",
    collegeCount: 80,
    image: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80",
    popularCities: ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad"]
  },
  {
    name: "Delhi",
    code: "DL",
    collegeCount: 65,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    popularCities: ["New Delhi", "Noida", "Gurugram", "Faridabad", "Ghaziabad"]
  },
  {
    name: "Kerala",
    code: "KL",
    collegeCount: 45,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    popularCities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"]
  },
  {
    name: "Uttar Pradesh",
    code: "UP",
    collegeCount: 75,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    popularCities: ["Noida", "Lucknow", "Kanpur", "Varanasi", "Ghaziabad"]
  },
  {
    name: "Rajasthan",
    code: "RJ",
    collegeCount: 50,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    popularCities: ["Jaipur", "Pilani", "Jodhpur", "Udaipur", "Kota"]
  }
];
