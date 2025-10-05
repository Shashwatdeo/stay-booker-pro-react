// Usage: import { networkAdapter } from 'path/to/NetworkAdapter.js';
// Usage: const response = await networkAdapter.get('/api/hotel/123');
// Usage: const response = await networkAdapter.post('/api/hotel', { name: 'Hotel Name' });
class NetworkAdapter {
  static #API_CONFIG = {
    MIRAGE: window.location.origin,
    EXPRESS: 'http://localhost:4000',
  };
  // Determine API base URL.
  // Priority:
  // 1. If REACT_APP_USE_MIRAGE === 'true' => use MIRAGE (same-origin)
  // 2. Else if NODE_ENV !== 'production' => use MIRAGE
  // 3. Else use EXPRESS
  static #API_URL = (() => {
    try {
  const useMirageEnv = typeof process !== 'undefined' && process.env && process.env.REACT_APP_USE_MIRAGE;
  const nodeEnv = typeof process !== 'undefined' && process.env && process.env.NODE_ENV;
  // prefer MIRAGE when explicitly requested, when running locally on CRA default port 3000,
  // when NODE_ENV !== 'production', or when the Mirage server sets a global flag
  const runningOnCRA = typeof window !== 'undefined' && window.location && window.location.port === '3000';
  const mirageFlag = typeof window !== 'undefined' && window.__MIRAGE_ACTIVE;
  const useMirage = useMirageEnv === 'true' || mirageFlag || runningOnCRA || (nodeEnv && nodeEnv !== 'production');
      const chosen = useMirage ? NetworkAdapter.#API_CONFIG.MIRAGE : NetworkAdapter.#API_CONFIG.EXPRESS;
      // runtime log for debugging which API base is used
      // eslint-disable-next-line no-console
      console.info(`[NetworkAdapter] API base set to: ${chosen}`);
      return chosen;
    } catch (e) {
      return NetworkAdapter.#API_CONFIG.EXPRESS;
    }
  })();
  // Helper to ensure endpoints use /api when talking to Mirage (same-origin)
  static normalizeEndpoint(endpoint) {
    try {
      // if the API base is same-origin (mirage), ensure endpoint starts with '/api'
      const isMirage = NetworkAdapter.#API_URL === NetworkAdapter.#API_CONFIG.MIRAGE;
      if (isMirage) {
        // if endpoint starts with 'http' it's absolute; leave it as-is
        if (/^https?:\/\//i.test(endpoint)) return endpoint;
        // add leading slash if missing
        let ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        if (!ep.startsWith('/api')) ep = `/api${ep}`;
        return ep;
      }
      // otherwise return the endpoint as-is (will be resolved against EXPRESS base)
      return endpoint;
    } catch (e) {
      return endpoint;
    }
  }
  async get(endpoint, params = {}) {
    try {
      const ep = NetworkAdapter.normalizeEndpoint(endpoint);
      const url = new URL(ep, NetworkAdapter.#API_URL);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      const response = await fetch(url.toString(), { credentials: 'include' });
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
  const ep = NetworkAdapter.normalizeEndpoint(endpoint);
  const url = new URL(ep, NetworkAdapter.#API_URL);
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
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
  const ep = NetworkAdapter.normalizeEndpoint(endpoint);
  const url = new URL(ep, NetworkAdapter.#API_URL);
      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
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
  const ep = NetworkAdapter.normalizeEndpoint(endpoint);
  const url = new URL(ep, NetworkAdapter.#API_URL);
      const response = await fetch(url.toString(), {
        method: 'DELETE',
        credentials: 'include',
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
  const ep = NetworkAdapter.normalizeEndpoint(endpoint);
  const url = new URL(ep, NetworkAdapter.#API_URL);
      const response = await fetch(url.toString(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
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
