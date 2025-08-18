// src/pages/TripForm.tsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Slider,
  TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import { saveItinerary } from '../utils/itineraryStore';
import type { ItineraryDay, Activity } from '../types';

// ---------- helpers ----------
const newId = () =>
  (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)) +
  Date.now().toString(36);

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '');

// ---------- static options ----------
const DESTINATIONS = [
  { label: 'Dubai, UAE' },
  { label: 'Muscat, Oman' },
  { label: 'Riyadh, Saudi Arabia' },
  { label: 'Doha, Qatar' },
  { label: 'Cairo, Egypt' },
  { label: 'Istanbul, Türkiye' },
  { label: 'London, UK' },
  { label: 'Paris, France' },
];

const PREFS = [
  'Nature',
  'History',
  'Food',
  'Shopping',
  'Beaches',
  'Nightlife',
  'Adventure',
  'Family',
] as const;
type Pref = (typeof PREFS)[number];

type TripRequest = {
  destination: string;
  startDate: string; // ISO
  endDate: string; // ISO
  budget: number;
  travelers: number;
  preferences: Pref[];
};

// ---------- type guard ----------
function isItineraryArray(v: unknown): v is ItineraryDay[] {
  if (!Array.isArray(v)) return false;
  return v.every((d) => {
    if (typeof d !== 'object' || d === null) return false;
    const obj = d as Record<string, unknown>;
    return typeof obj.day === 'number' && Array.isArray(obj.activities);
  });
}

// ---------- fallback plan ----------
function makeFallbackItinerary(req: TripRequest): ItineraryDay[] {
  const start = dayjs(req.startDate);
  const end = dayjs(req.endDate);
  const daysCount = end.diff(start, 'day') + 1;

  const actsByPref: Record<Pref, string[]> = {
    Nature: ['Hiking trail', 'Park walk', 'Sunset viewpoint'],
    History: ['Museum visit', 'Old town tour', 'Historic fort'],
    Food: ['Street food crawl', 'Local café lunch', 'Seafood dinner'],
    Shopping: ['Souq visit', 'Mall time', 'Local crafts shop'],
    Beaches: ['Beach morning', 'Boat ride', 'Beach sunset'],
    Nightlife: ['Rooftop lounge', 'Night market', 'Live music bar'],
    Adventure: ['ATV dunes', 'Zipline', 'Kayaking'],
    Family: ['Aquarium', 'Theme park', 'Picnic'],
  };

  const pick = (pref: Pref) => {
    const list = actsByPref[pref] ?? [];
    return list.length ? list[Math.floor(Math.random() * list.length)] : 'Free time';
  };

  const chosen: Pref[] = req.preferences.length ? req.preferences : (['Nature', 'Food'] as Pref[]);

  const out: ItineraryDay[] = [];
  for (let i = 0; i < daysCount; i++) {
    const activities: Activity[] = [
      { id: newId(), title: pick(chosen[0]!), time: '10:00' },
      { id: newId(), title: pick(chosen[1] ?? chosen[0]!), time: '14:00' },
      { id: newId(), title: 'Free time / Explore', time: '18:00' },
    ];
    out.push({ day: i + 1, activities });
  }
  return out;
}

// ---------- component ----------
export default function TripForm() {
  const nav = useNavigate();

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().add(7, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(10, 'day'));
  const [budget, setBudget] = useState(1000);
  const [travelers, setTravelers] = useState(2);
  const [prefs, setPrefs] = useState<Pref[]>([]);

  const valid = useMemo(() => {
    if (!destination.trim()) return false;
    if (!startDate || !endDate) return false;
    if (endDate.isBefore(startDate, 'day')) return false;
    if (budget <= 0 || travelers <= 0) return false;
    return true;
  }, [destination, startDate, endDate, budget, travelers]);

  const handleTogglePref = (p: Pref) => {
    setPrefs((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const handleGenerate = async () => {
    if (!valid || !startDate || !endDate) return;

    const req: TripRequest = {
      destination: destination.trim(),
      startDate: startDate.startOf('day').toISOString(),
      endDate: endDate.startOf('day').toISOString(),
      budget,
      travelers,
      preferences: prefs,
    };

    const tripId = `${slug(req.destination)}-${dayjs(req.startDate).format('YYYYMMDD')}`;

    let plan: ItineraryDay[] | null = null;
    try {
      const hasApi = !!import.meta.env.VITE_API_URL;
      if (hasApi) {
        const { generateItinerary } = await import('../services/api');
        const resp = await generateItinerary(req);

        // نتعامل مع AxiosResponse أو غيره بدون any:
        const maybeData: unknown =
          (resp as unknown as { data?: unknown })?.data ?? resp;

        const candidate: unknown =
          typeof maybeData === 'object' &&
          maybeData !== null &&
          'itinerary' in (maybeData as Record<string, unknown>)
            ? (maybeData as { itinerary?: unknown }).itinerary
            : maybeData;

        if (isItineraryArray(candidate)) {
          plan = candidate;
        }
      }
    } catch {
      // ignore → نستخدم fallback
    }

    if (!plan) plan = makeFallbackItinerary(req);

    saveItinerary(tripId, plan);
    nav(`/itinerary/${tripId}`);
  };

  const handleCancel = () => nav('/profile');

  const budgetMarks = [
    { value: 500, label: '$500' },
    { value: 1500, label: '$1500' },
    { value: 3000, label: '$3000' },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="h2">New Trip</h1>
        <div className="small text-muted">Fill trip details → Generate itinerary</div>
      </div>

      <div className="card p-6 space-y-6">
        {/* Destination + Dates */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="grid md:grid-cols-3 gap-4">
            <Autocomplete
              freeSolo
              options={DESTINATIONS}
              getOptionLabel={(o) => (typeof o === 'string' ? o : o.label)}
              value={destination}
              onInputChange={(_, v) => setDestination(v)}
              renderInput={(params) => (
                <TextField {...params} label="Destination" placeholder="e.g., Dubai" />
              )}
            />

            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(v) => setStartDate(v)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(v) => setEndDate(v)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </div>
        </LocalizationProvider>

        {/* Budget + Travelers */}
        <div className="grid md:grid-cols-3 gap-4 items-start">
          <Box>
            <div className="mb-1 font-medium">Budget</div>
            <Slider
              value={budget}
              onChange={(_, v) => setBudget(v as number)}
              getAriaValueText={(v) => `$${v}`}
              valueLabelDisplay="auto"
              min={100}
              max={5000}
              step={50}
              marks={budgetMarks}
            />
            <div className="mt-2">
              <TextField
                label="Budget (USD)"
                type="number"
                size="small"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value || 0))}
                inputProps={{ min: 100 }}
              />
            </div>
          </Box>

          <Box>
            <div className="mb-1 font-medium">Travelers</div>
            <TextField
              label="Number of travelers"
              type="number"
              size="small"
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, Number(e.target.value || 1)))}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Box>
        </div>

        {/* Preferences */}
        <div>
          <div className="mb-2 font-medium">Preferences</div>
          <div className="flex flex-wrap gap-2">
            {PREFS.map((p) => (
              <Chip
                key={p}
                label={p}
                onClick={() => handleTogglePref(p)}
                color={prefs.includes(p) ? 'primary' : 'default'}
                variant={prefs.includes(p) ? 'filled' : 'outlined'}
                sx={{ borderRadius: '12px' }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={handleCancel}
            className="px-3 py-2 rounded-xl border border-[--color-border] hover:bg-surface/70"
          >
            Cancel
          </button>
          <Button variant="contained" disableElevation onClick={handleGenerate} disabled={!valid}>
            Generate Itinerary
          </Button>
        </div>
      </div>
    </section>
  );
}
