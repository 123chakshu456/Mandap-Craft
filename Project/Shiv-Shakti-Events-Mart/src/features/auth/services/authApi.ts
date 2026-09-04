import httpClient, { setAuthToken, removeAuthToken } from '../../../shared/api/httpClient';
import type { User } from '../../../shared/types/models.types';

export const authApi = {
  async register(payload: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await httpClient<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async login(payload: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await httpClient<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async googleLogin(credential: string): Promise<{ user: User; token: string }> {
    const res = await httpClient<{ user: User; token: string }>('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    if (res?.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async getGoogleClientId(): Promise<string> {
    const res = await httpClient<{ clientId: string }>('/auth/google-client-id', {
      method: 'GET',
    });
    return res?.clientId || '';
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await httpClient<{ user: User }>('/auth/me', {
        method: 'GET',
      });
      return res?.user || null;
    } catch {
      removeAuthToken();
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await httpClient('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      removeAuthToken();
    }
  },
};
