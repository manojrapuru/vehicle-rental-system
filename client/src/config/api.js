/**
 * API Configuration
 * Supports local development (Vite proxy) and production deployment (Vercel -> Render backend).
 *
 * Set VITE_API_BASE_URL on Vercel (e.g. https://vehicle-rental-backend.onrender.com).
 * In local development, leaving it blank allows Vite proxy to forward '/api' to localhost:5000.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export function apiUrl(endpoint) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
}

export default {
  API_BASE_URL,
  apiUrl,
};
