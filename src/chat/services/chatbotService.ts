import type { SuggestedQuestion } from '../types/chat';
import type { StudentPreferences } from '../types/preferences';
import { apiFetch } from '../../services/apiClient';

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

    const res = await apiFetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Chat API error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
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

