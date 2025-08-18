// src/pages/ItineraryEditor.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, TextField } from '@mui/material';
import { ensureItinerary, saveItinerary } from '../utils/itineraryStore';
import type { Activity, ItineraryDay } from '../types';


type Params = { tripId?: string };

function SortableActivity({
  a,
  onChange,
  onDelete,
}: {
  a: Activity;
  onChange: (patch: Partial<Activity>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: a.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-[--color-border] rounded-xl p-3 bg-surface/70 ${
        isDragging ? 'opacity-70' : ''
      }`}
    >
      <div className="flex gap-2 items-start">
        <button
          {...attributes}
          {...listeners}
          className="px-2 py-2 rounded-lg hover:bg-surface"
          title="Drag to reorder"
          aria-label="Drag"
        >
          ☰
        </button>

        <div className="grid md:grid-cols-4 gap-2 flex-1">
          <TextField
            label="Time"
            size="small"
            value={a.time ?? ''}
            onChange={(e) => onChange({ time: e.target.value })}
          />
          <TextField
            label="Title"
            size="small"
            value={a.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          <TextField
            label="Location"
            size="small"
            value={a.location ?? ''}
            onChange={(e) => onChange({ location: e.target.value })}
          />
          <TextField
            label="Cost"
            size="small"
            type="number"
            value={a.cost ?? ''}
            onChange={(e) => onChange({ cost: Number(e.target.value || 0) })}
          />

          {/* Notes field */}
          <TextField
            className="md:col-span-4"
            label="Notes"
            size="small"
            multiline
            minRows={1}
            maxRows={4}
            value={a.notes ?? ''}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </div>

        <button
          onClick={onDelete}
          className="px-3 py-2 rounded-lg hover:bg-surface text-red-400"
          title="Delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function ItineraryEditor() {
  const { tripId = 'demo' } = useParams<Params>();
  const nav = useNavigate();

  const fallback: ItineraryDay[] = useMemo(
    () => [
      {
        day: 1,
        activities: [
          { id: 'a1', title: 'Visit museum', time: '10:00', location: 'City Museum', cost: 20, notes: 'Buy tickets online' },
          { id: 'a2', title: 'Lunch at local café', time: '13:00', location: 'Old Town', cost: 15 },
          { id: 'a3', title: 'Beach walk', time: '17:00', location: 'North Beach', cost: 0 },
        ],
      },
      { day: 2, activities: [{ id: 'b1', title: 'Hiking trail', time: '09:00', notes: 'Bring water' }, { id: 'b2', title: 'Dinner cruise', time: '19:30' }] },
    ],
    []
  );

  const [days, setDays] = useState<ItineraryDay[]>(() => ensureItinerary(tripId, fallback));
  const [dayIdx, setDayIdx] = useState(0);
  const [dirty, setDirty] = useState(false);

  // Undo stack
  const historyRef = useRef<string[]>([]);
  const pushHistory = (state: ItineraryDay[]) => {
    historyRef.current.push(JSON.stringify(state));
    if (historyRef.current.length > 30) historyRef.current.shift();
  };
  const undo = () => {
    const prev = historyRef.current.pop();
    if (prev) {
      setDays(JSON.parse(prev));
      setDirty(true);
    }
  };

  useEffect(() => {
    if (dayIdx > days.length - 1) setDayIdx(days.length - 1);
  }, [days.length, dayIdx]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const items = (days[dayIdx]?.activities || []).map((a) => a.id);

  const onDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (!over || active.id === over.id) return;
    pushHistory(days);
    setDirty(true);
    setDays((d) => {
      const list = d.map((day, i) => {
        if (i !== dayIdx) return day;
        const curr = [...day.activities];
        const from = curr.findIndex((x) => x.id === active.id);
        const to = curr.findIndex((x) => x.id === over.id);
        return { ...day, activities: arrayMove(curr, from, to) };
      });
      return list;
    });
  };

  const editActivity = (id: string, patch: Partial<Activity>) => {
    pushHistory(days);
    setDirty(true);
    setDays((d) =>
      d.map((day, i) =>
        i === dayIdx
          ? { ...day, activities: day.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)) }
          : day
      )
    );
  };

  const deleteActivity = (id: string) => {
    pushHistory(days);
    setDirty(true);
    setDays((d) =>
      d.map((day, i) =>
        i === dayIdx
          ? { ...day, activities: day.activities.filter((a) => a.id !== id) }
          : day
      )
    );
  };

  const [newAct, setNewAct] = useState<{ title: string; time?: string; location?: string; cost?: string; notes?: string }>(
    { title: '', time: '', location: '', cost: '', notes: '' }
  );

  const addActivity = () => {
    if (!newAct.title.trim()) return;
    pushHistory(days);
    setDirty(true);
    setDays((d) =>
      d.map((day, i) =>
        i === dayIdx
          ? {
              ...day,
              activities: [
                ...day.activities,
                {
                  id: Math.random().toString(36).slice(2) + Date.now().toString(36),
                  title: newAct.title.trim(),
                  time: newAct.time || undefined,
                  location: newAct.location || undefined,
                  cost: newAct.cost ? Number(newAct.cost) : undefined,
                  notes: newAct.notes || undefined,
                },
              ],
            }
          : day
      )
    );
    setNewAct({ title: '', time: '', location: '', cost: '', notes: '' });
  };

  const save = () => {
    saveItinerary(tripId, days);
    setDirty(false);
    nav(`/itinerary/${tripId}`);
  };

  const cancel = () => {
    nav(`/itinerary/${tripId}`);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="h2">Itinerary Editor</h1>
        <div className="flex gap-2">
          <button onClick={undo} className="px-3 py-2 rounded-xl border border-[--color-border] hover:bg-surface/70">
            Undo
          </button>
          <button onClick={cancel} className="px-3 py-2 rounded-xl border border-[--color-border] hover:bg-surface/70">
            Cancel Changes
          </button>
          <button onClick={save} className="btn-primary">Save Changes</button>
        </div>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 flex-wrap">
        {days.map((d, i) => (
          <button
            key={d.day}
            onClick={() => setDayIdx(i)}
            className={`px-3 py-2 rounded-xl border border-[--color-border] ${
              i === dayIdx ? 'bg-surface' : 'hover:bg-surface/70'
            }`}
          >
            Day {d.day}
          </button>
        ))}
        <Link
          to={`/itinerary/${tripId}`}
          className="ml-auto px-3 py-2 rounded-xl hover:bg-surface/70 border border-[--color-border]"
        >
          Back to Results
        </Link>
      </div>

      {/* Activities list with drag-and-drop */}
      <div className="card p-5 space-y-3">
        <h3 className="font-semibold mb-2">Activities</h3>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="grid gap-3">
              {days[dayIdx]?.activities.map((a) => (
                <SortableActivity
                  key={a.id}
                  a={a}
                  onChange={(patch) => editActivity(a.id, patch)}
                  onDelete={() => deleteActivity(a.id)}
                />
              ))}
              {(!days[dayIdx] || days[dayIdx].activities.length === 0) && (
                <p className="small text-muted">No activities yet. Add your first one below.</p>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Add new activity */}
      <div className="card p-5">
        <h3 className="font-semibold mb-3">Add Activity</h3>
        <div className="grid md:grid-cols-5 gap-3">
          <TextField
            label="Time"
            size="small"
            value={newAct.time}
            onChange={(e) => setNewAct((p) => ({ ...p, time: e.target.value }))}
          />
          <TextField
            label="Title"
            size="small"
            value={newAct.title}
            onChange={(e) => setNewAct((p) => ({ ...p, title: e.target.value }))}
          />
          <TextField
            label="Location"
            size="small"
            value={newAct.location}
            onChange={(e) => setNewAct((p) => ({ ...p, location: e.target.value }))}
          />
          <TextField
            label="Cost"
            size="small"
            type="number"
            value={newAct.cost}
            onChange={(e) => setNewAct((p) => ({ ...p, cost: e.target.value }))}
          />
          <TextField
            className="md:col-span-5"
            label="Notes"
            size="small"
            multiline
            minRows={1}
            maxRows={4}
            value={newAct.notes}
            onChange={(e) => setNewAct((p) => ({ ...p, notes: e.target.value }))}
          />
        </div>
        <div className="mt-3">
          <Button variant="contained" onClick={addActivity}>Add Activity</Button>
          {dirty && <span className="small text-muted ml-3">Unsaved changes</span>}
        </div>
      </div>
    </section>
  );
}
