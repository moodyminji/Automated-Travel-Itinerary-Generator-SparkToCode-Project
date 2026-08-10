import axios from 'axios';
import type { TripRequest } from '../types';

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

// Shape returned by GET/POST /api/itineraries/**  (mirrors GenerateItineraryResponse.java)
export type ItineraryActivityDto = {
    name: string;
    type?: string;
    location?: string;
    price?: number;
    rating?: number;
    durationMinutes?: number;
    dayPlanned?: number;
};

export type ItineraryDayDto = {
    dayNumber: number;
    restDay?: boolean;
    notes?: string;
};

export type ItineraryResponseDto = {
    itineraryId: number;
    message?: string;
    destination?: string;
    startDate?: string;
    endDate?: string;
    totalBudget?: number;
    travelStyle?: string;
    budgetBreakdown?: Record<string, number>;
    interests?: string[];
    peopleCount?: number;
    activities: ItineraryActivityDto[];
    itineraryDays: ItineraryDayDto[];
};

export async function generateItinerary(trip: TripRequest): Promise<ItineraryResponseDto> {
    const { data } = await api.post('/api/itineraries/generate', trip);
    return data;
}

export async function getItinerary(id: string | number): Promise<ItineraryResponseDto> {
    const { data } = await api.get(`/api/itineraries/${id}`);
    return data;
}

export default api;