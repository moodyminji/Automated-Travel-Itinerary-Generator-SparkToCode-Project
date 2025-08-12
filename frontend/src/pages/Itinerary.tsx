import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { TripInput, Itinerary as Itin } from '../types/itinerary'
import { generateItinerary } from '../api/itinerary'

export default function Itinerary(){
  const { state } = useLocation() as { state?: { input: TripInput } }
  const [data, setData] = useState<Itin | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    const input = state?.input
    if(!input){ setError('No trip input found. Please start from the Trip page.'); return }
    generateItinerary(input).then(setData).catch(e=>setError(e.message))
  }, [state])

  if(error) return <p className="text-red-600">{error}</p>
  if(!data) return <p>Generating itinerary…</p>

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{data.destination} — {data.startDate} → {data.endDate}</h2>
      <p className="font-medium">Total Estimated Cost: {data.currency} {data.totalEstimatedCost}</p>
      {data.days.map(d=> (
        <article key={d.date} className="border rounded p-3">
          <h3 className="font-semibold">{d.date}</h3>
          <ul className="list-disc pl-6">
            {d.activities.map(a => (<li key={a.id}>{a.name} {a.price ? `— $${a.price}` : ''}</li>))}
          </ul>
          <strong>Day Cost: {data.currency} {d.estimatedCost}</strong>
        </article>
      ))}
    </section>
  )
}