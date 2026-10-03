import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

// ==========================================
// PUBLIC BLOG ENDPOINTS
// ==========================================

export const getPublicBlogs = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const search = (req.query.search as string || '').trim();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;

    const where: any = {
      status: 'PUBLISHED'
    };

    if (category && (category === 'PRIVATE' || category === 'GOVERNMENT')) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, blogs] = await Promise.all([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' }
        ]
      })
    ]);

    res.json({
      blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Error fetching public blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getPublicBlogBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    const blog = await prisma.blog.findUnique({
      where: { slug }
    });

    if (!blog || blog.status !== 'PUBLISHED') {
      return res.status(404).json({ error: 'Article not found or not yet published' });
    }

    // Increment view count asynchronously
    prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } }
    }).catch(() => {});

    // Also fetch 3 related blogs in same category
    const relatedBlogs = await prisma.blog.findMany({
      where: {
        category: blog.category,
        status: 'PUBLISHED',
        id: { not: blog.id }
      },
      take: 3,
      orderBy: { publishedAt: 'desc' }
    });

    res.json({
      blog,
      relatedBlogs
    });
  } catch (error: any) {
    console.error('Error fetching blog details:', error);
    res.status(500).json({ error: 'Failed to fetch article details' });
  }
};

export const getBlogCategoryStats = async (_req: Request, res: Response) => {
  try {
    const [privateCount, governmentCount, totalPublished] = await Promise.all([
      prisma.blog.count({ where: { category: 'PRIVATE', status: 'PUBLISHED' } }),
      prisma.blog.count({ where: { category: 'GOVERNMENT', status: 'PUBLISHED' } }),
      prisma.blog.count({ where: { status: 'PUBLISHED' } })
    ]);

    res.json({
      total: totalPublished,
      privateCount,
      governmentCount
    });
  } catch (error: any) {
    console.error('Error fetching blog stats:', error);
    res.status(500).json({ error: 'Failed to fetch blog category stats' });
  }
};

// ==========================================
// ADMIN BLOG MANAGEMENT ENDPOINTS
// ==========================================

export const getAdminBlogs = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const category = req.query.category as string;
    const search = (req.query.search as string || '').trim();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (category && category !== 'ALL') where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, blogs] = await Promise.all([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' }
      })
    ]);

    res.json({
      blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Error fetching admin blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getAdminBlogById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error: any) {
    console.error('Error fetching blog by id:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const createAdminBlog = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      coverImage = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
      category = 'PRIVATE',
      author = 'Admission by Choice Advisory',
      status = 'DRAFT',
      tags = []
    } = req.body;

    if (!title || !content || !excerpt) {
      return res.status(400).json({ error: 'Title, excerpt, and content are required' });
    }

    if (!['PRIVATE', 'GOVERNMENT'].includes(category)) {
      return res.status(400).json({ error: 'Category must be either PRIVATE or GOVERNMENT' });
    }

    // Generate unique SEO slug
    const baseSlug = (customSlug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    let slug = baseSlug;
    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category,
        author,
        status,
        tags: Array.isArray(tags) ? tags : [],
        publishedAt: status === 'PUBLISHED' ? new Date() : null
      }
    });

    res.status(201).json({
      success: true,
      message: `Blog post "${newBlog.title}" created successfully.`,
      blog: newBlog
    });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog post', details: error.message });
  }
};

export const updateAdminBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      author,
      status,
      tags
    } = req.body;

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (category !== undefined && ['PRIVATE', 'GOVERNMENT'].includes(category)) {
      updateData.category = category;
    }
    if (author !== undefined) updateData.author = author;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];

    if (status !== undefined && ['DRAFT', 'PUBLISHED'].includes(status)) {
      updateData.status = status;
      if (status === 'PUBLISHED' && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: `Blog post "${updatedBlog.title}" updated successfully.`,
      blog: updatedBlog
    });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog post', details: error.message });
  }
};

export const deleteAdminBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    await prisma.blog.delete({ where: { id } });

    res.json({
      success: true,
      message: `Blog post "${existing.title}" deleted.`
    });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
