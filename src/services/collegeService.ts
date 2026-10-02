import type { College, FilterState, SortOption, StateData } from '../types/college';
import { COLLEGE_DATA, POPULAR_STATES } from '../data/colleges';

export interface EnquiryRequest {
  collegeName: string;
  studentName: string;
  phone: string;
  preferredCourse: string;
  notes?: string;
}

export interface ContactRequest {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredState?: string;
}

export class CollegeService {
  /**
   * Retrieves colleges filtered and sorted. Returns a Promise for seamless Phase 2 backend connectivity.
   */
  async getColleges(filters?: Partial<FilterState>, sort: SortOption = 'relevance'): Promise<College[]> {
    // Simulated async delay to represent real API latency
    await new Promise((resolve) => setTimeout(resolve, 60));

    let result = [...COLLEGE_DATA];

    if (filters) {
      // 1. Search Query
      if (filters.search && filters.search.trim() !== '') {
        const q = filters.search.trim().toLowerCase();
        result = result.filter(
          (col) =>
            col.name.toLowerCase().includes(q) ||
            col.shortName.toLowerCase().includes(q) ||
            col.city.toLowerCase().includes(q) ||
            col.state.toLowerCase().includes(q) ||
            col.courses.some((c) => c.name.toLowerCase().includes(q))
        );
      }

      // 2. State Filter
      if (filters.state && filters.state !== 'ALL' && filters.state !== 'all') {
        const stateQuery = filters.state.toLowerCase();
        result = result.filter((col) => col.state.toLowerCase() === stateQuery);
      }

      // 3. Distance Filter
      if (filters.distance && filters.distance !== 'all') {
        const maxDist = parseInt(filters.distance.replace('+', ''), 10);
        if (filters.distance.includes('+')) {
          result = result.filter((col) => col.distance >= 100);
        } else if (!isNaN(maxDist)) {
          result = result.filter((col) => col.distance <= maxDist);
        }
      }

      // 4. Management Type Filter
      if (filters.managementType && filters.managementType.length > 0) {
        result = result.filter((col) =>
          filters.managementType!.some((type) => col.managementTypes.includes(type))
        );
      }

      // 5. Stream Filter
      if (filters.stream && filters.stream !== 'all' && filters.stream !== 'ALL') {
        result = result.filter((col) => col.stream.toLowerCase() === filters.stream!.toLowerCase());
      }
    }

    // Sorting
    switch (sort) {
      case 'distance-asc':
        result.sort((a, b) => a.distance - b.distance);
        break;
      case 'distance-desc':
        result.sort((a, b) => b.distance - a.distance);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relevance':
      default:
        // Default sorting
        result.sort((a, b) => (b.nirfRank ? 1000 - b.nirfRank : 0) - (a.nirfRank ? 1000 - a.nirfRank : 0));
        break;
    }

    return result;
  }

  /**
   * Retrieves single college by ID or slug.
   */
  async getCollegeById(idOrSlug: string): Promise<College | null> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const college = COLLEGE_DATA.find(
      (c) => c.id === idOrSlug || c.slug === idOrSlug
    );
    return college || null;
  }

  /**
   * Retrieves multiple colleges by ID list (useful for Compare view).
   */
  async getCollegesByIds(ids: string[]): Promise<College[]> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return COLLEGE_DATA.filter((c) => ids.includes(c.id));
  }

  /**
   * Retrieves list of popular higher education states.
   */
  async getPopularStates(): Promise<StateData[]> {
    await new Promise((resolve) => setTimeout(resolve, 20));
    return POPULAR_STATES;
  }

  /**
   * Submits admission desk enquiry (Phase 1 Frontend simulation).
   */
  async submitEnquiry(data: EnquiryRequest): Promise<{ success: boolean; message: string; id: string }> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    console.log('[Phase 1 Mock Enquiry Submitted]:', data);
    return {
      success: true,
      message: `Enquiry for ${data.collegeName} successfully registered for ${data.studentName}.`,
      id: `ENQ-${Date.now()}`
    };
  }

  /**
   * Submits contact form message.
   */
  async submitContact(data: ContactRequest): Promise<{ success: boolean; message: string; id: string }> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    console.log('[Phase 1 Mock Contact Request]:', data);
    return {
      success: true,
      message: `Thank you ${data.fullName}, your inquiry has been recorded. Our counselor will get in touch shortly.`,
      id: `CNT-${Date.now()}`
    };
  }
}

export const collegeService = new CollegeService();
