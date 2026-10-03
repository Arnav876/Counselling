import { apiFetch } from './apiClient';
import type { Blog, BlogCategoryStats } from '../types/blog';

export const blogService = {
  // Public Blog Endpoints
  async getPublicBlogs(params?: { category?: string; search?: string; page?: number; limit?: number }): Promise<{ blogs: Blog[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const res = await apiFetch(`/blogs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return await res.json();
  },

  async getPublicBlogBySlug(slug: string): Promise<{ blog: Blog; relatedBlogs: Blog[] }> {
    const res = await apiFetch(`/blogs/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Article not found');
    return await res.json();
  },

  async getCategoryStats(): Promise<BlogCategoryStats> {
    try {
      const res = await apiFetch('/blogs/categories');
      if (!res.ok) return { total: 0, privateCount: 0, governmentCount: 0 };
      return await res.json();
    } catch {
      return { total: 0, privateCount: 0, governmentCount: 0 };
    }
  },

  // Admin Blog Endpoints
  async getAdminBlogs(params?: { status?: string; category?: string; search?: string; page?: number; limit?: number }): Promise<{ blogs: Blog[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const res = await apiFetch(`/admin/blogs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch admin blogs');
    return await res.json();
  },

  async getAdminBlogById(id: string): Promise<Blog> {
    const res = await apiFetch(`/admin/blogs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch blog');
    return await res.json();
  },

  async createAdminBlog(data: Partial<Blog>): Promise<{ success: boolean; blog: Blog; message: string }> {
    const res = await apiFetch('/admin/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create blog post');
    }
    return await res.json();
  },

  async updateAdminBlog(id: string, data: Partial<Blog>): Promise<{ success: boolean; blog: Blog; message: string }> {
    const res = await apiFetch(`/admin/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update blog post');
    }
    return await res.json();
  },

  async deleteAdminBlog(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiFetch(`/admin/blogs/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete blog post');
    }
    return await res.json();
  }
};
