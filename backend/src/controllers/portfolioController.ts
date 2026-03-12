import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Categories
export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.portfolioCategory.findMany({
      include: {
        _count: { select: { subCategories: true, portfolios: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }
    const category = await prisma.portfolioCategory.create({ data: { name: name.trim() } });
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name?.trim()) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }
    const category = await prisma.portfolioCategory.update({
      where: { id },
      data: { name: name.trim() },
    });
    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.portfolioCategory.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// SubCategories
export async function getSubCategories(req: Request, res: Response): Promise<void> {
  try {
    const { categoryId } = req.query;
    const where = categoryId ? { categoryId: categoryId as string } : {};
    const subCategories = await prisma.portfolioSubCategory.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(subCategories);
  } catch (error) {
    console.error('Get sub categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createSubCategory(req: Request, res: Response): Promise<void> {
  try {
    const { categoryId, name } = req.body;
    if (!categoryId || !name?.trim()) {
      res.status(400).json({ error: 'Category and sub-category name are required' });
      return;
    }
    const subCategory = await prisma.portfolioSubCategory.create({
      data: { categoryId, name: name.trim() },
      include: { category: { select: { name: true } } },
    });
    res.status(201).json(subCategory);
  } catch (error) {
    console.error('Create sub category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateSubCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name?.trim()) {
      res.status(400).json({ error: 'Sub-category name is required' });
      return;
    }
    const subCategory = await prisma.portfolioSubCategory.update({
      where: { id },
      data: { name: name.trim() },
      include: { category: { select: { name: true } } },
    });
    res.json(subCategory);
  } catch (error) {
    console.error('Update sub category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteSubCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.portfolioSubCategory.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete sub category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Portfolio
export async function getPortfolios(req: Request, res: Response): Promise<void> {
  try {
    const { categoryId, subCategoryId } = req.query;
    const where: Record<string, string> = {};
    if (categoryId) where.categoryId = categoryId as string;
    if (subCategoryId) where.subCategoryId = subCategoryId as string;

    const portfolios = await prisma.portfolio.findMany({
      where,
      include: {
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(portfolios);
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPortfolioById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
    });
    if (!portfolio) {
      res.status(404).json({ error: 'Portfolio not found' });
      return;
    }
    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createPortfolio(req: Request, res: Response): Promise<void> {
  try {
    const { categoryId, subCategoryId, imageUrl, videoUrl, year, heading, description, company, chips } = req.body;
    if (!categoryId || !subCategoryId || !heading?.trim()) {
      res.status(400).json({ error: 'Category, sub-category and heading are required' });
      return;
    }
    const portfolio = await prisma.portfolio.create({
      data: {
        categoryId,
        subCategoryId,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        year: year || null,
        heading: heading.trim(),
        description: description || null,
        company: company || null,
        chips: Array.isArray(chips) ? chips : chips ? [chips] : [],
      },
      include: {
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
    });
    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updatePortfolio(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { categoryId, subCategoryId, imageUrl, videoUrl, year, heading, description, company, chips } = req.body;
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        ...(categoryId && { categoryId }),
        ...(subCategoryId && { subCategoryId }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(year !== undefined && { year }),
        ...(heading && { heading: heading.trim() }),
        ...(description !== undefined && { description }),
        ...(company !== undefined && { company }),
        ...(chips !== undefined && { chips: Array.isArray(chips) ? chips : [] }),
      },
      include: {
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
    });
    res.json(portfolio);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deletePortfolio(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.portfolio.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPortfolioStats(req: Request, res: Response): Promise<void> {
  try {
    const result = await prisma.$queryRaw<[{ totalPortfolios: bigint; totalCategories: bigint; totalSubCategories: bigint }]>`
      SELECT
        (SELECT COUNT(*) FROM portfolios)::bigint as "totalPortfolios",
        (SELECT COUNT(*) FROM portfolio_categories)::bigint as "totalCategories",
        (SELECT COUNT(*) FROM portfolio_sub_categories)::bigint as "totalSubCategories"
    `;
    const row = result[0];
    res.json({
      totalPortfolios: Number(row.totalPortfolios),
      totalCategories: Number(row.totalCategories),
      totalSubCategories: Number(row.totalSubCategories),
    });
  } catch (error) {
    console.error('Get portfolio stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
