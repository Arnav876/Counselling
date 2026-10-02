export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  type: 'college_recommendation' | 'info_card';
  data: any;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  action?: () => void;
}

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  isOpen: boolean;
  suggestedQuestions: SuggestedQuestion[];
}
