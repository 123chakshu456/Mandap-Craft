import httpClient from '../../../shared/api/httpClient';
import type { Quote } from '../../../shared/types/models.types';

export const quoteApi = {
  async createQuote(payload: { email: string; scale: string; venue: string; drapes: string; estimated: number }): Promise<Quote> {
    const res = await httpClient<{ quote: Quote }>('/quotes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res?.quote!;
  },

  async getAllQuotes(page = 1, status?: string): Promise<{ quotes: Quote[]; total: number; totalPages: number }> {
    const query = new URLSearchParams({ page: String(page) });
    if (status && status !== 'all') query.set('status', status);
    const res = await httpClient<{ quotes: Quote[]; total: number; totalPages: number }>(
      `/quotes?${query}`,
      { method: 'GET' }
    );
    return res || { quotes: [], total: 0, totalPages: 0 };
  },

  async updateQuoteStatus(id: string, status: string): Promise<Quote> {
    const res = await httpClient<{ quote: Quote }>(`/quotes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res?.quote!;
  },
};
