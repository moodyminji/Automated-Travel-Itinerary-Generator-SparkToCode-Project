import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TripInput as TI } from '../types/itinerary'

export default function TripInput() {
  const navigate = useNavigate()
  const [form, setForm] = useState<TI>({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 1000
  })
  function update<K extends keyof TI>(k: K, v: TI[K]){ setForm(f=>({ ...f, [k]: v })) }
  function onSubmit(e: React.FormEvent){ e.preventDefault(); navigate('/itinerary', { state: { input: form } }) }
  return (
    <form onSubmit={onSubmit} className="max-w-md grid gap-3">
      <h2 className="text-xl font-semibold">Plan Your Trip</h2>
      <input className="border p-2 rounded" placeholder="Origin" value={form.origin} onChange={e=>update('origin', e.target.value)} required />
      <input className="border p-2 rounded" placeholder="Destination" value={form.destination} onChange={e=>update('destination', e.target.value)} required />
      <label className="grid gap-1">Start Date <input type="date" className="border p-2 rounded" value={form.startDate} onChange={e=>update('startDate', e.target.value)} required /></label>
      <label className="grid gap-1">End Date <input type="date" className="border p-2 rounded" value={form.endDate} onChange={e=>update('endDate', e.target.value)} required /></label>
      <label className="grid gap-1">Budget (USD) <input type="number" className="border p-2 rounded" value={form.budget} onChange={e=>update('budget', Number(e.target.value))} min={0} /></label>
      <button className="bg-blue-600 text-white rounded px-4 py-2" type="submit">Generate Itinerary</button>
    </form>
  )
}