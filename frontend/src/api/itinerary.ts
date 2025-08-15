import { http } from "./http";
import type { TripInput, Itinerary } from "../types/itinerary";
import { generateMockItinerary } from "../mocks/mockData";

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true") === "true";

export async function generateItinerary(input: TripInput): Promise<Itinerary> {
  if (USE_MOCK) return generateMockItinerary(input);
  const { data } = await http.post<Itinerary>("/api/itineraries/generate", input);
  return data;
}

export async function getItineraryById(id: string): Promise<Itinerary> {
  if (USE_MOCK) {
    return generateMockItinerary({
      destination: "Mock City",
      startDate: "2025-01-01",
      endDate: "2025-01-03",
      budget: 1000,
      interests: ["food", "culture"],
      origin: "Mock Origin",
    });
  }

  const { data } = await http.get<Itinerary>(`/api/itineraries/${id}`);
  return data;
}

export async function pingBackend(): Promise<boolean> {
  try {
    await http.get("/api/health");
    return true;
  } catch {
    return false;
  }
}
