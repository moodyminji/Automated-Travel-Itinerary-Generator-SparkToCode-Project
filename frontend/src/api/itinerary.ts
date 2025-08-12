import type { TripInput, Itinerary } from '../types/itinerary'
import { generateMockItinerary } from '../mocks/mockData'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080'
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'

export async function generateItinerary(input: TripInput): Promise<Itinerary> {
  if (USE_MOCK) return generateMockItinerary(input)

  const res = await fetch(`${API_BASE}/api/itineraries/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`Failed to generate itinerary (${res.status})`)
  return res.json()
}