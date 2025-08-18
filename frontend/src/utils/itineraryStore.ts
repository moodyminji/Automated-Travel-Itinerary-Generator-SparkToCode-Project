import type { ItineraryDay } from '../types';
export type { Activity, ItineraryDay } from '../types';
const KEY = (tripId: string) => `tajawal:itinerary:${tripId}`;

const makeId = () =>
  (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)) +
  Date.now().toString(36);

function withIds(days: ItineraryDay[]): ItineraryDay[] {
  return days.map((d) => ({
    ...d,
    activities: (d.activities || []).map((a) => ({
      ...a,
      id: a.id ?? makeId(), // ← تجنّب تكرار خاصية id
    })),
  }));
}

export function loadItinerary(tripId: string): ItineraryDay[] | null {
  try {
    const raw = localStorage.getItem(KEY(tripId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ItineraryDay[];
    return withIds(parsed);
  } catch {
    return null;
  }
}

export function saveItinerary(tripId: string, days: ItineraryDay[]) {
  try {
    localStorage.setItem(KEY(tripId), JSON.stringify(days));
  } catch {
    /* ignore */
  }
}

export function ensureItinerary(tripId: string, fallback: ItineraryDay[]) {
  const stored = loadItinerary(tripId);
  if (stored) return stored;
  const withId = withIds(fallback);
  saveItinerary(tripId, withId);
  return withId;
}
