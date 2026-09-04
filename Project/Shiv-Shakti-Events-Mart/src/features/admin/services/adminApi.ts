import httpClient from '../../../shared/api/httpClient';
import type { AdminStats, Order, Quote } from '../../../shared/types/models.types';

export const adminApi = {
  async getStats(): Promise<{ stats: AdminStats; recentOrders: Order[]; recentQuotes: Quote[] }> {
    const res = await httpClient<{ stats: AdminStats; recentOrders: Order[]; recentQuotes: Quote[] }>('/admin/stats', {
      method: 'GET',
    });
    return res || {
      stats: {
        totalProducts: 0,
        publishedProducts: 0,
        draftProducts: 0,
        totalOrders: 0,
        totalQuotes: 0,
        pendingQuotes: 0,
        totalUsers: 0,
        totalCategories: 0,
        totalRevenue: 0,
      },
      recentOrders: [],
      recentQuotes: [],
    };
  },
};
