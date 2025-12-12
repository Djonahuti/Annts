// Client-side API helper that calls PHP backend directly
// Use this instead of calling /api/* routes in static export

import { callPHPBackend } from './php-api';

// Helper to get the PHP API base URL
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_PHP_API_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_PHP_API_URL || 'http://localhost';
};

// Replace all /api/* calls with direct PHP backend calls
export const apiClient = {
  // Auth
  login: async (email: string, password: string) => {
    return callPHPBackend('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Settings
  getSettings: async () => {
    return callPHPBackend('/api/settings', { method: 'GET' });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateSettings: async (data: any) => {
    return callPHPBackend('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Pages
  getPage: async (slug: string) => {
    return callPHPBackend(`/api/pages/${slug}`, { method: 'GET' });
  },

  getPages: async () => {
    return callPHPBackend('/api/pages', { method: 'GET' });
  },

  // Drivers
  getDrivers: async (email?: string) => {
    const url = email ? `/api/drivers?email=${encodeURIComponent(email)}` : '/api/drivers';
    return callPHPBackend(url, { method: 'GET' });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createDriver: async (data: any) => {
    return callPHPBackend('/api/drivers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateDriver: async (id: string, data: any) => {
    return callPHPBackend(`/api/drivers?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Coordinators
  getCoordinators: async (email?: string) => {
    const url = email ? `/api/coordinators?email=${encodeURIComponent(email)}` : '/api/coordinators';
    return callPHPBackend(url, { method: 'GET' });
  },

  // Admins
  getAdmins: async (email?: string) => {
    const url = email ? `/api/admins?email=${encodeURIComponent(email)}` : '/api/admins';
    return callPHPBackend(url, { method: 'GET' });
  },

  // Buses
  getBuses: async (driverId?: string, unassigned?: boolean) => {
    const params = new URLSearchParams();
    if (driverId) params.append('driverId', driverId);
    if (unassigned) params.append('unassigned', 'true');
    const query = params.toString();
    return callPHPBackend(`/api/buses${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  // Contacts
  getContacts: async (params?: Record<string, string>) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return callPHPBackend(`/api/contacts${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createContact: async (data: any) => {
    return callPHPBackend('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Contact form (contact_us)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitContactForm: async (data: any) => {
    return callPHPBackend('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Generic fetch wrapper that replaces /api/* with PHP backend
  fetch: async (endpoint: string, options: RequestInit = {}) => {
    // If endpoint starts with /api/, call PHP backend directly
    if (endpoint.startsWith('/api/')) {
      return callPHPBackend(endpoint, options);
    }
    // Otherwise, use regular fetch
    return fetch(endpoint, options);
  },
};

export default apiClient;

