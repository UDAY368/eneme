/**
 * Client-side cache with prefetch for Portfolio and Blog.
 * Used to show data instantly when navigating after hover-prefetch.
 */

const TTL_MS = 2 * 60 * 1000; // 2 minutes

// Portfolio cache
let portfolioCache:
  | {
      categories: unknown[];
      subCategories: unknown[];
      portfolios: unknown[];
      ts: number;
    }
  | null = null;

// Blog cache
let blogCache: { blogs: unknown[]; ts: number } | null = null;

function isFresh<T>(entry: { ts: number } | null): entry is T {
  return entry !== null && Date.now() - entry.ts < TTL_MS;
}

export const prefetchCache = {
  getPortfolio() {
    if (isFresh<NonNullable<typeof portfolioCache>>(portfolioCache)) {
      return portfolioCache;
    }
    return null;
  },

  setPortfolio(data: { categories: unknown[]; subCategories: unknown[]; portfolios: unknown[] }) {
    portfolioCache = { ...data, ts: Date.now() };
  },

  getBlog() {
    if (isFresh<NonNullable<typeof blogCache>>(blogCache)) {
      return blogCache;
    }
    return null;
  },

  setBlog(data: { blogs: unknown[] }) {
    blogCache = { ...data, ts: Date.now() };
  },

  clearPortfolio() {
    portfolioCache = null;
  },

  clearBlog() {
    blogCache = null;
  },
};
