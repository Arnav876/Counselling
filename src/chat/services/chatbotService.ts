import type { ChatMessage, SuggestedQuestion } from '../types/chat';
import type { StudentPreferences, PreferenceField } from '../types/preferences';
import type { RecommendationRequest, RecommendationResponse } from '../types/recommendation';
import { recommendationService } from './recommendationService';

/**
 * Chatbot Service Interface
 * Handles conversational logic and preference collection
 */
export interface IChatbotService {
  processMessage(message: string, currentPreferences: StudentPreferences): Promise<ChatMessage>;
  getInitialSuggestions(): SuggestedQuestion[];
  resetConversation(): StudentPreferences;
}

/**
 * Preference Collection Fields
 * Defines the structured data we need to collect
 */
const PREFERENCE_FIELDS: PreferenceField[] = [
  {
    key: 'examType',
    label: 'Which entrance exam have you taken?',
    type: 'select',
    options: [
      { value: 'JEE_MAIN', label: 'JEE Main' },
      { value: 'JEE_ADVANCED', label: 'JEE Advanced' },
      { value: 'NEET', label: 'NEET' },
      { value: 'KCET', label: 'KCET' },
      { value: 'COMEDK', label: 'COMEDK' },
      { value: 'MHT_CET', label: 'MHT-CET' },
      { value: 'TNEA', label: 'TNEA' },
      { value: 'BITSAT', label: 'BITSAT' },
      { value: 'VITEEE', label: 'VITEEE' },
      { value: 'NONE', label: 'None yet' },
    ],
    required: true,
  },
  {
    key: 'courseType',
    label: 'What course are you interested in?',
    type: 'select',
    options: [
      { value: 'ENGINEERING', label: 'Engineering (B.Tech/B.E.)' },
      { value: 'MEDICAL', label: 'Medical (MBBS/BDS)' },
      { value: 'MANAGEMENT', label: 'Management (MBA/BBA)' },
      { value: 'LAW', label: 'Law' },
      { value: 'SCIENCE_ARTS', label: 'Science & Arts' },
    ],
    required: true,
  },
  {
    key: 'rank',
    label: 'What is your rank or percentile?',
    type: 'number',
    required: false,
  },
  {
    key: 'category',
    label: 'What is your category?',
    type: 'select',
    options: [
      { value: 'GENERAL', label: 'General' },
      { value: 'OBC', label: 'OBC' },
      { value: 'SC', label: 'SC' },
      { value: 'ST', label: 'ST' },
      { value: 'EWS', label: 'EWS' },
    ],
    required: true,
  },
  {
    key: 'homeState',
    label: 'Which state are you from?',
    type: 'select',
    options: [
      { value: 'Karnataka', label: 'Karnataka' },
      { value: 'Maharashtra', label: 'Maharashtra' },
      { value: 'Tamil Nadu', label: 'Tamil Nadu' },
      { value: 'Telangana', label: 'Telangana' },
      { value: 'Delhi', label: 'Delhi' },
      { value: 'Kerala', label: 'Kerala' },
      { value: 'Punjab', label: 'Punjab' },
      { value: 'Rajasthan', label: 'Rajasthan' },
      { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
      { value: 'Other', label: 'Other' },
    ],
    required: true,
  },
  {
    key: 'collegeType',
    label: 'Do you prefer government or private colleges?',
    type: 'select',
    options: [
      { value: 'GOVERNMENT', label: 'Government only' },
      { value: 'PRIVATE', label: 'Private only' },
      { value: 'ANY', label: 'Both are fine' },
    ],
    required: true,
  },
  {
    key: 'budgetMax',
    label: 'What is your annual budget (in ₹)?',
    type: 'number',
    required: false,
  },
  {
    key: 'placementImportant',
    label: 'Are placements important to you?',
    type: 'boolean',
    required: false,
  },
  {
    key: 'researchImportant',
    label: 'Are research opportunities important?',
    type: 'boolean',
    required: false,
  },
];

/**
 * Mock Chatbot Service Implementation
 * Handles conversation flow and preference extraction
 */
export class MockChatbotService implements IChatbotService {
  private conversationState = {
    step: 0,
    collectedFields: new Set<keyof StudentPreferences>(),
  };

  async processMessage(message: string, currentPreferences: StudentPreferences): Promise<ChatMessage> {
    // Extract preferences from message
    const updatedPreferences = this.extractPreferences(message, currentPreferences);

    // Check if we have enough information for recommendations
    const hasEnoughInfo = this.hasSufficientPreferences(updatedPreferences);

    if (hasEnoughInfo) {
      // Generate recommendations
      const recommendations = await this.generateRecommendations(updatedPreferences);

      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: this.buildRecommendationResponse(updatedPreferences, recommendations),
        timestamp: new Date(),
        attachments: [
          {
            type: 'college_recommendation',
            data: recommendations,
          },
        ],
      };
    }

    // Ask next question
    const nextField = this.getNextField(updatedPreferences);
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: this.buildFollowUpQuestion(nextField, updatedPreferences),
      timestamp: new Date(),
    };
  }

  getInitialSuggestions(): SuggestedQuestion[] {
    return [
      {
        id: '1',
        text: 'I have JEE Main rank 18000, want CSE in Karnataka',
      },
      {
        id: '2',
        text: 'NEET rank 5000, looking for MBBS in government college',
      },
      {
        id: '3',
        text: 'Help me find engineering colleges under 5 lakhs',
      },
      {
        id: '4',
        text: 'I want top placement colleges in Maharashtra',
      },
    ];
  }

  resetConversation(): StudentPreferences {
    this.conversationState = {
      step: 0,
      collectedFields: new Set(),
    };
    return this.getInitialPreferences();
  }

  private extractPreferences(message: string, current: StudentPreferences): StudentPreferences {
    const updated = { ...current };
    const lowerMessage = message.toLowerCase();

    // Extract exam type
    if (lowerMessage.includes('jee main')) updated.examType = 'JEE_MAIN';
    else if (lowerMessage.includes('jee advanced')) updated.examType = 'JEE_ADVANCED';
    else if (lowerMessage.includes('neet')) updated.examType = 'NEET';
    else if (lowerMessage.includes('kcet')) updated.examType = 'KCET';
    else if (lowerMessage.includes('comedk')) updated.examType = 'COMEDK';
    else if (lowerMessage.includes('mht-cet') || lowerMessage.includes('mht cet')) updated.examType = 'MHT_CET';
    else if (lowerMessage.includes('tnea')) updated.examType = 'TNEA';
    else if (lowerMessage.includes('bitsat')) updated.examType = 'BITSAT';
    else if (lowerMessage.includes('viteee')) updated.examType = 'VITEEE';

    // Extract course type
    if (lowerMessage.includes('medical') || lowerMessage.includes('mbbs') || lowerMessage.includes('bds')) {
      updated.courseType = 'MEDICAL';
      if (lowerMessage.includes('mbbs')) updated.preferredBranches = ['MBBS'];
    } else if (lowerMessage.includes('engineering') || lowerMessage.includes('b.tech') || lowerMessage.includes('b.e')) {
      updated.courseType = 'ENGINEERING';
      if (lowerMessage.includes('cse') || lowerMessage.includes('computer science')) {
        updated.preferredBranches = ['CSE'];
      } else if (lowerMessage.includes('ece') || lowerMessage.includes('electronics')) {
        updated.preferredBranches = ['ECE'];
      } else if (lowerMessage.includes('mech') || lowerMessage.includes('mechanical')) {
        updated.preferredBranches = ['MECH'];
      }
    } else if (lowerMessage.includes('management') || lowerMessage.includes('mba')) {
      updated.courseType = 'MANAGEMENT';
    }

    // Extract rank/percentile
    const rankMatch = message.match(/rank\s*(\d+)/i);
    if (rankMatch) {
      updated.rank = parseInt(rankMatch[1], 10);
    }
    const percentileMatch = message.match(/percentile\s*(\d+)/i);
    if (percentileMatch) {
      updated.percentile = parseInt(percentileMatch[1], 10);
    }

    // Extract state
    const states = ['karnataka', 'maharashtra', 'tamil nadu', 'telangana', 'delhi', 'kerala', 'punjab', 'rajasthan', 'uttar pradesh'];
    for (const state of states) {
      if (lowerMessage.includes(state)) {
        updated.homeState = state.charAt(0).toUpperCase() + state.slice(1);
        updated.preferredStates = [updated.homeState];
        updated.locationPreference = 'HOME_STATE';
        break;
      }
    }

    // Extract college type
    if (lowerMessage.includes('government') && !lowerMessage.includes('private')) {
      updated.collegeType = 'GOVERNMENT';
    } else if (lowerMessage.includes('private') && !lowerMessage.includes('government')) {
      updated.collegeType = 'PRIVATE';
    }

    // Extract budget
    const budgetMatch = message.match(/(\d+)\s*(lakhs?|l)/i);
    if (budgetMatch) {
      updated.budgetMax = parseInt(budgetMatch[1], 10) * 100000;
    } else {
      const directBudget = message.match(/(\d+)\s*(rupees?|₹)/i);
      if (directBudget) {
        updated.budgetMax = parseInt(directBudget[1], 10);
      }
    }

    // Extract placement importance
    if (lowerMessage.includes('placement') || lowerMessage.includes('job') || lowerMessage.includes('salary')) {
      updated.placementImportant = true;
    }

    // Extract research importance
    if (lowerMessage.includes('research') || lowerMessage.includes('innovation') || lowerMessage.includes('r&d')) {
      updated.researchImportant = true;
    }

    return updated;
  }

  private hasSufficientPreferences(preferences: StudentPreferences): boolean {
    // Minimum required: examType, courseType, homeState, collegeType
    return !!(
      preferences.examType &&
      preferences.courseType &&
      preferences.homeState &&
      preferences.collegeType
    );
  }

  private getNextField(preferences: StudentPreferences): PreferenceField | null {
    for (const field of PREFERENCE_FIELDS) {
      const value = preferences[field.key];
      if (!value && field.required) {
        return field;
      }
    }
    return null;
  }

  private buildFollowUpQuestion(field: PreferenceField | null, _preferences: StudentPreferences): string {
    if (!field) {
      return "I have enough information to help you. Would you like me to show you college recommendations now?";
    }

    let response = '';
    if (this.conversationState.step === 0) {
      response = "Hello! I'm your college admission advisor. I'll help you find the best colleges based on your preferences. ";
    }

    response += field.label;
    if (field.options) {
      response += '\n\n';
      field.options.forEach((opt, idx) => {
        response += `${idx + 1}. ${opt.label}\n`;
      });
    }

    this.conversationState.step++;
    return response;
  }

  private async generateRecommendations(preferences: StudentPreferences): Promise<RecommendationResponse> {
    const request: RecommendationRequest = {
      preferences,
      maxResults: 5,
    };
    return await recommendationService.getRecommendations(request);
  }

  private buildRecommendationResponse(preferences: StudentPreferences, response: RecommendationResponse): string {
    const { recommendations, summary, disclaimer } = response;

    let message = `Based on your preferences, I've found ${recommendations.length} strong college matches for you.\n\n`;
    message += `${summary}\n\n`;
    message += `📊 **Your Preferences:**\n`;
    message += `- Course: ${preferences.courseType}\n`;
    message += `- State: ${preferences.homeState}\n`;
    message += `- College Type: ${preferences.collegeType}\n`;
    if (preferences.rank) message += `- Rank: ${preferences.rank}\n`;
    if (preferences.budgetMax) message += `- Budget: ₹${(preferences.budgetMax / 100000).toFixed(1)}L\n`;

    message += `\n⚠️ ${disclaimer}`;

    return message;
  }

  private getInitialPreferences(): StudentPreferences {
    return {
      examType: 'NONE',
      courseType: 'ENGINEERING',
      category: 'GENERAL',
      preferredBranches: [],
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

// Export singleton instance
export const chatbotService = new MockChatbotService();

/**
 * Future: AI-powered Chatbot Service
 * This will integrate with AI backend for natural language understanding
 */
export class AIChatbotService implements IChatbotService {
  async processMessage(_message: string, _currentPreferences: StudentPreferences): Promise<ChatMessage> {
    // TODO: Integrate with AI backend for NLU
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message, preferences: currentPreferences }),
    // });
    // return response.json();
    throw new Error('AI service not yet implemented');
  }

  getInitialSuggestions(): SuggestedQuestion[] {
    return chatbotService.getInitialSuggestions();
  }

  resetConversation(): StudentPreferences {
    return chatbotService.resetConversation();
  }
}
