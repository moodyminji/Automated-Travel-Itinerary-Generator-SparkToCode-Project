import type { TripInput, Itinerary } from '../types/itinerary'

export function generateMockItinerary(input: TripInput): Itinerary {
  const days = [
    { date: input.startDate, activities: [
      { id: 'a1', name: 'City Walking Tour', durationMins: 120, price: 25 },
      { id: 'a2', name: 'Museum Visit', durationMins: 90, price: 15 }
    ], estimatedCost: 50 },
    { date: input.endDate, activities: [
      { id: 'a3', name: 'Park & Coffee', durationMins: 60, price: 10 }
    ], estimatedCost: 10 }
  ]
  const total = days.reduce((s,d)=>s+d.estimatedCost,0)
  return {
    id: 'mock-1',
    destination: input.destination,
    startDate: input.startDate,
    endDate: input.endDate,
    currency: 'USD',
    days,
    totalEstimatedCost: total
  }
}