// =========================================================
// API CLIENT SERVICE - Backward Compatibility Bridge
// Re-exports all feature API clients and types
// =========================================================

export * from '../shared/api/httpClient';
export * from '../shared/types/models.types';

export { authApi } from '../features/auth/services/authApi';
export { categoryApi } from '../features/categories/services/categoryApi';
export { productApi } from '../features/products/services/productApi';
export { filterApi } from '../features/filters/services/filterApi';
export { badgeApi } from '../features/badges/services/badgeApi';
export { pageApi } from '../features/pages-cms/services/pageApi';
export { mediaApi } from '../features/media/services/mediaApi';
export { orderApi } from '../features/orders/services/orderApi';
export { quoteApi } from '../features/quotes/services/quoteApi';
export { adminApi } from '../features/admin/services/adminApi';

import { httpClient } from '../shared/api/httpClient';
import type { Order, Quote } from '../shared/types/models.types';

export interface SearchResults {
  orders: Order[];
  quotes: Quote[];
  posts: any[];
}

export const searchApi = {
  async search(query: string): Promise<SearchResults> {
    const res = await httpClient<SearchResults>(`/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
    return res || { orders: [], quotes: [], posts: [] };
  },
};

export const healthApi = {
  async check(): Promise<{ status: string; service: string }> {
    return httpClient<{ status: string; service: string }>('/health', { method: 'GET' });
  },
};

// Aliases for backward compatibility with existing components
export type ProductFromDB = import('../shared/types/models.types').Product;
export type OrderPayload = {
  customerName: string;
  customerEmail: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    type?: string;
    image?: string;
  }>;
  totalAmount: number;
  discountAmount?: number;
  grandTotal: number;
  paymentMethod: string;
};
export type QuotePayload = {
  email: string;
  scale: string;
  venue: string;
  drapes: string;
  estimated: number;
};
