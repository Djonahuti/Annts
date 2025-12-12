// Client-side API helpers for token management and auth-enabled fetch
// Updated for static export - calls PHP backend directly instead of Next.js API routes

import { callPHPBackend } from './php-api';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (!token) localStorage.removeItem('auth_token');
  else localStorage.setItem('auth_token', token);
}

export function clearToken() {
  setToken(null);
}

// Wrapper that intercepts /api/* calls and redirects to PHP backend
export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  
  // If the URL starts with /api/, call PHP backend directly
  const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
  if (url.startsWith('/api/')) {
    return callPHPBackend(url, { ...init, headers });
  }
  
  // Otherwise, use regular fetch
  return fetch(input, { ...init, headers });
}

// Global fetch wrapper for static export
// This intercepts all fetch calls to /api/* and redirects to PHP backend
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
    
    // If calling /api/* route, redirect to PHP backend
    if (url.startsWith('/api/')) {
      const token = getToken();
      const headers = new Headers(init?.headers || {});
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return callPHPBackend(url, { ...init, headers });
    }
    
    // Otherwise, use original fetch
    return originalFetch(input, init);
  };
}

export default fetchWithAuth;
