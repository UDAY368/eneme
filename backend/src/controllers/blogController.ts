import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function getBlogs(req: Request, res: Response): Promise<void> {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(blogs);
  } catch (error: unknown) {
    console.error('Get blogs error:', error);
    const err = error as { code?: string };
    if (err?.code === 'P2021' || err?.code === 'P2010') {
      res.status(503).json({ error: 'Database not ready. Run: npm run db:push' });
      return;
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: 'Failed to fetch blogs', details: process.env.NODE_ENV === 'development' ? message : undefined });
  }
}

export async function getBlogById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }
    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createBlog(req: Request, res: Response): Promise<void> {
  try {
    const { chipTitle, blogTitle, blogDescription, date, timeToRead, imageUrl, content } = req.body;
    if (!blogTitle?.trim()) {
      res.status(400).json({ error: 'Blog title is required' });
      return;
    }
    const blog = await prisma.blog.create({
      data: {
        chipTitle: chipTitle || null,
        blogTitle: blogTitle.trim(),
        blogDescription: blogDescription || null,
        date: date ? new Date(date) : new Date(),
        timeToRead: timeToRead || null,
        imageUrl: imageUrl || null,
        content: content || '',
      },
    });
    res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateBlog(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { chipTitle, blogTitle, blogDescription, date, timeToRead, imageUrl, content } = req.body;
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(chipTitle !== undefined && { chipTitle }),
        ...(blogTitle && { blogTitle: blogTitle.trim() }),
        ...(blogDescription !== undefined && { blogDescription }),
        ...(date && { date: new Date(date) }),
        ...(timeToRead !== undefined && { timeToRead }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(content !== undefined && { content }),
      },
    });
    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteBlog(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.blog.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/** Fast list for admin: blogs without content + count in single request */
export async function getBlogListWithCount(req: Request, res: Response): Promise<void> {
  try {
    const [blogs, totalBlogs] = await Promise.all([
      prisma.blog.findMany({
        select: {
          id: true,
          chipTitle: true,
          blogTitle: true,
          blogDescription: true,
          date: true,
          timeToRead: true,
          imageUrl: true,
        },
        orderBy: { date: 'desc' },
      }),
      prisma.blog.count(),
    ]);
    res.json({ blogs, totalBlogs });
  } catch (error: unknown) {
    console.error('Get blog list error:', error);
    const err = error as { code?: string };
    if (err?.code === 'P2021' || err?.code === 'P2010') {
      res.status(503).json({ error: 'Database not ready. Run: npm run db:push' });
      return;
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: 'Failed to fetch blogs', details: process.env.NODE_ENV === 'development' ? message : undefined });
  }
}

export async function getBlogCount(req: Request, res: Response): Promise<void> {
  try {
    const totalBlogs = await prisma.blog.count();
    res.json({ totalBlogs });
  } catch (error: unknown) {
    console.error('Get blog count error:', error);
    const err = error as { code?: string };
    if (err?.code === 'P2021' || err?.code === 'P2010') {
      res.status(503).json({ error: 'Database not ready. Run: npm run db:push' });
      return;
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: 'Failed to fetch blog count', details: process.env.NODE_ENV === 'development' ? message : undefined });
  }
}
