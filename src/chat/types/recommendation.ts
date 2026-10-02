import type { StudentPreferences } from './preferences';

export interface MatchFactor {
  factor: string;
  score: number; // 0-100
  weight: number; // importance weight
  description: string;
}

export interface TradeOff {
  aspect: string;
  concern: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AdmissionFeasibility {
  isFeasible: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  requiredRank?: number;
  requiredPercentile?: number;
  explanation: string;
  missingData: string[];
}

export interface CollegeRecommendation {
  collegeId: string;
  collegeName: string;
  shortName: string;
  state: string;
  city: string;
  matchScore: number; // 0-100
  matchFactors: MatchFactor[];
  whyMatches: string;
  tradeOffs: TradeOff[];
  admissionFeasibility: AdmissionFeasibility;
  courseName: string;
  annualFee: string;
  nirfRank?: number;
  placementAverage: string;
  placementHighest: string;
  accreditation: string;
  isGovernment: boolean;
  hostelAvailable: boolean;
  researchOutput?: string;
  clinicalExposure?: string; // for medical
  hospitalAttached?: string; // for medical
  seatsAvailable?: number;
  dataDisclaimer: string; // clearly mark if data is mock/demo
}

export interface RecommendationRequest {
  preferences: StudentPreferences;
  maxResults?: number;
}

export interface RecommendationResponse {
  recommendations: CollegeRecommendation[];
  summary: string;
  totalCollegesAnalyzed: number;
  disclaimer: string;
}
