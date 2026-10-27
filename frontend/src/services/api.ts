import auth, { getAccessToken } from './auth';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// Helper function to refresh expired access token
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = auth.getRefreshToken();
  if (!refreshToken) return false;

  try {
    await auth.refreshToken();
    //return getAccessToken();
    return true;
  } catch (err) {
    console.error('Failed to refresh token: ', err);
    return false;
  }
}

// Central API client wrapper for fetch
export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = auth.getAccessToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  options.headers = headers;
  let response = await fetch(url, options);

  // If token is expired (401), attempt to refresh and retry once
  if (response.status === 401 && auth.getRefreshToken()) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      options.headers = headers;
      response = await fetch(url, options);
    }
  }

  return response;
}

// other authentication methods
async function doRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;
  refreshPromise = auth.refreshToken()
    .then(() => {
      isRefreshing = false;
      return true;
    })
    .catch((err) => {
      isRefreshing = false;
      refreshPromise = null;
      throw err;
    });
  return true;
}

async function getRefreshedToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  await refreshPromise;
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error('No access token after refresh');
  return accessToken;
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const method = (init.method || 'GET').toUpperCase();
  const access = auth.getAccessToken();

  const createHeaders = (token: string | null): Headers => {
    const h = new Headers(init.headers || {});
    if (token) {
      h.set('Authorization', `Bearer ${token}`);
    } else {
      h.delete('Authorization');
    }
    if (!h.has('Accept')) {
      h.set('Accept', 'application/json');
    }
    return h;
  };

  const initialReq = input instanceof Request ? input.clone() : input;
  const response = await fetch(initialReq, { ...init, headers: createHeaders(access) });

  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  if (response.status !== 401 || !auth.getRefreshToken() || isMutation) {
    return response;
  }

  try {
    const newAccess = await getRefreshedToken();
    const retryReq = input instanceof Request ? input.clone() : input;
    return await fetch(retryReq, { ...init, headers: createHeaders(newAccess) });
  } catch (err) {
    console.error('Token refresh failed:', err);
    return response;
  }
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await authFetch(path, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function apiPost<T = any>(path: string, body: any): Promise<T> {
  const res = await authFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (null as any);
}

export async function apiPut<T = any>(path: string, body: any): Promise<T> {
  const res = await authFetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (null as any);
}

export async function apiDelete<T = any>(path: string, id: number): Promise<T> {
  const res = await authFetch(`${path}/${id}/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (null as any);
}

export default { authFetch, apiGet, apiPost, apiPut, apiDelete };
