// src/utils/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('API URL is set to:', API_URL);

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await axios.get(`${API_URL}${endpoint}`);
  return response.data;
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const response = await axios.post(`${API_URL}${endpoint}`, data);
  return response.data;
}

// Usage example in a component:
// import { apiGet, apiPost } from '../utils/api';
const data = await apiGet('/check');
console.log(data);

// const result = await apiPost('/api/login', { username, password });
