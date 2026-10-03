export type BlogCategory = 'PRIVATE' | 'GOVERNMENT';
export type BlogStatus = 'DRAFT' | 'PUBLISHED';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: BlogCategory;
  author: string;
  status: BlogStatus;
  tags: string[];
  views: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategoryStats {
  total: number;
  privateCount: number;
  governmentCount: number;
}
