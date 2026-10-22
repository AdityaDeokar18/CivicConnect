const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const getToken = () => {
  const token = localStorage.getItem('civicconnect_token');
  if (token) return token;
  const user = localStorage.getItem('civicconnect_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.token || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('civicconnect_token', token);
  } else {
    localStorage.removeItem('civicconnect_token');
  }
};

export const clearAuth = () => {
  localStorage.removeItem('civicconnect_token');
  localStorage.removeItem('civicconnect_user');
};

const request = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    ...options.headers
  };

  const token = getToken();
  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    headers['Authorization'] = formattedToken;
  }

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Check if 401 Unauthorized (session expired or unauthenticated)
    if (response.status === 401) {
      // Don't auto-clear on login attempts
      if (!endpoint.includes('/auth/login')) {
        clearAuth();
      }
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || (typeof data === 'string' ? data : 'An unexpected server error occurred');
      const errorObj = new Error(errorMessage);
      errorObj.status = response.status;
      errorObj.data = data;
      throw errorObj;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Cannot connect to CivicConnect backend server at ' + BASE_URL + '. Please ensure Spring Boot is running on port 8080.');
      networkError.status = 0;
      throw networkError;
    }
    throw error;
  }
};

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...options
  }),
  put: (endpoint, body, options) => request(endpoint, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...options
  }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),

  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/files/upload', {
      method: 'POST',
      body: formData
    });
  },

  resolveFileUrl: (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    const base = BASE_URL.replace(/\/api\/?$/, '');
    return `${base}${url.startsWith('/') ? url : `/${url}`}`;
  }
};

export const resolveFileUrl = api.resolveFileUrl;

export default api;
