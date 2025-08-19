import axios from 'axios';
import type { TripRequest, ItineraryDay } from '../types';

const apiBase = import.meta.env.VITE_API_URL as string | undefined;

const api = axios.create({
  baseURL: apiBase,
  timeout: 15000,
});

export const hasApiBase = Boolean(apiBase);

export async function generateItinerary(
  trip: TripRequest
): Promise<{ itinerary: ItineraryDay[] } | ItineraryDay[]> {
  const { data } = await api.post('/generate-itinerary', trip);
  return data;
}

export default api;
