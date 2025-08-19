import type { ItineraryDay, Activity } from '../types';

const base = [
  { day: 1, activities: ['Visit museum', 'Lunch at local café', 'Beach walk'] },
  { day: 2, activities: ['Hiking trail', 'Dinner cruise'] },
];

const makeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function makeMockItinerary(): ItineraryDay[] {
  return base.map((d) => ({
    day: d.day,
    activities: d.activities.map(
      (t) => ({ id: makeId(), title: t } as Activity)
    ),
  }));
}
