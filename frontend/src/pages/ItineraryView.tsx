import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../hooks/useThemeMode";

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

const Icon = {
  luggage: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      {/* suitcase body */}
      <rect x="6" y="7" width="12" height="13" rx="2" />
      {/* suitcase handle */}
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      {/* suitcase wheels */}
      <line x1="9" y1="20" x2="9" y2="22" />
      <line x1="15" y1="20" x2="15" y2="22" />
    </svg>
  ),
  edit: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  ),
  save: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M4 4h12l4 4v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M12 4v6H6V4" />
    </svg>
  ),
  share: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5 15.4 17M15.4 7 8.6 10.5" />
    </svg>
  ),
  trash: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M3 6h18M8 6l1-2h6l1 2M6 6v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
};

export default function ItineraryResultsPage() {
  const [showMap, setShowMap] = useState<boolean>(false);
  const navigate = useNavigate();
  const { mode } = useThemeMode(); // 👈 theme mode

  const cardBg = mode === "light" ? "bg-[#FFFFFF]" : "bg-[#142A45]";
  const textColor = mode === "light" ? "text-[#111827]" : "text-white";

  // ---- handlers ----
  const handleEdit = () => navigate("/itinerary/1/edit");
  const handleSave = () => alert("The trip has been successfully saved..!");
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Itinerary",
          text: "Check out my trip itinerary!",
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      window.print();
    }
  };
  const handleDelete = () => {
    const ok = confirm("Are you sure you want to delete this trip?");
    if (!ok) return;
    alert("The trip has been successfully deleted..!");
    navigate("/profile");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Card */}
      <div className={`${cardBg} shadow-md`}>
        {/* Title row */}
        <div className="px-5 sm:px-6 pt-5 pb-3">
          <div className="relative text-center">
            <div className="flex flex-col items-center flex-1">
              <div className={`flex items-center justify-center gap-2 ${textColor}`}>
                <Icon.luggage className="w-7 h-7" />
                <h1 className={`text-lg sm:text-xl font-bold ${textColor}`}>
                  Your Trip to London
                </h1>
              </div>
              <h2 className="mt-1 text-xs sm:text-sm text-slate-500 font-bold">
                June 15 – June 20, 2025 • 2 Travellers
              </h2>
            </div>

            {/* Show Map toggle */}
            <div className="flex justify-end mt-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  checked={showMap}
                  onChange={(e) => setShowMap(e.target.checked)}
                  aria-controls="itinerary-map"
                  aria-expanded={showMap}
                />
                <span>Show Map</span>
              </label>
            </div>
          </div>
        </div>

        {/* Map */}
        <div
          id="itinerary-map"
          className={`transition-all duration-300 ease-out overflow-hidden ${
            showMap ? "max-h-[600px]" : "max-h-0"
          }`}
        >
          <div className="px-5 sm:px-6 pb-4">
            <div className="rounded border border-slate-200 overflow-hidden">
              <div className="aspect-[16/9] bg-slate-200 flex items-center justify-center">
                <span className="text-slate-600 text-sm">Map goes here</span>
              </div>
            </div>
          </div>
        </div>

        {/* Day blocks */}
        <DayBlock
          title="Day 1: Arrival & Exploration"
          items={[
            "Check-in at Hotel 12:00 PM",
            "Lunch at Circolo Popolare 1:30 PM",
            "Evening Cruise 7:30 PM",
          ]}
        />
        <DayBlock
          title="Day 2: Culture & History"
          items={[
            "Victoria and Albert Museum Tour 9:00 AM",
            "Hideaway Coffee House 12:30 PM",
            "Buckingham Palace 3:00 PM",
          ]}
        />

        {/* Budget */}
        <div className="px-5 sm:px-6 pb-4">
          <div
            className="px-4 py-3 text-sm"
            style={{
              background: "#E9E9E9",
              color: mode === "light" ? "#111827" : "#111827",
            }}
          >
            <span className="font-semibold">Budget Summary:</span>{" "}
            <span className="opacity-80">
              Total: OMR 2,800 | Spent: OMR 1,200 | Remaining: OMR 1,600
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="px-5 sm:px-6 pb-5">
          <div className="flex flex-wrap justify-center gap-3">
            <BarButton color="#1D3557" icon={<Icon.edit className="w-4 h-4" />} onClick={handleEdit}>
              Edit Itinerary
            </BarButton>
            <BarButton color="#198754" icon={<Icon.save className="w-4 h-4" />} onClick={handleSave}>
              Save Trip
            </BarButton>
            <BarButton
              color="#F5A623"
              icon={<Icon.share className="w-4 h-4" />}
              onClick={handleShare}
            >
              Share
            </BarButton>
            <BarButton
              color="#F47984"
              icon={<Icon.trash className="w-4 h-4" />}
              onClick={handleDelete}
            >
              Delete Trip
            </BarButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Pieces ---------- */
function DayBlock({
  title,
  items,
  completed = false,
}: {
  title: string;
  items: string[];
  completed?: boolean;
}) {
  const [checked, setChecked] = useState<boolean[]>(Array(items.length).fill(false));
  const toggleCheck = (i: number) =>
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  return (
    <div className="px-5 sm:px-6">
      <div className="mb-3 overflow-hidden" style={{ background: "#E9E9E9" }}>
        <div className="px-4 py-2 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </div>
        <div className="px-4 py-3">
          <ul className="space-y-2">
            {items.map((t, i) => {
              const isChecked = completed ? true : checked[i];
              return (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => (!completed ? toggleCheck(i) : null)}
                    disabled={completed}
                    className="h-4 w-4 rounded border-slate-400 disabled:opacity-60"
                  />
                  <span className={isChecked ? "line-through text-slate-500" : ""}>{t}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BarButton({
  children,
  color,
  icon,
  onClick,
}: {
  children: React.ReactNode;
  color: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: color }}
      className="inline-flex items-center gap-2 text-white text-xs sm:text-sm px-3 py-2 shadow hover:opacity-90"
    >
      {icon}
      <span className="font-medium">{children}</span>
    </button>
  );
}
