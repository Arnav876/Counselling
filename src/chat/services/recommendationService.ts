import type {
  RecommendationRequest,
  RecommendationResponse,
  CollegeRecommendation,
} from '../types/recommendation';
import type { StudentPreferences } from '../types/preferences';
import { MOCK_COLLEGE_DATA, MOCK_MEDICAL_COLLEGES } from '../data/mockColleges';

/**
 * Recommendation Service Interface
 * This service can be easily replaced with backend API calls later
 */
export interface IRecommendationService {
  getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse>;
}

/**
 * Mock Recommendation Service Implementation
 * Uses local mock data - will be replaced with backend API
 */
export class MockRecommendationService implements IRecommendationService {
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { preferences, maxResults = 5 } = request;
    const colleges =
      preferences.courseType === 'MEDICAL' ? MOCK_MEDICAL_COLLEGES : MOCK_COLLEGE_DATA;

    // Score and filter colleges based on preferences
    const scoredColleges = colleges.map((college) => {
      const score = this.calculateMatchScore(college, preferences);
      const matchFactors = this.generateMatchFactors(college, preferences, score);
      const whyMatches = this.generateWhyMatches(college, preferences);
      const tradeOffs = this.generateTradeOffs(college, preferences);
      const admissionFeasibility = this.generateAdmissionFeasibility(college, preferences);
      
      return { 
        ...college, 
        matchScore: score,
        matchFactors,
        whyMatches,
        tradeOffs,
        admissionFeasibility,
      };
    });

    // Sort by match score and return top results
    const recommendations = scoredColleges
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxResults);

    return {
      recommendations,
      summary: this.generateSummary(recommendations, preferences),
      totalCollegesAnalyzed: colleges.length,
      disclaimer: 'This is a demo recommendation based on mock data. Please verify all information with official college sources before making admission decisions.',
    };
  }

  private calculateMatchScore(college: CollegeRecommendation, preferences: StudentPreferences): number {
    let score = 0;
    const weights = {
      state: 20,
      collegeType: 25,
      budget: 15,
      placement: 20,
      research: 10,
      accreditation: 10,
    };

    // State preference
    if (preferences.locationPreference === 'HOME_STATE' && college.state === preferences.homeState) {
      score += weights.state;
    } else if (preferences.locationPreference === 'SPECIFIC_STATES' && preferences.preferredStates.includes(college.state)) {
      score += weights.state * 0.8;
    } else if (preferences.locationPreference === 'ANY_INDIA') {
      score += weights.state * 0.5;
    }

    // College type preference
    if (preferences.collegeType === 'GOVERNMENT' && college.isGovernment) {
      score += weights.collegeType;
    } else if (preferences.collegeType === 'PRIVATE' && !college.isGovernment) {
      score += weights.collegeType;
    } else if (preferences.collegeType === 'ANY') {
      score += weights.collegeType * 0.7;
    }

    // Budget (simplified check)
    if (preferences.budgetMax && college.annualFee) {
      const feeValue = this.parseFee(college.annualFee);
      if (feeValue <= preferences.budgetMax) {
        score += weights.budget;
      } else {
        score += weights.budget * 0.3;
      }
    } else {
      score += weights.budget * 0.5;
    }

    // Placement importance
    if (preferences.placementImportant) {
      score += weights.placement;
    } else {
      score += weights.placement * 0.5;
    }

    // Research importance
    if (preferences.researchImportant && college.researchOutput) {
      score += weights.research;
    } else if (!preferences.researchImportant) {
      score += weights.research * 0.5;
    }

    // Accreditation
    if (college.accreditation.includes('A++') || college.accreditation.includes('Institute of National Importance')) {
      score += weights.accreditation;
    } else {
      score += weights.accreditation * 0.7;
    }

    // Medical-specific factors
    if (preferences.courseType === 'MEDICAL') {
      if (preferences.clinicalExposureImportant && college.clinicalExposure) {
        score += 15;
      }
      if (preferences.nmcRecognitionRequired && college.accreditation.includes('NMC')) {
        score += 10;
      }
    }

    return Math.min(100, Math.round(score));
  }

  private generateMatchFactors(college: CollegeRecommendation, preferences: StudentPreferences, _score: number) {
    const factors = [];
    
    // State factor
    if (preferences.locationPreference === 'HOME_STATE' && college.state === preferences.homeState) {
      factors.push({
        factor: 'State Preference',
        score: 100,
        weight: 0.2,
        description: `Located in your home state ${preferences.homeState}`,
      });
    } else if (preferences.locationPreference === 'SPECIFIC_STATES' && preferences.preferredStates.includes(college.state)) {
      factors.push({
        factor: 'State Preference',
        score: 80,
        weight: 0.2,
        description: `Located in preferred state ${college.state}`,
      });
    } else {
      factors.push({
        factor: 'Location',
        score: 50,
        weight: 0.1,
        description: `Located in ${college.state}`,
      });
    }

    // College type factor
    if (preferences.collegeType === 'GOVERNMENT' && college.isGovernment) {
      factors.push({
        factor: 'College Type',
        score: 100,
        weight: 0.25,
        description: 'Government college with affordable fees',
      });
    } else if (preferences.collegeType === 'PRIVATE' && !college.isGovernment) {
      factors.push({
        factor: 'College Type',
        score: 100,
        weight: 0.25,
        description: 'Private college as preferred',
      });
    } else {
      factors.push({
        factor: 'College Type',
        score: 70,
        weight: 0.2,
        description: college.isGovernment ? 'Government college' : 'Private college',
      });
    }

    // Placement factor
    if (preferences.placementImportant) {
      factors.push({
        factor: 'Placement',
        score: 95,
        weight: 0.2,
        description: `Strong placement record: ${college.placementAverage} average package`,
      });
    } else {
      factors.push({
        factor: 'Placement',
        score: 70,
        weight: 0.15,
        description: `${college.placementAverage} average package`,
      });
    }

    // Budget factor
    if (preferences.budgetMax && college.annualFee) {
      const feeValue = this.parseFee(college.annualFee);
      if (feeValue <= preferences.budgetMax) {
        factors.push({
          factor: 'Budget',
          score: 100,
          weight: 0.15,
          description: `Fees within your budget: ${college.annualFee}`,
        });
      } else {
        factors.push({
          factor: 'Budget',
          score: 30,
          weight: 0.1,
          description: `Fees above budget: ${college.annualFee}`,
        });
      }
    }

    // Accreditation factor
    factors.push({
      factor: 'Accreditation',
      score: college.accreditation.includes('A++') || college.accreditation.includes('Institute of National Importance') ? 100 : 70,
      weight: 0.15,
      description: college.accreditation,
    });

    return factors;
  }

  private generateWhyMatches(college: CollegeRecommendation, preferences: StudentPreferences): string {
    const reasons = [];
    
    if (preferences.locationPreference === 'HOME_STATE' && college.state === preferences.homeState) {
      reasons.push(`located in your home state ${preferences.homeState}`);
    }
    
    if (preferences.collegeType === 'GOVERNMENT' && college.isGovernment) {
      reasons.push('a government college with affordable fees');
    } else if (preferences.collegeType === 'PRIVATE' && !college.isGovernment) {
      reasons.push('a private college matching your preference');
    }
    
    if (preferences.placementImportant) {
      reasons.push(`strong placement record with ${college.placementAverage} average package`);
    }
    
    if (preferences.researchImportant && college.researchOutput) {
      reasons.push('excellent research opportunities');
    }
    
    if (college.nirfRank) {
      reasons.push(`NIRF rank #${college.nirfRank}`);
    }

    if (reasons.length === 0) {
      reasons.push(`offers ${college.courseName} in ${college.city}`);
    }

    return `${college.collegeName} is ${reasons.join(', ')}. ${college.isGovernment ? 'Government colleges offer affordable education and strong recognition.' : 'This college has established itself in the private sector.'}`;
  }

  private generateTradeOffs(college: CollegeRecommendation, preferences: StudentPreferences) {
    const tradeOffs = [];
    
    if (preferences.locationPreference === 'HOME_STATE' && college.state !== preferences.homeState) {
      tradeOffs.push({
        aspect: 'Location',
        concern: `Not in your home state ${preferences.homeState}`,
        severity: 'LOW' as const,
      });
    }
    
    if (preferences.budgetMax && college.annualFee) {
      const feeValue = this.parseFee(college.annualFee);
      if (feeValue > preferences.budgetMax) {
        tradeOffs.push({
          aspect: 'Fees',
          concern: `Annual fee ${college.annualFee} exceeds your budget`,
          severity: 'MEDIUM' as const,
        });
      }
    }
    
    if (!college.isGovernment) {
      tradeOffs.push({
        aspect: 'Fees',
        concern: 'Higher than government college fees',
        severity: 'MEDIUM' as const,
      });
    }
    
    tradeOffs.push({
      aspect: 'Competition',
      concern: 'High competition for admission',
      severity: 'HIGH' as const,
    });

    return tradeOffs;
  }

  private generateAdmissionFeasibility(college: CollegeRecommendation, preferences: StudentPreferences) {
    const missingData = [];
    
    if (!preferences.rank && !preferences.percentile) {
      missingData.push('Rank/Percentile');
    }
    
    if (!preferences.category) {
      missingData.push('Category');
    }

    let requiredRank;
    let requiredPercentile;
    let explanation;
    let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';

    if (preferences.examType === 'JEE_MAIN' || preferences.examType === 'JEE_ADVANCED') {
      requiredPercentile = college.isGovernment ? 99.0 : 97.0;
      explanation = college.isGovernment 
        ? 'Requires excellent JEE Main rank through JoSAA counseling. Government colleges have high competition.'
        : 'Requires good JEE Main rank or state entrance exam. Management quota may be available.';
      confidence = college.isGovernment ? 'HIGH' : 'MEDIUM';
    } else if (preferences.examType === 'NEET') {
      requiredRank = college.isGovernment ? 5000 : 15000;
      explanation = college.isGovernment
        ? 'Requires strong NEET rank through state counseling. Government seats are highly competitive.'
        : 'NEET rank required. Management quota available at higher cost.';
      confidence = college.isGovernment ? 'HIGH' : 'MEDIUM';
    } else {
      explanation = 'Admission requirements vary by entrance exam. Check official counseling guidelines.';
      confidence = 'LOW';
    }

    return {
      isFeasible: true,
      confidence,
      requiredRank,
      requiredPercentile,
      explanation,
      missingData,
    };
  }

  private parseFee(feeString: string): number {
    // Simple parser for fee strings like "₹3,80,000"
    const match = feeString.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''), 10);
    }
    return 0;
  }

  private generateSummary(recommendations: CollegeRecommendation[], preferences: StudentPreferences): string {
    const count = recommendations.length;
    const topCollege = recommendations[0];
    const courseType = preferences.courseType === 'MEDICAL' ? 'medical' : 'engineering';

    return `Based on your preferences for ${courseType} education, I found ${count} strong matches. ${topCollege.collegeName} has the highest match score at ${topCollege.matchScore}%. All recommendations consider your state preference, budget constraints, and priority factors like ${preferences.placementImportant ? 'placements' : 'academic excellence'}.`;
  }
}

// Export singleton instance
export const recommendationService = new MockRecommendationService();

/**
 * Future: Backend Recommendation Service
 * This will replace the mock service when backend is ready
 */
export class BackendRecommendationService implements IRecommendationService {
  async getRecommendations(_request: RecommendationRequest): Promise<RecommendationResponse> {
    // TODO: Implement backend API call
    // const response = await fetch('/api/recommendations', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(request),
    // });
    // return response.json();
    throw new Error('Backend service not yet implemented');
  }
}
