import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { startOfDay, endOfDay, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export async function createLead(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, company, projectType, message } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        projectType: projectType || null,
        message: message || null,
      },
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getLeads(req: Request, res: Response): Promise<void> {
  try {
    const { filter = 'all', reviewed, year, month, page = '1', limit = '10' } = req.query;

    const where: Record<string, unknown> = {};

    if (reviewed !== undefined) {
      where.reviewed = reviewed === 'true';
    }

    const now = new Date();
    if (filter === 'today') {
      where.createdAt = { gte: startOfDay(now), lte: endOfDay(now) };
    } else if (filter === 'week') {
      where.createdAt = { gte: subDays(now, 7), lte: now };
    } else if (filter === 'month') {
      where.createdAt = { gte: subMonths(now, 1), lte: now };
    } else if (filter === 'custom' && year && month) {
      const y = parseInt(year as string);
      const m = parseInt(month as string);
      const start = new Date(y, m - 1, 1);
      where.createdAt = { gte: start, lte: endOfMonth(start) };
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(50, Math.max(5, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({ leads, totalCount });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getLeadCount(req: Request, res: Response): Promise<void> {
  try {
    const count = await prisma.lead.count();
    res.json({ totalCount: count });
  } catch (error) {
    console.error('Get lead count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateLeadReviewed(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.update({
      where: { id },
      data: { reviewed: true },
    });
    res.json(lead);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteLead(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.lead.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
