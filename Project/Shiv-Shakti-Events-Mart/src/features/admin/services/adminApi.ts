import httpClient from '../../../shared/api/httpClient';
import type { AdminStats, Order, Quote, AuditLog } from '../../../shared/types/models.types';

export const adminApi = {
  async getStats(params: { startDate?: string; endDate?: string } = {}): Promise<{
    stats: AdminStats;
    recentOrders: Order[];
    recentQuotes: Quote[];
    dateRange?: { startDate: string | null; endDate: string | null };
  }> {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    const queryString = searchParams.toString();

    const res = await httpClient<{
      stats: AdminStats;
      recentOrders: Order[];
      recentQuotes: Quote[];
      dateRange?: { startDate: string | null; endDate: string | null };
    }>(`/admin/stats${queryString ? `?${queryString}` : ''}`, {
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

  async getAuditLogs(params: {
    limit?: number;
    entity?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<AuditLog[]> {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.entity) searchParams.set('entity', params.entity);
    if (params.action) searchParams.set('action', params.action);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.search) searchParams.set('search', params.search);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const res = await httpClient<any>(
      `/admin/audit-logs${queryString ? `?${queryString}` : ''}`,
      { method: 'GET' }
    );
    return Array.isArray(res) ? res : (res?.logs || []);
  },
};
