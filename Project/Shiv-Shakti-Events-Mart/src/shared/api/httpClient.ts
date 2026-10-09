// =========================================================
// Shared HTTP Client - Base Request Service
// Hardened against XSS attacks and session hijacking.
// Authentication tokens are maintained securely in memory
// and via HttpOnly cookies (unreadable by client-side scripts).
// Sensitive tokens are NEVER stored in persistent localStorage.
// =========================================================

let inMemoryAuthToken: string | null = null;
const LEGACY_STORAGE_KEY = 'shiv_shakti_auth_token';

// Proactively purge any historical tokens that might have been stored in localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
} catch {
  // Ignore in SSR or restricted environments
}

export const getAuthToken = (): string | null => {
  return inMemoryAuthToken;
};

export const setAuthToken = (token: string): void => {
  inMemoryAuthToken = token || null;
  // Ensure persistent storage is wiped so no XSS script can exfiltrate it
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
};

export const removeAuthToken = (): void => {
  inMemoryAuthToken = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch {
    // Ignore
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

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (networkErr: any) {
    console.error('🌐 Network Connection Error:', networkErr);
    const err = new Error(
      'Network Error: Unable to communicate with the server. Please verify your internet connection or server availability.'
    ) as any;
    err.status = 0;
    err.isNetworkError = true;
    throw err;
  }

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }

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
