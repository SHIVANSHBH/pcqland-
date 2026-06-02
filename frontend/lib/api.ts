const API_BASE: string = process.env.NEXT_PUBLIC_API_URL || 'https://pcdeals-backend.onrender.com/api';

let _csrfToken: string | null = null;
let _csrfFetching = false;
let _csrfPromise: Promise<string | null> | null = null;

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
