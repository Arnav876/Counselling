export type ExamType = 'JEE_MAIN' | 'JEE_ADVANCED' | 'NEET' | 'KCET' | 'COMEDK' | 'MHT_CET' | 'TNEA' | 'BITSAT' | 'VITEEE' | 'SRMJEE' | 'WBJEE' | 'OTHER' | 'NONE';

export type CourseType = 'ENGINEERING' | 'MEDICAL' | 'MANAGEMENT' | 'LAW' | 'SCIENCE_ARTS' | 'OTHER';

export type BranchPreference = string; // e.g., 'CSE', 'ECE', 'MECH', 'MBBS', etc.

export type CollegeType = 'GOVERNMENT' | 'PRIVATE' | 'DEEMED' | 'ANY';

export type Category = 'GENERAL' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'OTHER';

export interface StudentPreferences {
  // Exam Information
  examType: ExamType;
  rank?: number;
  percentile?: number;
  category: Category;

  // Course & Branch
  courseType: CourseType;
  preferredBranches: BranchPreference[];

  // Location
  homeState: string;
  preferredStates: string[];
  locationPreference: 'HOME_STATE' | 'ANY_INDIA' | 'SPECIFIC_STATES';

  // College Type
  collegeType: CollegeType;

  // Budget
  budgetMin?: number;
  budgetMax?: number;
  budgetCurrency: 'INR';

  // Facilities & Features
  hostelRequired: boolean;
  placementImportant: boolean;
  researchImportant: boolean;
  nirfRankingImportant: boolean;

  // Medical-specific
  clinicalExposureImportant?: boolean;
  hospitalExposureImportant?: boolean;
  nmcRecognitionRequired?: boolean;

  // Other
  additionalPreferences?: string;
}

export interface PreferenceField {
  key: keyof StudentPreferences;
  label: string;
  type: 'select' | 'multiselect' | 'number' | 'text' | 'boolean';
  options?: { value: string; label: string }[];
  required: boolean;
  dependsOn?: keyof StudentPreferences;
}
