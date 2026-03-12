import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function trackVisit(req: Request, res: Response): Promise<void> {
  try {
    await prisma.visit.create({
      data: {},
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Track visit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
