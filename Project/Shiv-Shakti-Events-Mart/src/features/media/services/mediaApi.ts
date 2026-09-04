import { getAuthToken } from '../../../shared/api/httpClient';
import type { ProductImage } from '../../../shared/types/models.types';

export const mediaApi = {
  /**
   * Upload image directly to Cloudinary via backend stream
   */
  async uploadImage(file: File, folder = 'shiv-shakti-events'): Promise<{ url: string; publicId: string; width: number; height: number }> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

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
