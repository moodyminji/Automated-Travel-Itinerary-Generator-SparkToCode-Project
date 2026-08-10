export type Activity = {
  id: string;
  title: string;
  time?: string;
  location?: string;
  cost?: number;
  notes?: string;
  done?: boolean;     // ✅ لعلامة الإنجاز
  lat?: number;       // اختياري: إحداثيات للخريطة
  lng?: number;
};

export type ItineraryDay = {
  day: number;
  activities: Activity[];
};

export type TravelStyle = 'Luxury' | 'Budget' | 'Comfort';

export type TripRequest = {
  destination: string;
  startDate: string;   // dd-mm-yyyy
  endDate: string;      // dd-mm-yyyy
  budget: number;
  travelers?: number;
  peopleCount?: number;
  interests: string[];
  travelStyle: TravelStyle;
};