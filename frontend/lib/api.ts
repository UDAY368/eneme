const PRODUCTION_API = 'https://eneme-production.up.railway.app/api';

function getApiBaseUrl(): string {
  let url = (process.env.NEXT_PUBLIC_API_URL || '').trim();
  if (!url) {
    if (typeof window !== 'undefined' && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(window.location.origin)) {
      return PRODUCTION_API;
    }
    url = 'http://localhost:4000';
  }
  url = url.replace(/\/+$/, '') || 'http://localhost:4000';
  if (!url.endsWith('/api')) url = `${url}/api`;
  return url;
}

export function sanitizeVideoUrl(url: string): string {
  if (!url?.trim()) return url;
  let u = url.trim();
  u = u.replace(/^www\.(https?:\/\/)/i, '$1');
  u = u.replace(/(https?:\/\/)www\.\1/gi, '$1www.');
  u = u.replace(/^(https?)\1*:\/\//i, '$1://');
  u = u.replace(/^(https?:\/\/)https?:\/\//i, '$1');
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u.replace(/^\/+/, '');
  return u;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('eneme_admin_token');
}

export async function api<T>(
  path: string,
  options: RequestInit & { requiresAuth?: boolean } = {}
): Promise<T> {
  const { requiresAuth = false, ...fetchOptions } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, { ...fetchOptions, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = err.error || `API error: ${res.status}`;
    const isAuthError = res.status === 401 || /invalid|expired/i.test(String(message));
    if (isAuthError && typeof window !== 'undefined') {
      localStorage.removeItem('eneme_admin_token');
      localStorage.removeItem('eneme_admin_user');
      window.location.href = '/admin/login';
      return new Promise(() => {}) as Promise<T>;
    }
    throw new Error(message);
  }
  if (res.status === 204) return {} as T;
  return res.json();
}

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    api<{ token: string; user: { id: string; username: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};

// Analytics
export const analyticsApi = {
  getSummary: () =>
    api<{ totalVisits: number; totalLeads: number }>('/analytics/summary', { requiresAuth: true }),
  get: (params?: { filter?: string; year?: number; month?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<{
      totalVisits: number;
      totalLeads: number;
      chartData: { leads: { label: string; count: number }[]; visits: { label: string; count: number }[] };
    }>(`/analytics?${q}`, { requiresAuth: true });
  },
};

// Visits (public)
export const visitsApi = {
  track: () => api<{ success: boolean }>('/visits', { method: 'POST' }),
};

// Leads
export const leadsApi = {
  create: (data: { name: string; email: string; phone?: string; company?: string; projectType?: string; message?: string }) =>
    api('/leads', { method: 'POST', body: JSON.stringify(data) }),
  get: (params?: { filter?: string; reviewed?: string; year?: number; month?: number; page?: number; limit?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<{ leads: Lead[]; totalCount: number }>(`/leads?${q}`, { requiresAuth: true });
  },
  getCount: () => api<{ totalCount: number }>('/leads/count', { requiresAuth: true }),
  markReviewed: (id: string) =>
    api<Lead>(`/leads/${id}/review`, { method: 'PATCH', requiresAuth: true }),
  delete: (id: string) =>
    api(`/leads/${id}`, { method: 'DELETE', requiresAuth: true }),
};

// Portfolio
export const portfolioApi = {
  getCategories: () => api<PortfolioCategory[]>('/portfolio/categories'),
  getSubCategories: (categoryId?: string) =>
    api<PortfolioSubCategory[]>(`/portfolio/subcategories${categoryId ? `?categoryId=${categoryId}` : ''}`),
  getStats: () =>
    api<{ totalPortfolios: number; totalCategories: number; totalSubCategories: number }>('/portfolio/stats'),
  getAll: (params?: { categoryId?: string; subCategoryId?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<Portfolio[]>(`/portfolio${q ? `?${q}` : ''}`);
  },
  getById: (id: string) => api<Portfolio>(`/portfolio/${id}`),
  createCategory: (name: string) =>
    api<PortfolioCategory>('/portfolio/categories', { method: 'POST', body: JSON.stringify({ name }), requiresAuth: true }),
  updateCategory: (id: string, name: string) =>
    api<PortfolioCategory>(`/portfolio/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name }), requiresAuth: true }),
  deleteCategory: (id: string) =>
    api(`/portfolio/categories/${id}`, { method: 'DELETE', requiresAuth: true }),
  createSubCategory: (categoryId: string, name: string) =>
    api<PortfolioSubCategory>('/portfolio/subcategories', {
      method: 'POST',
      body: JSON.stringify({ categoryId, name }),
      requiresAuth: true,
    }),
  updateSubCategory: (id: string, name: string) =>
    api<PortfolioSubCategory>(`/portfolio/subcategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
      requiresAuth: true,
    }),
  deleteSubCategory: (id: string) =>
    api(`/portfolio/subcategories/${id}`, { method: 'DELETE', requiresAuth: true }),
  create: (data: PortfolioInput) =>
    api<Portfolio>('/portfolio', { method: 'POST', body: JSON.stringify(data), requiresAuth: true }),
  update: (id: string, data: Partial<PortfolioInput>) =>
    api<Portfolio>(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(data), requiresAuth: true }),
  delete: (id: string) =>
    api(`/portfolio/${id}`, { method: 'DELETE', requiresAuth: true }),
};

// Blog
export const blogApi = {
  getAll: () => api<Blog[]>('/blog'),
  getList: () =>
    api<{ blogs: Omit<Blog, 'content'>[]; totalBlogs: number }>('/blog/list'),
  getById: (id: string) => api<Blog>(`/blog/${id}`),
  getCount: () => api<{ totalBlogs: number }>('/blog/count'),
  create: (data: BlogInput) =>
    api<Blog>('/blog', { method: 'POST', body: JSON.stringify(data), requiresAuth: true }),
  update: (id: string, data: Partial<BlogInput>) =>
    api<Blog>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data), requiresAuth: true }),
  delete: (id: string) =>
    api(`/blog/${id}`, { method: 'DELETE', requiresAuth: true }),
};

// Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectType: string | null;
  message: string | null;
  reviewed: boolean;
  createdAt: string;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  _count?: { subCategories: number; portfolios: number };
}

export interface PortfolioSubCategory {
  id: string;
  categoryId: string;
  name: string;
  category?: { name: string };
}

export interface Portfolio {
  id: string;
  categoryId: string;
  subCategoryId: string;
  imageUrl: string | null;
  videoUrl: string | null;
  year: string | null;
  heading: string;
  description: string | null;
  company: string | null;
  chips: string[];
  category?: { name: string };
  subCategory?: { name: string };
}

export interface PortfolioInput {
  categoryId: string;
  subCategoryId: string;
  imageUrl?: string;
  videoUrl?: string;
  year?: string;
  heading: string;
  description?: string;
  company?: string;
  chips?: string[];
}

export interface Blog {
  id: string;
  chipTitle: string | null;
  blogTitle: string;
  blogDescription: string | null;
  date: string;
  timeToRead: string | null;
  imageUrl: string | null;
  content: string;
}

export interface BlogInput {
  chipTitle?: string;
  blogTitle: string;
  blogDescription?: string;
  date?: string;
  timeToRead?: string;
  imageUrl?: string;
  content?: string;
}
