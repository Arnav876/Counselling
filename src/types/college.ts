export type ManagementType = 'General Management' | 'NRI';

export type DistanceFilter = 'all' | '10' | '25' | '50' | '100' | '100+';

export type SortOption = 
  | 'relevance' 
  | 'distance-asc' 
  | 'distance-desc' 
  | 'rating-desc' 
  | 'name-asc';

export interface Course {
  id: string;
  name: string;
  degree: string;
  duration: string;
  annualFee: string;
  seats: number;
  eligibility: string;
}

export interface Facility {
  id: string;
  name: string;
  iconName: string;
  description?: string;
}

export interface AdmissionInfo {
  process: string;
  entranceExams: string[];
  cutoffPercentile: string;
  applicationDeadline: string;
  eligibilityCriteria: string;
  managementQuotaDetails?: string;
}

export interface PackageStats {
  average: string;
  highest: string;
  topRecruiters: string[];
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  logo: string;
  image: string;
  city: string;
  state: string;
  distance: number; // in km
  managementTypes: ManagementType[]; // General Management, NRI, or both
  rating: number;
  reviewsCount: number;
  nirfRank?: number;
  estYear: number;
  accreditation: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  stream: 'Engineering' | 'Medical' | 'Management' | 'Science & Arts' | 'Law';
  courses: Course[];
  address: string;
  phone: string;
  email: string;
  website: string;
  facilities: Facility[];
  admissionInfo: AdmissionInfo;
  gallery: string[];
  packageStats: PackageStats;
  campusArea?: string;
  studentFacultyRatio?: string;
}

export interface FilterState {
  search: string;
  state: string;
  distance: DistanceFilter;
  managementType: ManagementType[];
  stream: string;
}

export interface StateData {
  name: string;
  code: string;
  collegeCount: number;
  image: string;
  popularCities: string[];
}
