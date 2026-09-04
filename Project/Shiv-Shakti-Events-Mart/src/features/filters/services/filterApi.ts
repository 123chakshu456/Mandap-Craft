import httpClient from '../../../shared/api/httpClient';
import type { Filter, FilterValue } from '../../../shared/types/models.types';

export const filterApi = {
  /**
   * Public: Get active filters (optionally by category)
   */
  async getPublicFilters(category?: string): Promise<Filter[]> {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    const res = await httpClient<{ filters: Filter[] }>(`/filters${query}`, { method: 'GET' });
    return res?.filters || [];
  },

  /**
   * Admin: Get all filters
   */
  async getAdminFilters(): Promise<Filter[]> {
    const res = await httpClient<{ filters: Filter[] }>('/filters/admin/list', { method: 'GET' });
    return res?.filters || [];
  },

  async create(data: Partial<Filter>): Promise<Filter> {
    const res = await httpClient<{ filter: Filter }>('/filters/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.filter!;
  },

  async update(id: string, data: Partial<Filter>): Promise<Filter> {
    const res = await httpClient<{ filter: Filter }>(`/filters/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res?.filter!;
  },

  async delete(id: string): Promise<void> {
    await httpClient(`/filters/admin/${id}`, { method: 'DELETE' });
  },

  async addValue(filterId: string, data: { label: string; value?: string; sortOrder?: number }): Promise<FilterValue> {
    const res = await httpClient<{ value: FilterValue }>(`/filters/admin/${filterId}/values`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.value!;
  },

  async updateValue(filterId: string, valueId: string, data: { label?: string; value?: string; sortOrder?: number }): Promise<FilterValue> {
    const res = await httpClient<{ value: FilterValue }>(`/filters/admin/${filterId}/values/${valueId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res?.value!;
  },

  async deleteValue(filterId: string, valueId: string): Promise<void> {
    await httpClient(`/filters/admin/${filterId}/values/${valueId}`, { method: 'DELETE' });
  },
};
