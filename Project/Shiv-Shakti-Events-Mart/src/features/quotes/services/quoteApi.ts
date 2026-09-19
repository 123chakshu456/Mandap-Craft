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

  async getAllQuotes(
    paramsOrPage:
      | number
      | {
          page?: number;
          limit?: number;
          status?: string;
          startDate?: string;
          endDate?: string;
          search?: string;
          sortBy?: string;
          sortOrder?: 'asc' | 'desc';
        } = 1,
    legacyStatus?: string
  ): Promise<{ quotes: Quote[]; total: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (typeof paramsOrPage === 'number') {
      query.set('page', String(paramsOrPage));
      if (legacyStatus && legacyStatus !== 'all') query.set('status', legacyStatus);
    } else {
      if (paramsOrPage.page) query.set('page', String(paramsOrPage.page));
      if (paramsOrPage.limit) query.set('limit', String(paramsOrPage.limit));
      if (paramsOrPage.status && paramsOrPage.status !== 'all') query.set('status', paramsOrPage.status);
      if (paramsOrPage.startDate) query.set('startDate', paramsOrPage.startDate);
      if (paramsOrPage.endDate) query.set('endDate', paramsOrPage.endDate);
      if (paramsOrPage.search) query.set('search', paramsOrPage.search);
      if (paramsOrPage.sortBy) query.set('sortBy', paramsOrPage.sortBy);
      if (paramsOrPage.sortOrder) query.set('sortOrder', paramsOrPage.sortOrder);
    }
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

  async deleteQuote(id: string): Promise<void> {
    await httpClient(`/quotes/${id}`, {
      method: 'DELETE',
    });
  },
};
