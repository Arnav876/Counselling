import { apiFetch } from './apiClient';
import type { User, SavedCollegeItem, ConversationItem, StudentEnquiry, DirectContact } from '../types/auth';

export const authService = {
  async loginWithGoogle(data: { credential?: string; email?: string; name?: string; avatar?: string }): Promise<{ user: User; token: string; message?: string }> {
    const res = await apiFetch('/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Google Authentication failed');
    }

    return await res.json();
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('abc_auth_token');
      if (!token) return null;

      const res = await apiFetch('/auth/me');
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('abc_auth_token');
        }
        return null;
      }

      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('abc_auth_token');
    }
  },

  // Saved Colleges
  async getSavedColleges(): Promise<SavedCollegeItem[]> {
    const res = await apiFetch('/saved-colleges');
    if (!res.ok) throw new Error('Failed to fetch saved colleges');
    const data = await res.json();
    return data.savedColleges || [];
  },

  async getSavedCollegeIds(): Promise<string[]> {
    try {
      const res = await apiFetch('/saved-colleges/ids');
      if (!res.ok) return [];
      const data = await res.json();
      return data.savedIds || [];
    } catch {
      return [];
    }
  },

  async saveCollege(collegeId: string): Promise<any> {
    const res = await apiFetch(`/saved-colleges/${collegeId}`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save college');
    }
    return await res.json();
  },

  async unsaveCollege(collegeId: string): Promise<any> {
    const res = await apiFetch(`/saved-colleges/${collegeId}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to remove saved college');
    }
    return await res.json();
  },

  // Student AI Conversations
  async getMyConversations(): Promise<ConversationItem[]> {
    const res = await apiFetch('/conversations');
    if (!res.ok) throw new Error('Failed to fetch AI conversations');
    const data = await res.json();
    return data.conversations || [];
  },

  async getMyConversationById(id: string): Promise<ConversationItem> {
    const res = await apiFetch(`/conversations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch conversation details');
    const data = await res.json();
    return data.conversation;
  },

  async deleteMyConversation(id: string): Promise<void> {
    const res = await apiFetch(`/conversations/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete conversation');
  },

  // Student Enquiries
  async getMyEnquiries(): Promise<StudentEnquiry[]> {
    const res = await apiFetch('/enquiries/my');
    if (!res.ok) return [];
    const data = await res.json();
    return data.enquiries || [];
  },

  async getMyContacts(): Promise<DirectContact[]> {
    const res = await apiFetch('/contacts/my');
    if (!res.ok) return [];
    const data = await res.json();
    return data.contacts || [];
  }
};
