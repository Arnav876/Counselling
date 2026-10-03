import type { College } from './college';

export type UserRole = 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastLoginAt: string;
  _count?: {
    savedColleges?: number;
    conversations?: number;
    enquiries?: number;
  };
}

export interface AuthorizedAdmin {
  id: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  addedBy?: string;
  createdAt: string;
}

export interface SavedCollegeItem {
  id: string;
  savedAt: string;
  college: College;
}

export interface ConversationItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
  messages?: ChatMessageItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ChatMessageItem {
  id: string;
  conversationId: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  colleges?: any[];
  suggestions?: string[];
  createdAt: string;
}

export interface StudentEnquiry {
  id: string;
  userId?: string | null;
  collegeName: string;
  studentName: string;
  phone: string;
  preferredCourse: string;
  notes?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface DirectContact {
  id: string;
  userId?: string | null;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredState?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}
