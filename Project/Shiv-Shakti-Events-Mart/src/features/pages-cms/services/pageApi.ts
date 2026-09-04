import httpClient from '../../../shared/api/httpClient';
import type { Page } from '../../../shared/types/models.types';

export const pageApi = {
  /**
   * Public: List all published pages
   */
  async getPublicPages(): Promise<Page[]> {
    const res = await httpClient<{ pages: Page[] }>('/pages', { method: 'GET' });
    return res?.pages || [];
  },

  /**
   * Public: Get single page by slug
   */
  async getBySlug(slug: string): Promise<Page | null> {
    const res = await httpClient<{ page: Page }>(`/pages/slug/${slug}`, { method: 'GET' });
    return res?.page || null;
  },

  /**
   * Admin: List all pages (including drafts)
   */
  async getAdminPages(status?: string): Promise<Page[]> {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    const res = await httpClient<{ pages: Page[] }>(`/pages/admin/list${query}`, { method: 'GET' });
    return res?.pages || [];
  },

  /**
   * Admin: Get page by ID
   */
  async getAdminById(id: string): Promise<Page | null> {
    const res = await httpClient<{ page: Page }>(`/pages/admin/item/${id}`, { method: 'GET' });
    return res?.page || null;
  },

  /**
   * Admin: Create page
   */
  async create(data: Partial<Page>): Promise<Page> {
    const res = await httpClient<{ page: Page }>('/pages/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.page!;
  },

  /**
   * Admin: Update page
   */
  async update(id: string, data: Partial<Page>): Promise<Page> {
    const res = await httpClient<{ page: Page }>(`/pages/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res?.page!;
  },

  /**
   * Admin: Publish page
   */
  async publish(id: string): Promise<Page> {
    const res = await httpClient<{ page: Page }>(`/pages/admin/${id}/publish`, {
      method: 'PATCH',
    });
    return res?.page!;
  },

  /**
   * Admin: Unpublish page
   */
  async unpublish(id: string): Promise<Page> {
    const res = await httpClient<{ page: Page }>(`/pages/admin/${id}/unpublish`, {
      method: 'PATCH',
    });
    return res?.page!;
  },

  /**
   * Admin: Delete page
   */
  async delete(id: string): Promise<void> {
    await httpClient(`/pages/admin/${id}`, { method: 'DELETE' });
  },
};
