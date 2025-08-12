export type TripInput = {
  origin: string;
  destination: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  budget: number;
  airlinePreference?: string;
  dietaryRestrictions?: string[];
};

export type Activity = {
  id: string;
  name: string;
  description?: string;
  startTime?: string; // ISO
  durationMins?: number;
  price?: number;
  imageUrl?: string;
  lat?: number;
  lng?: number;
  rating?: number;
};

export type DayPlan = {
  date: string; // ISO
  activities: Activity[];
  estimatedCost: number;
};

export type Itinerary = {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  currency: string;
  days: DayPlan[];
  totalEstimatedCost: number;
};