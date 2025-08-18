// src/pages/ItineraryView.tsx
import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { ItineraryDay } from '../types';
import { loadItinerary, saveItinerary } from '../utils/itineraryStore';
import { makeMockItinerary } from '../utils/mock';
import TripMap from '../components/TripMap';
import { jsPDF } from 'jspdf';

type Params = { tripId?: string };

function computeBudget(days: ItineraryDay[]) {
  const perDay = days.map((d) => ({
    day: d.day,
    total: d.activities.reduce((s, a) => s + (a.cost ?? 0), 0),
  }));
  const total = perDay.reduce((s, x) => s + x.total, 0);
  return { perDay, total };
}

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}
type WebShareNavigator = Navigator & { share?: (data: ShareData) => Promise<void> };

export default function ItineraryView() {
  const { tripId = 'demo' } = useParams<Params>();
  const nav = useNavigate();

  const fallback: ItineraryDay[] = useMemo(() => makeMockItinerary(), []);
  const stored = loadItinerary(tripId);
  const [days, setDays] = useState<ItineraryDay[]>(stored ?? fallback);

  const [showMap, setShowMap] = useState(false);
  const [query, setQuery] = useState('');
  const [onlyPending, setOnlyPending] = useState(false);
  const [dayFilter, setDayFilter] = useState<'all' | number>('all');
  const [savedBanner, setSavedBanner] = useState(false);

  const filtered = useMemo(() => {
    let out = days;
    if (dayFilter !== 'all') out = out.filter((d) => d.day === dayFilter);
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.map((d) => ({
        ...d,
        activities: d.activities.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            (a.location ?? '').toLowerCase().includes(q) ||
            (a.notes ?? '').toLowerCase().includes(q)
        ),
      }));
    }
    if (onlyPending) {
      out = out.map((d) => ({ ...d, activities: d.activities.filter((a) => !a.done) }));
    }
    return out;
  }, [days, dayFilter, query, onlyPending]);

  const budget = computeBudget(days);

  const saveTrip = () => {
    saveItinerary(tripId, days);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 1500);
  };

  const shareTrip = async () => {
    const title = `Trip plan (${tripId})`;
    const text = days
      .map(
        (d) =>
          `Day ${d.day}\n` +
          d.activities
            .map(
              (a) =>
                `- ${a.time ? a.time + ' ' : ''}${a.title}${
                  a.location ? ' @ ' + a.location : ''
                }${a.cost != null ? ` ($${a.cost})` : ''}`
            )
            .join('\n')
      )
      .join('\n\n');

    const navShare = navigator as WebShareNavigator;
    if (typeof navShare.share === 'function') {
      try {
        await navShare.share({ title, text });
        return;
      } catch {
        // user canceled
      }
    }

    // Fallback: فتح نافذة الطباعة (PDF)
    const w = window.open('', '_blank', 'width=880,height=1000');
    if (!w) return;
    w.document.write(`<html><head><title>${title}</title>
      <style>
        body{font-family: system-ui,Segoe UI,Roboto,Arial; padding:24px}
        h1{margin:0 0 12px}
        h2{margin:16px 0 6px}
        ul{margin:6px 0 14px}
      </style>
    </head><body>`);
    w.document.write(`<h1>${title}</h1>`);
    days.forEach((d) => {
      w.document.write(`<h2>Day ${d.day}</h2><ul>`);
      d.activities.forEach((a) => {
        w.document.write(
          `<li>${a.time ? a.time + ' ' : ''}<strong>${a.title}</strong>${
            a.location ? ' @ ' + a.location : ''
          }${a.cost != null ? ` ($${a.cost})` : ''}${a.notes ? ` — ${a.notes}` : ''}</li>`
        );
      });
      w.document.write(`</ul>`);
    });
    w.document.write(`<hr/><p>Total Budget: $${budget.total}</p>`);
    w.document.write(`</body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 48;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Trip plan (${tripId})`, 48, y);
    y += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    days.forEach((d) => {
      y += 18;
      if (y > 780) {
        doc.addPage();
        y = 48;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`Day ${d.day}`, 48, y);
      doc.setFont('helvetica', 'normal');

      d.activities.forEach((a) => {
        const line =
          `${a.time ? a.time + ' ' : ''}${a.title}` +
          `${a.location ? ' @ ' + a.location : ''}` +
          `${a.cost != null ? ` ($${a.cost})` : ''}` +
          `${a.notes ? ` — ${a.notes}` : ''}`;
        const lines = doc.splitTextToSize(line, 520);
        y += 14;
        if (y > 780) {
          doc.addPage();
          y = 48;
        }
        doc.text(lines, 64, y);
        y += (lines.length - 1) * 12;
      });
    });

    y += 24;
    if (y > 780) {
      doc.addPage();
      y = 48;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Budget: $${budget.total}`, 48, y);

    doc.save(`trip-${tripId}.pdf`);
  };

  const deleteTrip = () => {
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    localStorage.removeItem(`tajawal:itinerary:${tripId}`);
    nav('/profile');
  };

  const toggleDone = (dayIndex: number, actId: string) => {
    setDays((prev) => {
      const next = prev.map((d, i) =>
        i !== dayIndex
          ? d
          : { ...d, activities: d.activities.map((a) => (a.id === actId ? { ...a, done: !a.done } : a)) }
      );
      saveItinerary(tripId, next);
      return next;
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="h2">Itinerary</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowMap((s) => !s)}
            className="px-3 py-2 rounded-xl border border-[--color-border] hover:bg-surface/70"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
          <Link to={`/itinerary/${tripId}/edit`} className="btn-secondary">
            Edit Itinerary
          </Link>
          <button onClick={saveTrip} className="px-3 py-2 rounded-xl border border-[--color-border] hover:bg-surface/70">
            Save Trip
          </button>
          <button onClick={shareTrip} className="px-3 py-2 rounded-xl border border-[--color-border] hover:bg-surface/70">
            Share
          </button>
          <button onClick={downloadPdf} className="px-3 py-2 rounded-xl border border-[--color-border] hover:bg-surface/70">
            Download PDF
          </button>
          <button onClick={deleteTrip} className="px-3 py-2 rounded-xl border border-[--color-border] hover:bg-surface/70 text-red-500">
            Delete Trip
          </button>
        </div>
      </div>

      {savedBanner && <div className="card p-3 small text-green-600">Saved ✅</div>}

      {/* فلاتر */}
      <div className="card p-4 grid md:grid-cols-4 gap-3">
        <input
          className="input"
          placeholder="Search title / location / notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input"
          aria-label="Filter by day"
          value={dayFilter === 'all' ? 'all' : String(dayFilter)}
          onChange={(e) => setDayFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          <option value="all">All days</option>
          {days.map((d) => (
            <option key={d.day} value={d.day}>Day {d.day}</option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} />
          <span className="small">Hide completed</span>
        </label>
        <div className="flex items-center gap-2 justify-end">
          <span className="small text-muted">Total:</span>
          <span className="font-semibold">${budget.total}</span>
        </div>
      </div>

      {/* الخريطة الحقيقية */}
      {showMap && (
        <div className="card p-5">
          <h3 className="font-semibold mb-2">Map</h3>
          <TripMap days={filtered} />
        </div>
      )}

      {/* القائمة يوم-بي-يوم */}
      {filtered.map((day, idx) => (
        <div key={day.day} className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Day {day.day}</h3>
            <div className="small text-muted">
              Budget: ${day.activities.reduce((s, a) => s + (a.cost ?? 0), 0)}
            </div>
          </div>

          <ul className="space-y-2 text-sm">
            {day.activities.map((a) => (
              <li
                key={a.id}
                className={`border border-[--color-border] rounded-xl p-3 flex flex-wrap gap-3 items-center ${a.done ? 'opacity-70' : ''}`}
              >
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!a.done} onChange={() => toggleDone(idx, a.id)} />
                  <span className={`font-medium ${a.done ? 'line-through' : ''}`}>
                    {a.time && <span className="mr-2 px-2 py-1 rounded-lg bg-surface/70">{a.time}</span>}
                    {a.title}
                  </span>
                </label>
                {a.location && <span className="text-muted">• {a.location}</span>}
                {a.cost != null && <span className="ml-auto">${a.cost}</span>}
                {a.notes && <div className="w-full small text-muted">{a.notes}</div>}
              </li>
            ))}
            {day.activities.length === 0 && <li className="small text-muted">No activities for this filter.</li>}
          </ul>
        </div>
      ))}
    </section>
  );
}
