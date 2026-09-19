import { getAuthToken } from '../../../shared/api/httpClient';
import type { ProductImage, MediaAsset } from '../../../shared/types/models.types';

const getApiBase = (): string => {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
    ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, '')
    : '';
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://shiv-shakti-events-mart.onrender.com';
  }
  return '';
};

const getMediaEndpoint = (path: string): string => {
  const base = getApiBase();
  const cleanPath = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? path : `/${path}`}`;
  return base ? `${base}${cleanPath}` : cleanPath;
};

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

    const url = getMediaEndpoint(`/media?${params.toString()}`);
    const response = await fetch(url, {
      headers: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {},
      credentials: 'include',
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch media assets.');
    return json.data;
  },

  /**
   * Delete media asset from DB and Cloudinary
   */
  async deleteMediaAsset(id: string): Promise<void> {
    const url = getMediaEndpoint(`/media/${id}`);
    const response = await fetch(url, {
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
   * Upload image directly to Cloudinary or local media library via backend stream
   */
  async uploadImage(file: File, folder = 'shiv-shakti-events', altText = ''): Promise<{ url: string; publicId: string; width: number; height: number; asset?: MediaAsset }> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    if (altText) formData.append('altText', altText);

    const url = getMediaEndpoint('/media/upload');

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        credentials: 'include',
      });
    } catch (networkErr: any) {
      throw new Error('Network error: Unable to reach the server to upload the image. Please verify your connection.');
    }

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again to upload media.');
      }
      if (response.status === 403) {
        throw new Error('Administrator privileges are required to upload images.');
      }
      if (response.status === 413) {
        throw new Error('File is too large. Maximum allowed file size is 15MB.');
      }
      throw new Error(json?.message || `Image upload failed (Error code: ${response.status}).`);
    }
    return json.data;
  },

  async addProductImage(productId: string, data: Partial<ProductImage>): Promise<ProductImage> {
    const url = getMediaEndpoint(`/media/products/${productId}/images`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(json?.message || 'Failed to add image.');
    return json.data.image;
  },

  async updateProductImage(productId: string, imageId: string, data: Partial<ProductImage>): Promise<ProductImage> {
    const url = getMediaEndpoint(`/media/products/${productId}/images/${imageId}`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(json?.message || 'Failed to update image.');
    return json.data.image;
  },

  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    const url = getMediaEndpoint(`/media/products/${productId}/images/${imageId}`);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {},
      credentials: 'include',
    });
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      throw new Error(json?.message || 'Failed to delete image.');
    }
  },

  async reorderProductImages(productId: string, imageIds: string[]): Promise<void> {
    const url = getMediaEndpoint(`/media/products/${productId}/images/reorder`);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
      body: JSON.stringify({ imageIds }),
      credentials: 'include',
    });
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      throw new Error(json?.message || 'Failed to reorder images.');
    }
  },
};
