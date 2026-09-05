// =========================================================
// Shared HTTP Client - Base Request Service
// =========================================================

const TOKEN_STORAGE_KEY = 'shiv_shakti_auth_token';

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
    console.error('Failed to save auth token:', err);
  }
};

export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to remove auth token:', err);
  }
};

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

/**
 * Generic Fetch Wrapper with auto-token injection, credentials inclusion, and standardized error parsing.
 */
export async function httpClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Include HTTP-only cookies
  };

  // Prepend /api if not already present, with optional base URL for production cloud hosting
  const apiBase = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, '') : '';
  const path = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
  const url = apiBase ? `${apiBase}${path}` : path;

  const response = await fetch(url, config);
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = json?.message || json?.error || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg) as any;
    err.status = response.status;
    err.errors = json?.errors;
    throw err;
  }

  // Return data wrapper if structured
  return (json.data !== undefined ? json.data : json) as T;
}

export default httpClient;
