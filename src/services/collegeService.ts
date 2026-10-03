import type { College, FilterState, SortOption, StateData } from '../types/college';
import { POPULAR_STATES } from '../data/colleges';

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:5001/api';
};

const API_BASE = getApiBase();

/**
 * Robust fetch helper that calls API_BASE (http://localhost:5001/api)
 * and falls back to relative Vite proxy (/api) if direct connection fails.
 */
async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const primaryUrl = `${API_BASE}${cleanPath}`;
  
  try {
    const res = await fetch(primaryUrl, options);
    return res;
  } catch (primaryErr) {
    // If direct cross-origin request failed, attempt fallback via Vite local dev proxy
    if (primaryUrl.includes(':5001/api')) {
      const proxyUrl = `/api${cleanPath}`;
      console.warn(`[API] Direct connection to ${primaryUrl} failed. Trying proxy ${proxyUrl}...`);
      try {
        const proxyRes = await fetch(proxyUrl, options);
        return proxyRes;
      } catch (proxyErr) {
        throw primaryErr;
      }
    }
    throw primaryErr;
  }
}

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
   * Retrieves colleges filtered and sorted from the Express/PostgreSQL backend.
   */
  async getColleges(filters?: Partial<FilterState>, sort: SortOption = 'relevance'): Promise<College[]> {
    try {
      const params = new URLSearchParams();

      if (sort) {
        params.append('sort', sort);
      }

      if (filters) {
        if (filters.search && filters.search.trim()) {
          params.append('search', filters.search.trim());
        }
        if (filters.state && filters.state !== 'ALL' && filters.state !== 'all') {
          params.append('state', filters.state);
        }
        if (filters.distance && filters.distance !== 'all') {
          params.append('distance', filters.distance);
        }
        if (filters.managementType && filters.managementType.length > 0) {
          params.append('managementType', filters.managementType.join(','));
        }
        if (filters.stream && filters.stream !== 'all' && filters.stream !== 'ALL') {
          params.append('stream', filters.stream);
        }
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/colleges?${queryString}` : '/colleges';
      const res = await apiFetch(endpoint);
      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
      if (data && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch colleges from backend API:', err);
      throw err;
    }
  }

  /**
   * Retrieves single college by ID or slug.
   */
  async getCollegeById(idOrSlug: string): Promise<College | null> {
    try {
      const res = await apiFetch(`/colleges/${encodeURIComponent(idOrSlug)}`);
      if (res.status === 404) {
        return null;
      }
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`Failed to fetch college ${idOrSlug} from backend:`, err);
      throw err;
    }
  }

  /**
   * Retrieves multiple colleges by ID list (useful for Compare view).
   */
  async getCollegesByIds(ids: string[]): Promise<College[]> {
    if (!ids || ids.length === 0) return [];
    try {
      const res = await apiFetch(`/colleges?ids=${encodeURIComponent(ids.join(','))}`);
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (err) {
      console.error('Failed to fetch colleges by IDs:', err);
      throw err;
    }
  }

  /**
   * Retrieves list of higher education states with real college and seat counts.
   */
  async getPopularStates(): Promise<StateData[]> {
    try {
      const res = await apiFetch('/states');
      if (!res.ok) {
        return POPULAR_STATES;
      }
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : POPULAR_STATES;
    } catch (err) {
      console.warn('Fallback to static states data due to API error:', err);
      return POPULAR_STATES;
    }
  }

  /**
   * Submits admission desk enquiry.
   */
  async submitEnquiry(data: EnquiryRequest): Promise<{ success: boolean; message: string; id: string }> {
    try {
      const res = await apiFetch('/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to submit enquiry');
      }
      return await res.json();
    } catch (err) {
      console.error('Enquiry submission error:', err);
      throw err;
    }
  }

  /**
   * Submits contact form message.
   */
  async submitContact(data: ContactRequest): Promise<{ success: boolean; message: string; id: string }> {
    try {
      const res = await apiFetch('/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to submit contact');
      }
      return await res.json();
    } catch (err) {
      console.error('Contact submission error:', err);
      throw err;
    }
  }
}

export const collegeService = new CollegeService();

