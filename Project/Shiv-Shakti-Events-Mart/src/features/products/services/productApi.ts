import httpClient from '../../../shared/api/httpClient';
import type { Product, ProductImage } from '../../../shared/types/models.types';

export interface ProductQueryParams {
  category?: string;
  subcategory?: string;
  subSubcategory?: string;
  style?: string;
  search?: string;
  featured?: boolean | string;
  badge?: string;
  filterValueIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ProductPayload = Omit<Partial<Product>, 'images'> & {
  images?: Array<Partial<ProductImage> | { url: string; publicId?: string; isPrimary?: boolean; sortOrder?: number; type?: string }>;
  filterValueIds?: string[];
  badgeIds?: string[];
};

export const productApi = {
  /**
   * Public Product Fetcher
   */
  async getAll(params: ProductQueryParams = {}): Promise<PaginatedProductsResponse> {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set('category', params.category);
    if (params.subcategory) searchParams.set('subcategory', params.subcategory);
    if (params.subSubcategory) searchParams.set('subSubcategory', params.subSubcategory);
    if (params.style) searchParams.set('style', params.style);
    if (params.search) searchParams.set('search', params.search);
    if (params.featured) searchParams.set('featured', 'true');
    if (params.badge) searchParams.set('badge', params.badge);
    if (params.filterValueIds && params.filterValueIds.length > 0) {
      searchParams.set('filterValueIds', params.filterValueIds.join(','));
    }
    if (params.minPrice) searchParams.set('minPrice', String(params.minPrice));
    if (params.maxPrice) searchParams.set('maxPrice', String(params.maxPrice));
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const queryString = searchParams.toString();
    const res = await httpClient<PaginatedProductsResponse>(
      `/products${queryString ? `?${queryString}` : ''}`,
      { method: 'GET' }
    );
    return res || { products: [], total: 0, page: 1, limit: 24, totalPages: 0 };
  },

  /**
   * Get single product by ID or Slug
   */
  async getById(idOrSlug: string): Promise<Product | null> {
    const res = await httpClient<{ product: Product }>(`/products/${idOrSlug}`, { method: 'GET' });
    return res?.product || null;
  },

  /**
   * Admin: List products with all lifecycle statuses
   */
  async getAdminList(params: ProductQueryParams = {}): Promise<PaginatedProductsResponse> {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set('category', params.category);
    if (params.subcategory) searchParams.set('subcategory', params.subcategory);
    if (params.status) searchParams.set('status', params.status);
    if (params.search) searchParams.set('search', params.search);
    if (params.badge) searchParams.set('badge', params.badge);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const res = await httpClient<PaginatedProductsResponse>(
      `/products/admin/list${queryString ? `?${queryString}` : ''}`,
      { method: 'GET' }
    );
    return res || { products: [], total: 0, page: 1, limit: 50, totalPages: 0 };
  },

  /**
   * Admin: Get product by ID for editing
   */
  async getAdminById(id: string): Promise<Product | null> {
    const res = await httpClient<{ product: Product }>(`/products/admin/item/${id}`, { method: 'GET' });
    return res?.product || null;
  },

  /**
   * Admin: Create SKU
   */
  async create(data: ProductPayload): Promise<Product> {
    const res = await httpClient<{ product: Product }>('/products/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.product!;
  },

  /**
   * Admin: Update SKU
   */
  async update(id: string, data: ProductPayload): Promise<Product> {
    const res = await httpClient<{ product: Product }>(`/products/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res?.product!;
  },

  /**
   * Admin: Publish Product
   */
  async publish(id: string): Promise<Product> {
    const res = await httpClient<{ product: Product }>(`/products/admin/${id}/publish`, {
      method: 'PATCH',
    });
    return res?.product!;
  },

  /**
   * Admin: Unpublish Product
   */
  async unpublish(id: string): Promise<Product> {
    const res = await httpClient<{ product: Product }>(`/products/admin/${id}/unpublish`, {
      method: 'PATCH',
    });
    return res?.product!;
  },

  /**
   * Admin: Delete Product
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const res = await httpClient<{ success: boolean; message: string }>(`/products/admin/${id}`, {
      method: 'DELETE',
    });
    return res || { success: false, message: 'Delete failed' };
  },

  /**
   * Admin: Bulk Status Update
   */
  async bulkStatus(ids: string[], status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED'): Promise<{ count: number; status: string }> {
    const res = await httpClient<{ count: number; status: string }>('/products/admin/bulk-status', {
      method: 'POST',
      body: JSON.stringify({ ids, status }),
    });
    return res!;
  },

  /**
   * Admin: Bulk Category Update
   */
  async bulkCategory(ids: string[], payload: { categoryId?: string; subcategoryId?: string; subSubcategoryId?: string }): Promise<{ count: number }> {
    const res = await httpClient<{ count: number }>('/products/admin/bulk-category', {
      method: 'POST',
      body: JSON.stringify({ ids, ...payload }),
    });
    return res!;
  },

  /**
   * Admin: Bulk Delete
   */
  async bulkDelete(ids: string[]): Promise<{ count: number }> {
    const res = await httpClient<{ count: number }>('/products/admin/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
    return res!;
  },
};

export default productApi;
