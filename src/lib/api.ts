const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Cars
  cars: {
    getAll: () => fetch(`${API_URL}/cars`).then(res => res.json()),
    getById: (id: string) => fetch(`${API_URL}/cars/${id}`).then(res => res.json()),
    create: (data: any) => 
      fetch(`${API_URL}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    update: (id: string, data: any) =>
      fetch(`${API_URL}/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    delete: (id: string) =>
      fetch(`${API_URL}/cars/${id}`, {
        method: 'DELETE',
      }).then(res => res.json()),
  },
  
  // Reservations
  reservations: {
    getAll: () => fetch(`${API_URL}/reservations`).then(res => res.json()),
    getById: (id: string) => fetch(`${API_URL}/reservations/${id}`).then(res => res.json()),
    create: (data: any) =>
      fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    update: (id: string, data: any) =>
      fetch(`${API_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    delete: (id: string) =>
      fetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
      }).then(res => res.json()),
  },
  
  // Services
  services: {
    getAll: () => fetch(`${API_URL}/services`).then(res => res.json()),
    getById: (id: string) => fetch(`${API_URL}/services/${id}`).then(res => res.json()),
  },
  
  // Blog
  blog: {
    getAll: (published?: boolean) => {
      const url = published !== undefined 
        ? `${API_URL}/blog?published=${published}` 
        : `${API_URL}/blog`;
      return fetch(url).then(res => res.json());
    },
    getBySlug: (slug: string) => fetch(`${API_URL}/blog/${slug}`).then(res => res.json()),
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
    getAll: () => fetch(`${API_URL}/contact`).then(res => res.json()),
    create: (data: any) =>
      fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    update: (id: string, data: any) =>
      fetch(`${API_URL}/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
  },
};

