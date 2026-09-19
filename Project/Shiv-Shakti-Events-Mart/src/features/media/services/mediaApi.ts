import { getAuthToken } from '../../../shared/api/httpClient';
import type { ProductImage, MediaAsset } from '../../../shared/types/models.types';

export const mediaApi = {
  /**
   * Fetch paginated media assets from database
   */
  async getMediaAssets(
    query: {
      page?: number;
      limit?: number;
      search?: string;
      folder?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<{
    assets: MediaAsset[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', String(query.page));
    if (query.limit) params.append('limit', String(query.limit));
    if (query.search) params.append('search', query.search);
    if (query.folder) params.append('folder', query.folder);
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);

    const response = await fetch(`/api/media?${params.toString()}`, {
      headers: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {},
      credentials: 'include',
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch media assets.');
    return json.data;
  },

  /**
   * Delete media asset from DB and Cloudinary
   */
  async deleteMediaAsset(id: string): Promise<void> {
    const response = await fetch(`/api/media/${id}`, {
      method: 'DELETE',
      headers: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {},
      credentials: 'include',
    });
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      throw new Error(json?.message || 'Failed to delete media asset.');
    }
  },

  /**
   * Upload image directly to Cloudinary via backend stream
   */
  async uploadImage(file: File, folder = 'shiv-shakti-events', altText = ''): Promise<{ url: string; publicId: string; width: number; height: number; asset?: MediaAsset }> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    if (altText) formData.append('altText', altText);

    const response = await fetch('/api/media/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      credentials: 'include',
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(json?.message || 'Image upload failed.');
    }
    return json.data;
  },

  async addProductImage(productId: string, data: Partial<ProductImage>): Promise<ProductImage> {
    const response = await fetch(`/api/media/products/${productId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to add image.');
    return json.data.image;
  },

  async updateProductImage(productId: string, imageId: string, data: Partial<ProductImage>): Promise<ProductImage> {
    const response = await fetch(`/api/media/products/${productId}/images/${imageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to update image.');
    return json.data.image;
  },

  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    const response = await fetch(`/api/media/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
      headers: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {},
      credentials: 'include',
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json?.message || 'Failed to delete image.');
    }
  },

  async reorderProductImages(productId: string, imageIds: string[]): Promise<void> {
    const response = await fetch(`/api/media/products/${productId}/images/reorder`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
      body: JSON.stringify({ imageIds }),
      credentials: 'include',
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json?.message || 'Failed to reorder images.');
    }
  },
};
