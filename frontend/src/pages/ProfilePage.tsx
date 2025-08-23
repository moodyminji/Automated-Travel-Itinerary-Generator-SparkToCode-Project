// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { TextField, Slider, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../hooks/useThemeMode';

import userImg from '../assets/user.png';

const INTERESTS = ['Nature', 'History', 'Food', 'Museums', 'Shopping', 'Beaches', 'Nightlife'] as const;
type TravelStyle = 'luxury' | 'budget' | 'adventure' | 'family';

type Prefs = {
  style: TravelStyle;
  interests: string[];
  homeAirport: string;
  budget: number;
};

const KEY = 'tajawal:prefs';
const ORANGE = '#FBBF24';
const NAVY = '#111827';

export default function ProfilePage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { mode } = useThemeMode();          // ← use global theme
  const dark = mode === 'dark';

  const [prefs, setPrefs] = useState<Prefs>({
    style: 'budget',
    interests: [],
    homeAirport: '',
    budget: 1000,
  });
  const [saved, setSaved] = useState(false);

  // load saved prefs once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs(JSON.parse(raw) as Prefs);
    } catch {
      // intentionally ignore
    }
  }, []);

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch {
      // intentionally ignore
    }
  };

  // Palette (background comes from Layout; we just pick text/card colors)
  const textMain = dark ? '#EAF2FB' : NAVY;
  const subText  = dark ? '#C8D6E6' : '#64748b';
  const cardBg   = dark ? '#112D46' : '#FFFFFF';
  const cardBorder = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)';
  const inputBg  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)';
  const inputBorder = dark ? '#385A79' : NAVY;

  // If not logged in, show a simple card (Navbar + waves still come from Layout)
  if (!user) {
    return (
      <div className="min-h-screen flex items-start md:items-center justify-center px-4 py-16">
        <section className="card p-6 max-w-xl w-full">
          <p className="mb-4" style={{ color: textMain }}>You need to login first.</p>
          <Link to="/auth" className="btn-primary">Go to Login</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen z-10 px-5 pt-6 pb-40">
      {/* Content grid */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12">
        {/* LEFT column */}
        <div className="pt-6">
          <h2 className="text-4xl font-extrabold mb-4" style={{ color: textMain }}>
            Default Budget Range
          </h2>

          <Slider
            value={prefs.budget}
            min={100}
            max={10000}
            step={50}
            onChange={(_, v) =>
              setPrefs((p) => ({ ...p, budget: Array.isArray(v) ? v[0] : (v as number) }))
            }
            sx={{
              mt: 2,
              maxWidth: 600,
              height: 8,
              '& .MuiSlider-track': { border: 'none', bgcolor: ORANGE },
              '& .MuiSlider-rail': { opacity: 1, bgcolor: dark ? '#ffffff' : '#fde68a' },
              '& .MuiSlider-thumb': {
                height: 28,
                width: 28,
                bgcolor: '#fff',
                border: `6px solid ${ORANGE}`,
                boxShadow: '0 2px 6px rgba(0,0,0,.2)',
              },
            }}
          />

          <div className="mt-4 text-center text-2xl font-extrabold" style={{ color: textMain }}>
            OMR {prefs.budget}
          </div>

          <h3 className="text-4xl font-extrabold mt-10 mb-3" style={{ color: textMain }}>
            Default Home Airport
          </h3>

          <div className="max-w-[600px]">
            <TextField
              fullWidth
              placeholder="MCT, Muscat International Airport, Oman"
              value={prefs.homeAirport}
              onChange={(e) => setPrefs((p) => ({ ...p, homeAirport: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 5,
                  '& fieldset': { borderColor: inputBorder, borderWidth: 2 },
                  '&:hover fieldset': { borderColor: inputBorder },
                  '&.Mui-focused fieldset': { borderColor: inputBorder },
                  paddingY: '6px',
                  background: inputBg,
                },
                '& input': { color: dark ? '#EAF2FB' : NAVY },
                '& input::placeholder': { opacity: 0.8, color: dark ? '#C8D6E6' : undefined },
              }}
            />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-6">
            <button
              onClick={save}
              className="px-8 py-3 rounded-md font-extrabold shadow-sm"
              style={{
                backgroundColor: dark ? ORANGE : NAVY,
                color: dark ? '#0F2742' : '#fff',
              }}
            >
              Save
            </button>

            <button
              onClick={() => nav('/new-trip')}
              className="px-8 py-3 rounded-md font-extrabold shadow-sm"
              style={
                dark
                  ? { background: 'transparent', color: ORANGE, border: `2px solid ${ORANGE}` }
                  : { backgroundColor: NAVY, color: '#fff' }
              }
            >
              Plan your trips
            </button>
          </div>

          {saved && (
            <Alert severity="success" sx={{ mt: 2, maxWidth: 600 }}>
              Preferences saved.
            </Alert>
          )}
        </div>

        {/* RIGHT column — profile card */}
        <div
          className="rounded-3xl shadow-2xl p-10 border self-start w-full lg:max-w-[720px] justify-self-start"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="flex flex-col items-center">
            <img
              src={userImg}
              alt="User avatar"
              className="w-24 h-24 rounded-full border-[6px] border-[#eef2ff] shadow-md"
            />
            <h3 className="mt-3 text-2xl font-extrabold" style={{ color: textMain }}>
              {user.name || 'User Name'}
            </h3>
            <p style={{ color: subText }}>{user.email}</p>
          </div>

          {/* Travel Style */}
          <div className="mt-8">
            <div className="text-xl font-extrabold mb-3" style={{ color: textMain }}>
              Travel Style
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              {[
                { key: 'luxury', label: 'Luxury' },
                { key: 'budget', label: 'Budget' },
                { key: 'family', label: 'Comfort' }, // reuse 'family' as Comfort
              ].map(({ key, label }) => {
                const active = prefs.style === (key as TravelStyle);
                return (
                  <button
                    key={key}
                    onClick={() => setPrefs((p) => ({ ...p, style: key as TravelStyle }))}
                    className={`px-6 py-2 rounded-full border-2 transition ${
                      active ? 'bg-white' : 'bg-white hover:bg-slate-50'
                    }`}
                    style={{
                      borderColor: active ? ORANGE : '#cbd5e1',
                      boxShadow: active ? `inset 0 0 0 2px ${ORANGE}` : undefined,
                      color: NAVY,
                      fontWeight: active ? 800 : 600,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div className="mt-10">
            <div className="text-xl font-extrabold mb-3" style={{ color: textMain }}>
              Interests
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
              {INTERESTS.map((i) => {
                const checked = prefs.interests.includes(i);
                return (
                  <label key={i} className="flex items-center gap-3 text-[17px]" style={{ color: textMain }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setPrefs((p) => ({
                          ...p,
                          interests: checked
                            ? p.interests.filter((x) => x !== i)
                            : [...p.interests, i],
                        }))
                      }
                      className="h-5 w-5 rounded border-[2px]"
                      style={{
                        accentColor: ORANGE,
                        borderColor: checked ? ORANGE : '#cbd5e1',
                      }}
                    />
                    <span>{i}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
