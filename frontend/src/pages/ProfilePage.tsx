import { useEffect, useState } from 'react';
import { TextField, Button, Slider, Chip, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const INTERESTS = ['Nature', 'History', 'Food', 'Museums', 'Shopping', 'Beaches', 'Nightlife'];

type Prefs = {
  style: 'luxury' | 'budget' | 'adventure' | 'family';
  interests: string[];
  homeAirport: string;
  budget: number;
};

const KEY = 'tajawal:prefs';

export default function ProfilePage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [prefs, setPrefs] = useState<Prefs>({
    style: 'budget',
    interests: [],
    homeAirport: '',
    budget: 1000,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs(JSON.parse(raw) as Prefs);
    } catch {
      /* ignore */
    }
  }, []);

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (!user) {
    return (
      <section className="card p-6 max-w-xl mx-auto">
        <p className="mb-4">You need to login first.</p>
        <Link to="/auth" className="btn-primary">Go to Login</Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 max-w-3xl mx-auto">
      <div className="card p-6">
        <h1 className="h2 mb-4">Profile</h1>
        {saved && <Alert severity="success" sx={{ mb: 2 }}>Preferences saved.</Alert>}

        <div className="grid md:grid-cols-2 gap-4">
          <TextField label="Name" value={user.name} disabled />
          <TextField label="Email" value={user.email} disabled />
          <TextField
            label="Home Airport"
            value={prefs.homeAirport}
            onChange={(e) => setPrefs(p => ({ ...p, homeAirport: e.target.value }))}
          />
          <div>
            <div className="small text-muted mb-2">Default Budget: ${prefs.budget}</div>
            <Slider
              value={prefs.budget}
              min={100}
              max={10000}
              step={50}
              onChange={(_, v) =>
                setPrefs(p => ({ ...p, budget: Array.isArray(v) ? v[0] : (v as number) }))
              }
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="small text-muted mb-2">Travel Style</div>
          <div className="flex gap-2 flex-wrap">
            {(['luxury', 'budget', 'adventure', 'family'] as const).map(s => (
              <button
                key={s}
                onClick={() => setPrefs(p => ({ ...p, style: s }))}
                className={`px-3 py-2 rounded-xl border ${prefs.style === s ? 'bg-surface' : 'hover:bg-surface/70'} border-[--color-border]`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="small text-muted mb-2">Interests</div>
          <div className="flex gap-2 flex-wrap">
            {INTERESTS.map(i => (
              <Chip
                key={i}
                label={i}
                color={prefs.interests.includes(i) ? 'primary' : 'default'}
                onClick={() =>
                  setPrefs(p => ({
                    ...p,
                    interests: p.interests.includes(i)
                      ? p.interests.filter(x => x !== i)
                      : [...p.interests, i],
                  }))
                }
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={save} className="btn-secondary">Save Preferences</button>
          <Button variant="outlined" onClick={() => nav('/new-trip')}>Plan New Trip</Button>
        </div>
      </div>
    </section>
  );
}
