import httpClient from '../../../shared/api/httpClient';
import type { Badge } from '../../../shared/types/models.types';

export const badgeApi = {
  async getPublicBadges(): Promise<Badge[]> {
    const res = await httpClient<{ badges: Badge[] }>('/badges', { method: 'GET' });
    return res?.badges || [];
  },

  async getAdminBadges(): Promise<Badge[]> {
    const res = await httpClient<{ badges: Badge[] }>('/badges/admin/list', { method: 'GET' });
    return res?.badges || [];
  },

  async create(data: Partial<Badge>): Promise<Badge> {
    const res = await httpClient<{ badge: Badge }>('/badges/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.badge!;
  },

  async update(id: string, data: Partial<Badge>): Promise<Badge> {
    const res = await httpClient<{ badge: Badge }>(`/badges/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res?.badge!;
  },

  async delete(id: string): Promise<void> {
    await httpClient(`/badges/admin/${id}`, { method: 'DELETE' });
  },
};
