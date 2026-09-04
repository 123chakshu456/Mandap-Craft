import httpClient from '../../../shared/api/httpClient';
import type { Category } from '../../../shared/types/models.types';

// In-memory Category Tree cache
let cachedCategories: Category[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const invalidateCategoryCache = () => {
  cachedCategories = null;
  cacheTimestamp = 0;
};

export const categoryApi = {
  /**
   * Public Category Tree with caching
   */
  async getPublicTree(forceRefresh = false): Promise<Category[]> {
    const now = Date.now();
    if (!forceRefresh && cachedCategories && now - cacheTimestamp < CACHE_TTL) {
      return cachedCategories;
    }

    const res = await httpClient<{ categories: Category[] }>('/categories', { method: 'GET' });
    cachedCategories = res?.categories || [];
    cacheTimestamp = now;
    return cachedCategories;
  },

  /**
   * Admin full category hierarchy
   */
  async getAdminTree(): Promise<Category[]> {
    const res = await httpClient<{ categories: Category[] }>('/categories/admin/tree', { method: 'GET' });
    return res?.categories || [];
  },

  async getById(id: string): Promise<Category | null> {
    const res = await httpClient<{ category: Category }>(`/categories/${id}`, { method: 'GET' });
    return res?.category || null;
  },

  async create(data: Partial<Category>): Promise<Category> {
    const res = await httpClient<{ category: Category }>('/categories/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    invalidateCategoryCache();
    return res?.category!;
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const res = await httpClient<{ category: Category }>(`/categories/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    invalidateCategoryCache();
    return res?.category!;
  },

  async toggleStatus(id: string, isActive: boolean): Promise<Category> {
    const res = await httpClient<{ category: Category }>(`/categories/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
    invalidateCategoryCache();
    return res?.category!;
  },

  async delete(id: string): Promise<void> {
    await httpClient(`/categories/admin/${id}`, { method: 'DELETE' });
    invalidateCategoryCache();
  },
};
