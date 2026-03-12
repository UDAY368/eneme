import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { endOfMonth } from 'date-fns';

type MonthRow = { month: number; count: bigint };
type CachedAnalytics = { totalVisits: number; totalLeads: number; chartData: { leads: { label: string; count: number }[]; visits: { label: string; count: number }[] } };
const analyticsCache = new Map<string, { data: CachedAnalytics; expires: number }>();
const CACHE_TTL_MS = 15000;

function getCacheKey(filter: unknown, year: number, month: number): string {
  return `${filter}_${year}_${month}`;
}
type DayRow = { day: number; count: bigint };

/** Fast summary: only total counts - use for immediate UI display */
export async function getAnalyticsSummary(req: Request, res: Response): Promise<void> {
  try {
    const [totalVisits, totalLeads] = await Promise.all([
      prisma.visit.count(),
      prisma.lead.count(),
    ]);
    res.json({ totalVisits, totalLeads });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const { filter = 'daywise', year, month } = req.query;

    const selectedYear = year ? parseInt(year as string) : new Date().getFullYear();
    const selectedMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;

    const cacheKey = getCacheKey(filter, selectedYear, selectedMonth);
    const cached = analyticsCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      res.json(cached.data);
      return;
    }

    // Run all 4 queries in parallel - optimized from 24+ to 4 DB round-trips
    const [totalVisits, totalLeads, leadsData, visitsData] = await Promise.all([
      prisma.visit.count(),
      prisma.lead.count(),
      fetchLeadsChartData(filter, selectedYear, selectedMonth),
      fetchVisitsChartData(filter, selectedYear, selectedMonth),
    ]);

    const result = {
      totalVisits,
      totalLeads,
      chartData: {
        leads: leadsData,
        visits: visitsData,
      },
    };
    analyticsCache.set(cacheKey, { data: result, expires: Date.now() + CACHE_TTL_MS });
    res.json(result);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function fetchLeadsChartData(
  filter: unknown,
  year: number,
  month: number
): Promise<{ label: string; count: number }[]> {
  if (filter === 'daywise' && year && month) {
    const start = new Date(year, month - 1, 1);
    const end = endOfMonth(start);
    const daysInMonth = end.getDate();

    const rows = await prisma.$queryRaw<DayRow[]>`
      SELECT EXTRACT(DAY FROM "createdAt")::int as day, COUNT(*)::bigint as count
      FROM leads
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      GROUP BY EXTRACT(DAY FROM "createdAt")
    `;

    const countByDay = new Map(rows.map((r) => [r.day, Number(r.count)]));
    return Array.from({ length: daysInMonth }, (_, i) => ({
      label: String(i + 1),
      count: countByDay.get(i + 1) ?? 0,
    }));
  }

  if (filter === 'monthwise' && year) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    const rows = await prisma.$queryRaw<MonthRow[]>`
      SELECT EXTRACT(MONTH FROM "createdAt")::int as month, COUNT(*)::bigint as count
      FROM leads
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      GROUP BY EXTRACT(MONTH FROM "createdAt")
    `;

    const countByMonth = new Map(rows.map((r) => [r.month, Number(r.count)]));
    return months.map((label, i) => ({
      label,
      count: countByMonth.get(i + 1) ?? 0,
    }));
  }

  return [];
}

async function fetchVisitsChartData(
  filter: unknown,
  year: number,
  month: number
): Promise<{ label: string; count: number }[]> {
  if (filter === 'daywise' && year && month) {
    const start = new Date(year, month - 1, 1);
    const end = endOfMonth(start);
    const daysInMonth = end.getDate();

    const rows = await prisma.$queryRaw<DayRow[]>`
      SELECT EXTRACT(DAY FROM "createdAt")::int as day, COUNT(*)::bigint as count
      FROM visits
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      GROUP BY EXTRACT(DAY FROM "createdAt")
    `;

    const countByDay = new Map(rows.map((r) => [r.day, Number(r.count)]));
    return Array.from({ length: daysInMonth }, (_, i) => ({
      label: String(i + 1),
      count: countByDay.get(i + 1) ?? 0,
    }));
  }

  if (filter === 'monthwise' && year) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    const rows = await prisma.$queryRaw<MonthRow[]>`
      SELECT EXTRACT(MONTH FROM "createdAt")::int as month, COUNT(*)::bigint as count
      FROM visits
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      GROUP BY EXTRACT(MONTH FROM "createdAt")
    `;

    const countByMonth = new Map(rows.map((r) => [r.month, Number(r.count)]));
    return months.map((label, i) => ({
      label,
      count: countByMonth.get(i + 1) ?? 0,
    }));
  }

  return [];
}
