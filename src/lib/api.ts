const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    getAll: () => fetch(`${API_URL}/cars`).then(res => res.json()),
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
      authFetch(`${API_URL}/reservations`, {
        method: 'POST',
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
    getAll: () => fetch(`${API_URL}/categories`).then(res => res.json()),
  },
  
  // Blog
  blog: {
    getAll: (published?: boolean) => {
      const url = published !== undefined 
        ? `${API_URL}/blog?published=${published}` 
        : `${API_URL}/blog`;
      return fetch(url).then(res => res.json());
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
  
  // Reviews
  reviews: {
    getAll: (featured?: boolean) => {
      const url = featured !== undefined 
        ? `${API_URL}/reviews?featured=${featured}` 
        : `${API_URL}/reviews`;
      return fetch(url).then(res => res.json());
    },
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

