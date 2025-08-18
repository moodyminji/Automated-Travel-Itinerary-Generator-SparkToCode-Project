import { useState } from 'react';
import { Link } from 'react-router-dom';

type N = { id: string; text: string; read?: boolean; tripId?: string };

export default function NotificationsCenter() {
  const [items, setItems] = useState<N[]>([
    { id: '1', text: 'Weather update: Light rain expected on Day 2', tripId: '123' },
    { id: '2', text: 'Flight reminder: Check-in opens in 24 hours', tripId: '123' },
  ]);

  const markRead = (id: string) => setItems(prev => prev.map(n => n.id===id? {...n, read:true}:n));
  const remove = (id: string) => setItems(prev => prev.filter(n => n.id !== id));

  return (
    <section className="space-y-4">
      <h1 className="h2">Notifications</h1>
      <div className="grid gap-3">
        {items.map(n => (
          <div key={n.id} className="card p-4 flex items-center justify-between">
            <div className={`small ${n.read? 'opacity-50':'opacity-90'}`}>{n.text}</div>
            <div className="flex gap-2">
              {n.tripId && <Link to={`/itinerary/${n.tripId}`} className="px-3 py-2 rounded-xl border border-[--color-border] hover:bg-surface/70">View Trip</Link>}
              <button onClick={()=>markRead(n.id)} className="px-3 py-2 rounded-xl hover:bg-surface/70 border border-[--color-border]">Mark as Read</button>
              <button onClick={()=>remove(n.id)} className="btn-secondary">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
