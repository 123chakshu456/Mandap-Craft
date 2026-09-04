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

  async getAllOrders(page = 1, status?: string): Promise<{ orders: Order[]; total: number; totalPages: number }> {
    const query = new URLSearchParams({ page: String(page) });
    if (status && status !== 'all') query.set('status', status);
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
};
