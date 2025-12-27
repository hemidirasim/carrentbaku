const getDefaultApiUrl = () => {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin.replace(/\/$/, '');
    return `${origin}/api`;
  }
  return 'http://localhost:3001/api';
};

const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  getDefaultApiUrl();

export type CategoryNameMap = Record<string, string>;

export interface CategoryDto {
  id: string;
  slug: string;
  name: CategoryNameMap;
  sort_order: number;
  is_active: boolean;
  car_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('admin_token');
};

// Helper function for authenticated requests
const authFetch = (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};

export const api = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then(res => res.json()),
    verify: () =>
      authFetch(`${API_URL}/auth/verify`, {
        method: 'POST',
      }).then(res => res.json()),
  },
  // Cars
  cars: {
    getAll: (params?: { pickup?: string; dropoff?: string }) => {
      const url = new URL(`${API_URL}/cars`);
      if (params) {
        const searchParams = new URLSearchParams();
        if (params.pickup) {
          searchParams.set('pickup', params.pickup);
        }
        if (params.dropoff) {
          searchParams.set('dropoff', params.dropoff);
        }
        const queryString = searchParams.toString();
        if (queryString) {
          url.search = queryString;
        }
      }
      return fetch(url.toString()).then(res => res.json());
    },
    getById: (id: string) => fetch(`${API_URL}/cars/${id}`).then(res => res.json()),
    create: (data: any) => 
      authFetch(`${API_URL}/cars`, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    update: (id: string, data: any) =>
      authFetch(`${API_URL}/cars/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    delete: (id: string) =>
      authFetch(`${API_URL}/cars/${id}`, {
        method: 'DELETE',
      }).then(res => res.json()),
  },
  
  // Reservations
  reservations: {
    getAll: () => authFetch(`${API_URL}/reservations`).then(res => res.json()),
    getById: (id: string) => authFetch(`${API_URL}/reservations/${id}`).then(res => res.json()),
    create: (data: any) =>
      fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    update: (id: string, data: any) =>
      authFetch(`${API_URL}/reservations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    delete: (id: string) =>
      authFetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
      }).then(res => res.json()),
  },
  
  // Services
  services: {
    getAll: () => fetch(`${API_URL}/services`).then(res => res.json()),
    getById: (id: string) => fetch(`${API_URL}/services/${id}`).then(res => res.json()),
    create: (data: any) =>
      authFetch(`${API_URL}/services`, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    update: (id: string, data: any) =>
      authFetch(`${API_URL}/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    delete: (id: string) =>
      authFetch(`${API_URL}/services/${id}`, {
        method: 'DELETE',
      }).then(res => res.json()),
  },
  
  // Categories
  categories: {
    getAll: (params?: { includeInactive?: boolean; includeCounts?: boolean }) => {
      const url = new URL(`${API_URL}/categories`);
      if (params?.includeInactive) {
        url.searchParams.set('includeInactive', 'true');
      }
      if (params?.includeCounts) {
        url.searchParams.set('includeCounts', 'true');
      }
      return fetch(url.toString()).then(res => res.json());
    },
    getById: (id: string, params?: { includeCounts?: boolean }) => {
      const url = new URL(`${API_URL}/categories/${id}`);
      if (params?.includeCounts) {
        url.searchParams.set('includeCounts', 'true');
      }
      return authFetch(url.toString()).then(res => res.json());
    },
    create: (data: any) =>
      authFetch(`${API_URL}/categories`, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    update: (id: string, data: any) =>
      authFetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    delete: (id: string, options?: { force?: boolean }) => {
      const url = new URL(`${API_URL}/categories/${id}`);
      if (options?.force) {
        url.searchParams.set('force', 'true');
      }
      return authFetch(url.toString(), {
        method: 'DELETE',
      }).then(res => res.json());
    },
  },
  
  // Blog
  blog: {
    getAll: (params?: { published?: boolean; category?: string }) => {
      const url = new URL(`${API_URL}/blog`);
      if (params?.published !== undefined) {
        url.searchParams.set('published', String(params.published));
      }
      if (params?.category) {
        url.searchParams.set('category', params.category);
      }
      return fetch(url.toString()).then(res => res.json());
    },
    getById: (id: string) => fetch(`${API_URL}/blog/id/${id}`).then(res => res.json()),
    getBySlug: (slug: string) => fetch(`${API_URL}/blog/${slug}`).then(res => res.json()),
    create: (data: any) =>
      authFetch(`${API_URL}/blog`, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    update: (id: string, data: any) =>
      authFetch(`${API_URL}/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    delete: (id: string) =>
      authFetch(`${API_URL}/blog/${id}`, {
        method: 'DELETE',
      }).then(res => res.json()),
  },

  // Agent Config
  agent: {
    get: () => authFetch(`${API_URL}/agent-config`).then(res => res.json()),
    update: (data: any) =>
      authFetch(`${API_URL}/agent-config`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    getPrompt: () => fetch(`${API_URL}/agent-config/prompt`).then(res => res.json()),
  },


  // Reviews
  reviews: {
    getAll: (params?: { featured?: boolean }) => {
      const url = new URL(`${API_URL}/reviews`);
      if (params?.featured) {
        url.searchParams.set('featured', 'true');
      }
      return fetch(url.toString()).then(res => res.json());
    },
    getById: (id: string) =>
      authFetch(`${API_URL}/reviews/${id}`).then(res => res.json()),
    create: (data: any) =>
      authFetch(`${API_URL}/reviews`, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    update: (id: string, data: any) =>
      authFetch(`${API_URL}/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(res => res.json()),
    delete: (id: string) =>
      authFetch(`${API_URL}/reviews/${id}`, {
        method: 'DELETE',
      }).then(res => res.json()),
  },
  
  // About
  about: {
    get: () => fetch(`${API_URL}/about`).then(res => res.json()),
    update: (data: any) =>
      authFetch(`${API_URL}/about`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(res => res.json()),
  },
  
  contactInfo: {
    get: () => fetch(`${API_URL}/contact-info`).then(res => res.json()),
    update: (data: any) =>
      authFetch(`${API_URL}/contact-info`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(res => res.json()),
  },

  // Contact
  contact: {
    getAll: () => authFetch(`${API_URL}/contact`).then(res => res.json()),
    create: (data: any) =>
      fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    update: (id: string, data: any) =>
      authFetch(`${API_URL}/contact/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(res => res.json()),
  },
};

