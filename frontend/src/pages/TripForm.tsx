// src/pages/TripForm.tsx
import React, { useState } from "react";
import { Calendar, DollarSign, Users, Search, X } from "lucide-react";
import { useThemeMode } from "../hooks/useThemeMode"; // for dark-mode styling

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests: string[];
}

const ACCENT = "#F4A83F";
const CARD_DARK = "#122033";
const TEXT_DARK = "#DDE9F7";
const SUBTEXT_DARK = "#B6C2D4";

const TripForm: React.FC = () => {
  const { mode } = useThemeMode();

  const [tripData, setTripData] = useState<TripData>({
    destination: "",
    startDate: "",
    endDate: "",
    budget: 2000,
    travelers: 2,
    interests: [],
  });

  const [destinationQuery, setDestinationQuery] = useState("");

  const isFormValid =
    tripData.destination && tripData.startDate && tripData.endDate;

  // اهتمامات المستخدم
  const interests = [
    "Beach",
    "Food",
    "Nature",
    "Relaxation",
    "History",
    "Shopping",
    "Entertainment",
  ];

  const toggleInterest = (interest: string) => {
    setTripData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const isDark = mode === "dark";

  return (
    // No page background here — we rely on Layout's background
    <div className="min-h-screen flex flex-col">
      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div
          className="rounded-2xl shadow-xl p-8 w-full max-w-3xl"
          style={{
            backgroundColor: isDark ? CARD_DARK : "#ffffff",
            border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e5e7eb",
          }}
        >
          <h1
            className="text-center text-3xl font-extrabold mb-6"
            style={{ color: isDark ? TEXT_DARK : "#122033" }}
          >
            Plan Your Trip
          </h1>

          {/* Destination */}
          <div className="mb-6">
            <label
              htmlFor="destination"
              className="block text-sm font-semibold mb-2"
              style={{ color: isDark ? TEXT_DARK : "#111827" }}
            >
              Where do you want to go?
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: isDark ? SUBTEXT_DARK : "#9ca3af" }}
              />
              <input
                id="destination"
                type="text"
                value={destinationQuery}
                onChange={(e) => {
                  setDestinationQuery(e.target.value);
                  setTripData((prev) => ({
                    ...prev,
                    destination: e.target.value,
                  }));
                }}
                placeholder="e.g., Muscat, Oman"
                className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  borderColor: "#d1d5db",
                  boxShadow: "inset 0 0 0 1px transparent",
                }}
              />
              {destinationQuery && (
                <button
                  onClick={() => {
                    setDestinationQuery("");
                    setTripData((prev) => ({ ...prev, destination: "" }));
                  }}
                  aria-label="Clear destination"
                  title="Clear destination"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: isDark ? SUBTEXT_DARK : "#9ca3af" }}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="departure"
                className="block text-sm font-semibold mb-2"
                style={{ color: isDark ? TEXT_DARK : "#111827" }}
              >
                Departure Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: isDark ? SUBTEXT_DARK : "#9ca3af" }}
                />
                <input
                  id="departure"
                  type="date"
                  value={tripData.startDate}
                  onChange={(e) =>
                    setTripData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    borderColor: "#d1d5db",
                  }}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="return"
                className="block text-sm font-semibold mb-2"
                style={{ color: isDark ? TEXT_DARK : "#111827" }}
              >
                Return Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: isDark ? SUBTEXT_DARK : "#9ca3af" }}
                />
                <input
                  id="return"
                  type="date"
                  value={tripData.endDate}
                  onChange={(e) =>
                    setTripData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    borderColor: "#d1d5db",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="mb-6">
            <label
              htmlFor="budget"
              className="block text-sm font-semibold mb-2"
              style={{ color: isDark ? TEXT_DARK : "#111827" }}
            >
              Budget (OMR)
            </label>
            <div className="flex items-center gap-3">
              <DollarSign style={{ color: "#16a34a" }} />
              <input
                id="budget"
                type="number"
                value={tripData.budget}
                onChange={(e) =>
                  setTripData((prev) => ({
                    ...prev,
                    budget: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  borderColor: "#d1d5db",
                }}
              />
            </div>
          </div>

          {/* Interests */}
          <div className="mb-8">
            <label
              className="block text-sm font-semibold mb-4"
              style={{ color: isDark ? TEXT_DARK : "#111827" }}
            >
              What are you interested in?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {interests.map((interest) => (
                <label
                  key={interest}
                  className="flex items-center gap-2"
                  style={{ color: isDark ? SUBTEXT_DARK : "#374151" }}
                >
                  <input
                    type="checkbox"
                    checked={tripData.interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Travelers */}
          <div className="mb-8">
            <label
              htmlFor="travelers"
              className="block text-sm font-semibold mb-2"
              style={{ color: isDark ? TEXT_DARK : "#111827" }}
            >
              How many people are travelling?
            </label>
            <div className="flex items-center gap-3">
              <button
                aria-label="Decrease travelers"
                title="Decrease travelers"
                onClick={() =>
                  setTripData((prev) => ({
                    ...prev,
                    travelers: Math.max(1, prev.travelers - 1),
                  }))
                }
                className="px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#f3f4f6",
                  color: isDark ? TEXT_DARK : "#111827",
                }}
              >
                -
              </button>
              <div
                className="flex items-center gap-2"
                style={{ color: isDark ? TEXT_DARK : "#374151" }}
              >
                <Users />
                <span className="font-semibold">{tripData.travelers}</span>
              </div>
              <button
                aria-label="Increase travelers"
                title="Increase travelers"
                onClick={() =>
                  setTripData((prev) => ({
                    ...prev,
                    travelers: prev.travelers + 1,
                  }))
                }
                className="px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#f3f4f6",
                  color: isDark ? TEXT_DARK : "#111827",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              className="px-6 py-3 rounded-xl font-semibold shadow-sm"
              style={{
                backgroundColor: ACCENT,
                color: "#1F2937",
              }}
            >
              Cancel
            </button>
            <button
              className="px-6 py-3 rounded-xl font-semibold border shadow-sm"
              style={{
                backgroundColor: isDark ? CARD_DARK : "#ffffff",
                borderColor: ACCENT,
                color: ACCENT,
              }}
              disabled={!isFormValid}
            >
              Generate Itinerary
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripForm;
