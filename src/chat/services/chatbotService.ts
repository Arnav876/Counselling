import type { SuggestedQuestion } from '../types/chat';
import type { StudentPreferences } from '../types/preferences';

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:5001/api';
};

const API_BASE = getApiBase();

/**
 * Chatbot Service Interface
 */
export interface IChatbotService {
  processMessage(
    message: string,
    history?: { role: 'user' | 'assistant'; content: string }[],
    previousCollegeIds?: string[]
  ): Promise<{ message: string; colleges?: any[]; suggestions?: string[] }>;
  getInitialSuggestions(): SuggestedQuestion[];
  resetConversation(): StudentPreferences;
}

export class ChatbotService implements IChatbotService {
  async processMessage(
    message: string,
    history: { role: 'user' | 'assistant'; content: string }[] = [],
    previousCollegeIds: string[] = []
  ): Promise<{ message: string; colleges?: any[]; suggestions?: string[] }> {
    const payload = {
      message,
      history,
      previousCollegeIds
    };

    try {
      // 1. Try direct API_BASE
      const directUrl = `${API_BASE}/chat`;
      const res = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        return await res.json();
      }
      throw new Error(`Direct API responded with status ${res.status}`);
    } catch (directErr) {
      console.warn('[ChatbotService] Direct API call failed, retrying via /api/chat proxy...', directErr);
      // 2. Fallback to Vite proxy
      const proxyRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!proxyRes.ok) {
        throw new Error(`Chat API error: ${proxyRes.status} ${proxyRes.statusText}`);
      }
      return await proxyRes.json();
    }
  }

  getInitialSuggestions(): SuggestedQuestion[] {
    return [
      {
        id: '1',
        text: 'Show top medical colleges in Karnataka',
      },
      {
        id: '2',
        text: 'Show private colleges with NRI quota in Bihar',
      },
      {
        id: '3',
        text: 'Tell me about Maulana Azad Medical College',
      },
      {
        id: '4',
        text: 'Which colleges have hostel & simulation facilities in Delhi?',
      },
    ];
  }

  resetConversation(): StudentPreferences {
    return {
      examType: 'NEET',
      courseType: 'MEDICAL',
      category: 'GENERAL',
      preferredBranches: ['MBBS'],
      homeState: '',
      preferredStates: [],
      locationPreference: 'ANY_INDIA',
      collegeType: 'ANY',
      budgetCurrency: 'INR',
      hostelRequired: false,
      placementImportant: false,
      researchImportant: false,
      nirfRankingImportant: false,
    };
  }
}

export const chatbotService = new ChatbotService();

