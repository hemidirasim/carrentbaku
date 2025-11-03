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
};

