// Usage: import { networkAdapter } from 'path/to/NetworkAdapter.js';
// Usage: const response = await networkAdapter.get('/api/hotel/123');
// Usage: const response = await networkAdapter.post('/api/hotel', { name: 'Hotel Name' });
class NetworkAdapter {
  static #API_CONFIG = {
    MIRAGE: window.location.origin,
    EXPRESS: 'http://localhost:5000',
  };
  static #API_URL = NetworkAdapter.#API_CONFIG.EXPRESS;

  getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async get(endpoint, params = {}) {
    try {
      const url = new URL(endpoint, NetworkAdapter.#API_URL);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      const response = await fetch(url.toString(), {
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return {
        data: {},
        errors: [error.message],
      };
    }
  }

  async post(endpoint, data = {}) {
    try {
      const url = new URL(endpoint, NetworkAdapter.#API_URL);
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      return {
        data: {},
        errors: [error.message],
      };
    }
  }

  async put(endpoint, data = {}) {
    try {
      const url = new URL(endpoint, NetworkAdapter.#API_URL);
      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      return {
        data: {},
        errors: [error.message],
      };
    }
  }

  async delete(endpoint) {
    try {
      const url = new URL(endpoint, NetworkAdapter.#API_URL);
      const response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return await response.json();
    } catch (error) {
      return {
        data: {},
        errors: [error.message],
      };
    }
  }

  async patch(endpoint, data = {}) {
    try {
      const url = new URL(endpoint, NetworkAdapter.#API_URL);
      const response = await fetch(url.toString(), {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      return {
        data: {},
        errors: [error.message],
      };
    }
  }
}

export const networkAdapter = new NetworkAdapter();