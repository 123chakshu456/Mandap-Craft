import httpClient from '../../../shared/api/httpClient';
import type { CarouselSlide } from '../../../shared/types/models.types';

export const carouselApi = {
  /**
   * Public: Fetch active slides for storefront
   */
  async getPublicSlides(): Promise<CarouselSlide[]> {
    const res = await httpClient<{ slides: CarouselSlide[] }>('/carousel/slides', { method: 'GET' });
    return res?.slides || [];
  },

  /**
   * Admin: Fetch all slides (active & inactive)
   */
  async getAdminSlides(): Promise<CarouselSlide[]> {
    const res = await httpClient<{ slides: CarouselSlide[] }>('/carousel/admin/slides', { method: 'GET' });
    return res?.slides || [];
  },

  /**
   * Admin: Create slide
   */
  async createSlide(data: Partial<CarouselSlide>): Promise<CarouselSlide> {
    const res = await httpClient<{ slide: CarouselSlide }>('/carousel/admin/slides', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.slide!;
  },

  /**
   * Admin: Update slide
   */
  async updateSlide(id: string, data: Partial<CarouselSlide>): Promise<CarouselSlide> {
    const res = await httpClient<{ slide: CarouselSlide }>(`/carousel/admin/slides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res?.slide!;
  },

  /**
   * Admin: Delete slide
   */
  async deleteSlide(id: string): Promise<void> {
    await httpClient(`/carousel/admin/slides/${id}`, { method: 'DELETE' });
  },

  /**
   * Admin: Toggle slide active status
   */
  async toggleSlideActive(id: string): Promise<CarouselSlide> {
    const res = await httpClient<{ slide: CarouselSlide }>(`/carousel/admin/slides/${id}/toggle`, {
      method: 'PATCH',
    });
    return res?.slide!;
  },

  /**
   * Admin: Reorder slides
   */
  async reorderSlides(items: { id: string; sortOrder: number }[]): Promise<CarouselSlide[]> {
    const res = await httpClient<{ slides: CarouselSlide[] }>('/carousel/admin/slides/reorder', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    return res?.slides || [];
  },
};
