// src/pages/BudgetOverview.tsx
import { Link, useParams } from 'react-router-dom';

type Params = { tripId?: string };

export default function BudgetOverview() {
  const { tripId } = useParams<Params>();

  // Demo numbers (replace later with real computation)
  const totals = { activities: 320, food: 180, transport: 110, misc: 40 };
  const total = Object.values(totals).reduce((a, b) => a + b, 0);

  return (
    <section className="space-y-4">
      <h1 className="h2">Budget Overview{tripId ? ` #${tripId}` : ''}</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-2">Summary</h3>
          <ul className="small opacity-80 space-y-1">
            <li>Activities: ${totals.activities}</li>
            <li>Food: ${totals.food}</li>
            <li>Transport: ${totals.transport}</li>
            <li>Misc: ${totals.misc}</li>
            <li className="mt-2 font-semibold">Total: ${total}</li>
          </ul>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-2">Tips</h3>
          <ul className="small opacity-80 list-disc list-inside space-y-1">
            <li>Book tickets early to save more.</li>
            <li>Use public transport where possible.</li>
            <li>Pick free walking tours and museums.</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2">
        {tripId && (
          <Link to={`/itinerary/${tripId}`} className="btn-secondary">
            Back to Itinerary
          </Link>
        )}
        {tripId && (
          <Link
            to={`/itinerary/${tripId}/edit`}
            className="px-4 py-2 rounded-xl border border-[--color-border] hover:bg-surface/70"
          >
            Adjust Budget
          </Link>
        )}
      </div>
    </section>
  );
}
