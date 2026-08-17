// =========================================================
// API CLIENT SERVICE - Mandap-Craft Frontend to Backend
// =========================================================

const TOKEN_STORAGE_KEY = 'mandap_craft_auth_token';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface OrderItemPayload {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type?: 'events' | 'boutique';
  image?: string;
}

export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  items: OrderItemPayload[];
  totalAmount: number;
  discountAmount?: number;
  grandTotal: number;
  paymentMethod: string;
}

export interface QuotePayload {
  email: string;
  scale: string;
  venue: string;
  drapes: string;
  estimated: number;
}

// Token helper methods
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (err) {
    console.error('Failed to save token to localStorage:', err);
  }
};

export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to remove token from localStorage:', err);
  }
};

// Generic Fetch Wrapper
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Support HTTP cookies
  };

  // Prepend /api if not present
  const url = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

// ==========================================
// Authentication API
// ==========================================
export const authApi = {
  async register(payload: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data!;
  },

  async login(payload: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data!;
  },

  async googleLogin(credential: string): Promise<{ user: User; token: string }> {
    const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });

    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data!;
  },

  async getGoogleClientId(): Promise<string> {
    const res = await request<ApiResponse<{ clientId: string }>>('/auth/google-client-id', {
      method: 'GET',
    });
    return res.data?.clientId || '';
  },



  async getMe(): Promise<User | null> {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const res = await request<ApiResponse<{ user: User }>>('/auth/me', {
        method: 'GET',
      });
      return res.data?.user || null;
    } catch {
      removeAuthToken();
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await request<ApiResponse>('/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      removeAuthToken();
    }
  },
};

// ==========================================
// Orders API
// ==========================================
export const orderApi = {
  async createOrder(payload: OrderPayload): Promise<any> {
    const res = await request<ApiResponse<{ order: any }>>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data?.order;
  },

  async getMyOrders(): Promise<any[]> {
    const res = await request<ApiResponse<{ orders: any[] }>>('/orders/my-orders', {
      method: 'GET',
    });
    return res.data?.orders || [];
  },
};

// ==========================================
// Quotes API
// ==========================================
export const quoteApi = {
  async createQuote(payload: QuotePayload): Promise<any> {
    const res = await request<ApiResponse<{ quote: any }>>('/quotes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data?.quote;
  },
};

// ==========================================
// Health API
// ==========================================
export const healthApi = {
  async check(): Promise<{ status: string; message: string }> {
    return request<{ status: string; message: string }>('/health', {
      method: 'GET',
    });
  },
};

// ==========================================
// Search API
// ==========================================
export interface SearchResults {
  orders: any[];
  quotes: any[];
  posts: any[];
}

export const searchApi = {
  async search(query: string): Promise<SearchResults> {
    const res = await request<ApiResponse<SearchResults>>(`/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
    return res.data || { orders: [], quotes: [], posts: [] };
  },
};

