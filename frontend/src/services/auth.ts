import type { User } from '../interfaces/interfaces';

/* Simple JWT auth helper: store tokens, login, refresh */
export interface TokenPair {
  access: string;
  refresh: string;
}

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
}

const ACCESS_KEY = 'auth.access';
const REFRESH_KEY = 'auth.refresh';

export function setTokens(tokens: TokenPair) {
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

export async function login(username: string, password: string): Promise<TokenPair> {
  const res = await fetch('/api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error('Login failed');
  }
  const data = await res.json();
  const tokens: TokenPair = { access: data.access, refresh: data.refresh };
  setTokens(tokens);
  return tokens;
}

export async function refreshToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('No refresh token');
  const res = await fetch('/api/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens();
    throw new Error('Refresh failed');
  }
  const data = await res.json();
  const access = data.access;
  if (!access) throw new Error('No access token in refresh response');
  localStorage.setItem(ACCESS_KEY, access);
  // Some backends also return a new refresh token
  if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh);
  return access;
}

export default {
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isLoggedIn,
  login,
  refreshToken,
};
