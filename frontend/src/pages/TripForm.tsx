// src/pages/TripForm.tsx
import React, { useRef, useState } from "react";
import { Calendar as CalIcon, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../hooks/useThemeMode";

interface TripData {
  destination: string;
  startDate: string; // dd-mm-yyyy
  endDate: string;   // dd-mm-yyyy
  budget: number;
  travelers: number;
  interests: string[];
  travelStyle: "Luxury" | "Budget" | "Comfort";
}

const ACCENT = "#F4A83F";
const CARD_DARK = "#122033";
const TEXT_DARK = "#DDE9F7";
const SUBTEXT_DARK = "#B6C2D4";
const ERROR_RED = "#EF4444";

// lightweight client-side suggestions
const DESTINATIONS = [
  "Muscat, Oman",
  "Salalah, Oman",
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Doha, Qatar",
  "Riyadh, Saudi Arabia",
  "Jeddah, Saudi Arabia",
  "Manama, Bahrain",
  "Kuwait City, Kuwait",
  "Cairo, Egypt",
  "Istanbul, Türkiye",
  "Amman, Jordan",
  "Beirut, Lebanon",
  "Marrakesh, Morocco",
];

/* --------------------------- Date helpers --------------------------- */
// normalize partial typing to dd-mm-yyyy (digits only -> add dashes)
function normalizeDmy(input: string): string {
  const digits = input.replace(/[^\d]/g, "").slice(0, 8); // ddmmyyyy (max 8)
  const parts: string[] = [];
  if (digits.length >= 2) parts.push(digits.slice(0, 2));
  if (digits.length >= 4) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4));
  return parts.join("-").slice(0, 10);
}

function isValidDmy(dmy: string): boolean {
  if (!/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(dmy)) return false;
  const [dd, mm, yyyy] = dmy.split("-").map(Number);
  const d = new Date(yyyy, mm - 1, dd);
  return d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd;
}

function dmyToYmd(dmy: string): string | null {
  if (!isValidDmy(dmy)) return null;
  const [dd, mm, yyyy] = dmy.split("-");
  return `${yyyy}-${mm}-${dd}`;
}
function ymdToDmy(ymd: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [yyyy, mm, dd] = ymd.split("-");
  return `${dd}-${mm}-${yyyy}`;
}
function dmyToDate(dmy: string): Date | null {
  if (!isValidDmy(dmy)) return null;
  const [dd, mm, yyyy] = dmy.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

/** Safely open the native date picker for a hidden <input type="date"> */
type HTMLDateInput = HTMLInputElement & { showPicker?: () => void };
function openNativePicker(
  ref: React.RefObject<HTMLInputElement | null>,
  currentDmy: string
) {
  const el = ref.current as HTMLDateInput | null;
  if (!el) return;
  const pre = dmyToYmd(currentDmy);
  if (pre) el.value = pre;
  if (typeof el.showPicker === "function") el.showPicker();
  else el.click();
}

/* --------------------------- Component --------------------------- */
const TripForm: React.FC = () => {
  const { mode } = useThemeMode();
  const nav = useNavigate();

  const [tripData, setTripData] = useState<TripData>({
    destination: "",
    startDate: "",
    endDate: "",
    budget: 2000,
    travelers: 2,
    interests: [],
    travelStyle: "Comfort",
  });

  const [destinationQuery, setDestinationQuery] = useState("");
  const [openSuggestions, setOpenSuggestions] = useState(false);

  // Derived validation
  const budgetError = tripData.budget <= 0;
  const dateOrderError = (() => {
    const s = dmyToDate(tripData.startDate);
    const e = dmyToDate(tripData.endDate);
    if (!s || !e) return false; // only check order when both valid
    return e.getTime() < s.getTime();
  })();

  const isFormValid =
    tripData.destination &&
    isValidDmy(tripData.startDate) &&
    isValidDmy(tripData.endDate) &&
    !budgetError &&
    !dateOrderError;

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
  const iconColor = isDark ? "#94A3B8" : "#9CA3AF";

  // LEFT inline SVG icons (keeps your design)
  const searchSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='${iconColor}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>`
  );
  const calSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='${iconColor}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='4' width='18' height='18' rx='2' ry='2'/><line x1='16' y1='2' x2='16' y2='6'/><line x1='8' y1='2' x2='8' y2='6'/><line x1='3' y1='10' x2='21' y2='10'/></svg>`
  );

  const suggestions =
    destinationQuery.trim().length < 1
      ? []
      : DESTINATIONS.filter((d) =>
          d.toLowerCase().includes(destinationQuery.toLowerCase())
        ).slice(0, 8);

  // navigate
  const handleCancel = () => nav("/profile");
  const handleGenerate = () => {
    if (!isFormValid) return;
    nav("/itinerary/1", { state: { tripData } });
  };

  // refs for hidden native date inputs
  const depNativeRef = useRef<HTMLInputElement | null>(null);
  const retNativeRef = useRef<HTMLInputElement | null>(null);

  return (
    // No page background here — we rely on Layout's background
    <div className="min-h-screen flex flex-col">
      {/* Hide native Chrome controls on our visible inputs */}
      <style>{`
        .no-native::-webkit-calendar-picker-indicator { display: none; }
        .no-native::-webkit-inner-spin-button,
        .no-native::-webkit-clear-button { display: none; }
      `}</style>

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
              <input
                id="destination"
                type="text"
                value={destinationQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setDestinationQuery(v);
                  setTripData((prev) => ({ ...prev, destination: v }));
                  setOpenSuggestions(true);
                }}
                onFocus={() => setOpenSuggestions(true)}
                onBlur={() => setTimeout(() => setOpenSuggestions(false), 100)}
                placeholder="e.g., Muscat, Oman"
                className="w-full pr-12 py-3 border rounded-xl focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  borderColor: "#d1d5db",
                  boxShadow: "inset 0 0 0 1px transparent",
                  backgroundImage: `url("data:image/svg+xml;utf8,${searchSvg}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "12px 50%",
                  backgroundSize: "20px 20px",
                  paddingLeft: "48px",
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

              {/* Autocomplete dropdown */}
              {openSuggestions && suggestions.length > 0 && (
                <ul
                  className="absolute z-20 mt-2 w-full max-h-56 overflow-auto rounded-xl border"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                  }}
                >
                  {suggestions.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setDestinationQuery(s);
                          setTripData((prev) => ({ ...prev, destination: s }));
                          setOpenSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        style={{ color: "#0f172a" }}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <div>
              <label
                htmlFor="departure_text"
                className="block text-sm font-semibold mb-2"
                style={{ color: isDark ? TEXT_DARK : "#111827" }}
              >
                Departure Date
              </label>
              <div className="relative">
                {/* Visible text input (dd-mm-yyyy) */}
                <input
                  id="departure_text"
                  type="text"
                  inputMode="numeric"
                  placeholder="dd-mm-yyyy"
                  value={tripData.startDate}
                  onChange={(e) =>
                    setTripData((p) => ({ ...p, startDate: normalizeDmy(e.target.value) }))
                  }
                  className="no-native w-full py-3 border rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    borderColor: "#d1d5db",
                    backgroundImage: `url("data:image/svg+xml;utf8,${calSvg}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "12px 50%",
                    backgroundSize: "20px 20px",
                    paddingLeft: "48px",
                    paddingRight: "44px",
                  }}
                  aria-invalid={!isValidDmy(tripData.startDate)}
                />
                {/* Hidden native input to open the calendar */}
                <input
                  ref={depNativeRef}
                  type="date"
                  className="sr-only"
                  onChange={(e) => {
                    const dmy = ymdToDmy(e.target.value) ?? "";
                    setTripData((p) => ({ ...p, startDate: dmy }));
                  }}
                />
                <button
                  type="button"
                  aria-label="Open date picker"
                  title="Open date picker"
                  onClick={() => openNativePicker(depNativeRef, tripData.startDate)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: isDark ? SUBTEXT_DARK : "#0f172a" }}
                >
                  <CalIcon size={18} />
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="return_text"
                className="block text-sm font-semibold mb-2"
                style={{ color: isDark ? TEXT_DARK : "#111827" }}
              >
                Return Date
              </label>
              <div className="relative">
                <input
                  id="return_text"
                  type="text"
                  inputMode="numeric"
                  placeholder="dd-mm-yyyy"
                  value={tripData.endDate}
                  onChange={(e) =>
                    setTripData((p) => ({ ...p, endDate: normalizeDmy(e.target.value) }))
                  }
                  className="no-native w-full py-3 border rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    borderColor: dateOrderError ? ERROR_RED : "#d1d5db",
                    backgroundImage: `url("data:image/svg+xml;utf8,${calSvg}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "12px 50%",
                    backgroundSize: "20px 20px",
                    paddingLeft: "48px",
                    paddingRight: "44px",
                  }}
                  aria-invalid={dateOrderError || !isValidDmy(tripData.endDate)}
                />
                <input
                  ref={retNativeRef}
                  type="date"
                  className="sr-only"
                  onChange={(e) => {
                    const dmy = ymdToDmy(e.target.value) ?? "";
                    setTripData((p) => ({ ...p, endDate: dmy }));
                  }}
                />
                <button
                  type="button"
                  aria-label="Open date picker"
                  title="Open date picker"
                  onClick={() => openNativePicker(retNativeRef, tripData.endDate)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: isDark ? SUBTEXT_DARK : "#0f172a" }}
                >
                  <CalIcon size={18} />
                </button>
              </div>
              {dateOrderError && (
                <p className="mt-1 text-sm" style={{ color: ERROR_RED }}>
                  Return date cannot be before departure date.
                </p>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-6 mt-4">
            <label
              htmlFor="budget"
              className="block text-sm font-semibold mb-2"
              style={{ color: isDark ? TEXT_DARK : "#111827" }}
            >
              Budget (OMR)
            </label>
            <div className="flex items-center gap-3">
              <span
                className="px-2 py-1 rounded-md text-xs font-semibold"
                style={{
                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6",
                  color: isDark ? TEXT_DARK : "#111827",
                }}
              >
                OMR
              </span>
              <input
                id="budget"
                type="number"
                value={tripData.budget}
                onChange={(e) =>
                  setTripData((prev) => ({
                    ...prev,
                    budget: parseInt(e.target.value || "0", 10),
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  borderColor: budgetError ? ERROR_RED : "#d1d5db",
                }}
                aria-invalid={budgetError}
              />
            </div>
            {budgetError && (
              <p className="mt-1 text-sm" style={{ color: ERROR_RED }}>
                Budget must be greater than 0 OMR.
              </p>
            )}
          </div>

          {/* Travel Style */}
          <div className="mb-8">
            <label
              className="block text-sm font-semibold mb-3"
              style={{ color: isDark ? TEXT_DARK : "#111827" }}
            >
              Travel style
            </label>
            <div className="flex flex-wrap gap-3">
              {(["Luxury", "Budget", "Comfort"] as TripData["travelStyle"][]).map((opt) => {
                const active = tripData.travelStyle === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTripData((p) => ({ ...p, travelStyle: opt }))}
                    className="px-4 py-2 rounded-xl border font-semibold transition"
                    style={{
                      borderColor: active ? ACCENT : isDark ? "rgba(255,255,255,0.18)" : "#e5e7eb",
                      color: active ? ACCENT : isDark ? TEXT_DARK : "#111827",
                      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#fff",
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
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
              onClick={handleCancel}
              type="button"
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
              onClick={handleGenerate}
              type="button"
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
