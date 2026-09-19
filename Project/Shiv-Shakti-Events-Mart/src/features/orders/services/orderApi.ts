import httpClient from '../../../shared/api/httpClient';
import type { Order } from '../../../shared/types/models.types';

export const orderApi = {
  async createOrder(payload: any): Promise<Order> {
    const res = await httpClient<{ order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res?.order!;
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await httpClient<{ orders: Order[] }>('/orders/my-orders', {
      method: 'GET',
    });
    return res?.orders || [];
  },

  async getAllOrders(
    paramsOrPage:
      | number
      | {
          page?: number;
          limit?: number;
          status?: string;
          startDate?: string;
          endDate?: string;
          search?: string;
          sortBy?: string;
          sortOrder?: 'asc' | 'desc';
        } = 1,
    legacyStatus?: string
  ): Promise<{ orders: Order[]; total: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (typeof paramsOrPage === 'number') {
      query.set('page', String(paramsOrPage));
      if (legacyStatus && legacyStatus !== 'all') query.set('status', legacyStatus);
    } else {
      if (paramsOrPage.page) query.set('page', String(paramsOrPage.page));
      if (paramsOrPage.limit) query.set('limit', String(paramsOrPage.limit));
      if (paramsOrPage.status && paramsOrPage.status !== 'all') query.set('status', paramsOrPage.status);
      if (paramsOrPage.startDate) query.set('startDate', paramsOrPage.startDate);
      if (paramsOrPage.endDate) query.set('endDate', paramsOrPage.endDate);
      if (paramsOrPage.search) query.set('search', paramsOrPage.search);
      if (paramsOrPage.sortBy) query.set('sortBy', paramsOrPage.sortBy);
      if (paramsOrPage.sortOrder) query.set('sortOrder', paramsOrPage.sortOrder);
    }
    const res = await httpClient<{ orders: Order[]; total: number; totalPages: number }>(
      `/orders?${query}`,
      { method: 'GET' }
    );
    return res || { orders: [], total: 0, totalPages: 0 };
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const res = await httpClient<{ order: Order }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res?.order!;
  },

  async deleteOrder(id: string): Promise<void> {
    await httpClient(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};
