import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends the httpOnly JWT cookie on every request
  headers: { 'Content-Type': 'application/json' },
});

export default api;
