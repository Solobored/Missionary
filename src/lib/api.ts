const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

interface ApiError {
  status: number;
  data: {
    error?: string;
  };
}

export const saveTokens = (data: TokenData) => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

export const apiFetch = async (path: string, options: RequestInit = {}): Promise<unknown> => {
  const token = getAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  // Handle 401 - token expired
  if (res.status === 401 && token) {
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        clearTokens();
        window.location.href = '/login';
        throw new Error('No refresh token');
      }

      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (!refreshRes.ok) {
          clearTokens();
          window.location.href = '/login';
          throw new Error('Refresh failed');
        }

        const data = await refreshRes.json();
        localStorage.setItem('accessToken', data.accessToken);
        isRefreshing = false;
        onRefreshed(data.accessToken);

        // Retry original request
        return apiFetch(path, options);
      } catch (err) {
        isRefreshing = false;
        clearTokens();
        window.location.href = '/login';
        throw err;
      }
    } else {
      // Wait for refresh to complete
      return new Promise((resolve) => {
        addRefreshSubscriber(() => {
          resolve(apiFetch(path, options));
        });
      });
    }
  }

  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    const error: ApiError = { status: res.status, data };
    throw error;
  }
  
  return data;
};