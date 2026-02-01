import axios from 'axios';
import qs from 'qs';

const isProd = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE_URL = isProd ? '/api' : (import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request.method.toUpperCase(), request.url, request.params);
  return request;
});

/**
 * Fetch sales data with filters, search, sorting, and pagination
 */
export const fetchSales = async (params = {}) => {
  try {
    const response = await api.get('/sales', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch sales data');
  }
};

/**
 * Fetch available filter options
 */
export const fetchFilterOptions = async () => {
  try {
    const response = await api.get('/sales/filters');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch filter options');
  }
};
