import { apiFetch } from './apiClient';
import type { College } from '../types/college';
import type { User, AuthorizedAdmin, StudentEnquiry, DirectContact, ConversationItem } from '../types/auth';

export interface AdminOverviewStats {
  stats: {
    colleges: number;
    courses: number;
    students: number;
    admins: number;
    enquiries: number;
    conversations: number;
    blogs?: number;
  };
  recentEnquiries: any[];
  recentUsers: any[];
}

export const adminService = {
  // Admin Dedicated Login
  async adminLogin(credentials: { email: string; password: string }): Promise<{ success: boolean; token: string; user: User }> {
    const res = await apiFetch('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Admin authentication failed. Please verify credentials.');
    }

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('abc_auth_token', data.token);
    }
    return data;
  },

  // Overview
  async getOverview(): Promise<AdminOverviewStats> {
    const res = await apiFetch('/admin/overview');
    if (!res.ok) throw new Error('Failed to fetch admin overview');
    return await res.json();
  },

  // College Management (PostgreSQL CRUD)
  async getColleges(params: { page?: number; limit?: number; search?: string; state?: string; management?: string }): Promise<{ colleges: College[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.state) query.append('state', params.state);
    if (params.management) query.append('management', params.management);

    const res = await apiFetch(`/admin/colleges?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch admin colleges');
    return await res.json();
  },

  async getCollegeById(id: string): Promise<College> {
    const res = await apiFetch(`/admin/colleges/${id}`);
    if (!res.ok) throw new Error('Failed to fetch college');
    return await res.json();
  },

  async createCollege(collegeData: any): Promise<{ success: boolean; college: College; message: string }> {
    const res = await apiFetch('/admin/colleges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collegeData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create college');
    }
    return await res.json();
  },

  async updateCollege(id: string, collegeData: any): Promise<{ success: boolean; college: College; message: string }> {
    const res = await apiFetch(`/admin/colleges/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collegeData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update college');
    }
    return await res.json();
  },

  async deleteCollege(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiFetch(`/admin/colleges/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete college');
    }
    return await res.json();
  },

  // Student Enquiries
  async getEnquiries(params: { status?: string; search?: string; sort?: string; page?: number; limit?: number }): Promise<{ enquiries: StudentEnquiry[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const res = await apiFetch(`/admin/enquiries?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return await res.json();
  },

  async updateEnquiryStatus(id: string, status?: string, adminNote?: string): Promise<any> {
    const res = await apiFetch(`/admin/enquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNote })
    });
    if (!res.ok) throw new Error('Failed to update enquiry status');
    return await res.json();
  },

  async exportEnquiriesCSV(): Promise<Blob> {
    const res = await apiFetch('/admin/enquiries/export');
    if (!res.ok) throw new Error('Failed to export enquiries CSV');
    return await res.blob();
  },

  // Contact Requests
  async getContacts(params: { status?: string; page?: number; limit?: number }): Promise<{ contacts: DirectContact[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const res = await apiFetch(`/admin/contacts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch contact requests');
    return await res.json();
  },

  async updateContactStatus(id: string, status?: string, adminNote?: string): Promise<any> {
    const res = await apiFetch(`/admin/contacts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNote })
    });
    if (!res.ok) throw new Error('Failed to update contact status');
    return await res.json();
  },

  // AI Conversations Audit Log
  async getConversations(params: { page?: number; limit?: number }): Promise<{ conversations: ConversationItem[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const res = await apiFetch(`/admin/conversations?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch conversation audit log');
    return await res.json();
  },

  async getConversationById(id: string): Promise<ConversationItem> {
    const res = await apiFetch(`/admin/conversations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch conversation');
    return await res.json();
  },

  // Users Management
  async getUsers(params: { role?: string; page?: number; limit?: number }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.role) query.append('role', params.role);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const res = await apiFetch(`/admin/users?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
  },

  // Admin Management (Super Admin ONLY)
  async getAdmins(): Promise<{ authorizedAdmins: AuthorizedAdmin[]; activeAdminUsers: User[]; superAdminEmail: string }> {
    const res = await apiFetch('/admin/admins');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch admin list (Super Admin required)');
    }
    return await res.json();
  },

  async addAdmin(email: string): Promise<{ success: boolean; message: string; authorizedAdmin: AuthorizedAdmin }> {
    const res = await apiFetch('/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to authorize admin');
    }
    return await res.json();
  },

  async revokeAdmin(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiFetch(`/admin/admins/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to revoke admin');
    }
    return await res.json();
  }
};
