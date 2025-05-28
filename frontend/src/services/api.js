// Cấu hình base API
const API_BASE_URL = 'http://localhost:8080';

/**
 * Hàm gọi API chung
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} API response
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Thêm Authorization header nếu có token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 API Call: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Kiểm tra response status
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ API Success:`, data);
    
    return data;
  } catch (error) {
    console.error(`❌ API Error:`, error);
    throw error;
  }
};

/**
 * Helper function để tạo query parameters
 * @param {object} params - Object chứa parameters
 * @returns {string} Query string
 */
const createQueryString = (params) => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  
  return new URLSearchParams(filteredParams).toString();
};

// Export các HTTP methods
export const api = {
  // GET request
  get: (endpoint, params = {}) => {
    const queryString = createQueryString(params);
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return apiCall(url, { method: 'GET' });
  },

  // POST request
  post: (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT request
  put: (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  delete: (endpoint) => {
    return apiCall(endpoint, { method: 'DELETE' });
  },

  // PATCH request
  patch: (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
};

// Export configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
};