import axios from 'axios';
import type { TripRequest, ItineraryDay } from '../types';

const apiBase = import.meta.env.VITE_API_URL as string | undefined;

const api = axios.create({
  baseURL: apiBase,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('tajawal:auth');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(err);
    }
);

export const hasApiBase = Boolean(apiBase);

export async function generateItinerary(
    trip: TripRequest
): Promise<{ itinerary: ItineraryDay[] } | ItineraryDay[]> {
  const { data } = await api.post('/generate-itinerary', trip);
  return data;
}

export default api;