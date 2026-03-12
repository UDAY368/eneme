/**
 * Prefetch Portfolio and Blog data on nav link hover for instant load on click.
 */

import { portfolioApi, blogApi } from './api';
import { prefetchCache } from './prefetch-cache';

let portfolioPrefetching = false;
let blogPrefetching = false;

export function prefetchPortfolio() {
  if (portfolioPrefetching || prefetchCache.getPortfolio()) return;
  portfolioPrefetching = true;
  Promise.all([
    portfolioApi.getCategories(),
    portfolioApi.getSubCategories(),
    portfolioApi.getAll(),
  ])
    .then(([categories, subCategories, portfolios]) => {
      prefetchCache.setPortfolio({ categories, subCategories, portfolios });
    })
    .catch(() => {})
    .finally(() => {
      portfolioPrefetching = false;
    });
}

export function prefetchBlog() {
  if (blogPrefetching || prefetchCache.getBlog()) return;
  blogPrefetching = true;
  blogApi
    .getList()
    .then(({ blogs }) => {
      prefetchCache.setBlog({ blogs });
    })
    .catch(() => {})
    .finally(() => {
      blogPrefetching = false;
    });
}
