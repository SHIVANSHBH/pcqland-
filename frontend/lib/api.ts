const API_BASE: string = process.env.NEXT_PUBLIC_API_URL || '/api';

let _csrfToken: string | null = null;
let _csrfPromise: Promise<string | null> | null = null;
let _refreshPromise: Promise<boolean> | null = null;

function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try { return localStorage.getItem('accessToken'); } catch { return null; }
}

export function setAccessToken(token: string | null) {
  if (typeof localStorage === 'undefined') return;
  try { if (token) localStorage.setItem('accessToken', token); else localStorage.removeItem('accessToken'); } catch {}
}

function getRefreshToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try { return localStorage.getItem('refreshToken'); } catch { return null; }
}

export function setRefreshToken(token: string | null) {
  if (typeof localStorage === 'undefined') return;
  try { if (token) localStorage.setItem('refreshToken', token); else localStorage.removeItem('refreshToken'); } catch {}
}

export function clearAuth() {
  setAccessToken(null);
  setRefreshToken(null);
  if (typeof sessionStorage !== 'undefined') {
    try { sessionStorage.removeItem('_auth_me'); sessionStorage.removeItem('_settings'); } catch {}
  }
}

async function attemptRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.data?.accessToken) {
      setAccessToken(data.data.accessToken);
      if (data.data.refreshToken) setRefreshToken(data.data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function fetchCsrfToken(): Promise<string | null> {
  if (typeof document === 'undefined') return null;
  if (_csrfToken) return _csrfToken;
  if (_csrfPromise) return _csrfPromise;
  _csrfPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/csrf`, { credentials: 'include' });
      const data = await res.json();
      _csrfToken = data.csrfToken || null;
      return _csrfToken;
    } catch {
      return _csrfToken || null;
    }
  })();
  return _csrfPromise;
}

function getCsrfTokenSync(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function getCsrfToken(): Promise<string | null> {
  const syncToken = getCsrfTokenSync();
  if (syncToken) return syncToken;
  return fetchCsrfToken();
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const isDangerous = /^(post|put|patch|delete)$/i.test(options.method || 'get');
  if (isDangerous) {
    const csrf = await getCsrfToken();
    if (csrf) headers['x-csrf-token'] = csrf;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }));
      if (res.status === 401 && error.code === 'TOKEN_EXPIRED') {
        if (!_refreshPromise) _refreshPromise = attemptRefresh();
        const refreshed = await _refreshPromise;
        _refreshPromise = null;
        if (refreshed) {
          const newToken = getAccessToken();
          if (newToken) headers['Authorization'] = `Bearer ${newToken}`;
          const retryRes = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
            credentials: 'include',
          });
          if (!retryRes.ok) {
            const retryError = await retryRes.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(retryError.message || 'Request failed');
          }
          return retryRes.json();
        }
        clearAuth();
      }
      throw new Error(error.message || 'Request failed');
    }
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  get: (endpoint: string): Promise<any> => fetchAPI(endpoint),
  post: (endpoint: string, data: any): Promise<any> => fetchAPI(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: any): Promise<any> => fetchAPI(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string): Promise<any> => fetchAPI(endpoint, { method: 'DELETE' }),
};

export default API_BASE;
