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
