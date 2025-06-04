import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // Set Content-Type only if not already set (for FormData)
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

export default API;
