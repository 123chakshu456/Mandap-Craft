import httpClient from '../../../shared/api/httpClient';
import type { Order, Quote } from '../../../shared/types/models.types';

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

export default searchApi;
