import { useState } from "react";
import { useThemeMode } from "../hooks/useThemeMode";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

// ---------- Icons ----------
const SaveIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M4 4h12l4 4v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="M12 4v6H6V4" />
  </svg>
);

const CancelIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UndoIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M3 7v6h6" />
    <path d="M3 13a9 9 0 1 1 9 9h-4" />
  </svg>
);

const AddIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EditIcon = ({ className = "w-6 h-6", mode }: { className?: string; mode: "light" | "dark" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={mode === "light" ? "#111827" : "#FFFFFF"}
    strokeWidth="2.5"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);


// ---------- ItineraryEditor ----------
export default function ItineraryEditor() {
  const { mode } = useThemeMode();
  const bgMain = mode === "light" ? "bg-[#FFFFFF]" : "bg-[#142A45]";
  const textColor = mode === "light" ? "#111827" : "#FFFFFF";
  const [items, setItems] = useState([
    "Check-in at Hotel 12:00 PM",
    "Lunch at Circolo Popolare 1:30 PM",
    "Evening Cruise 7:30 PM",
  ]);
  const [newText, setNewText] = useState("");
  const [history, setHistory] = useState<string[][]>([]);
  const navigate = useNavigate();

  // Helpers
  const pushHistory = (prev: string[]) => setHistory((h) => [...h, prev]);

  const addItem = (text: string) => {
    if (!text.trim()) return;
    pushHistory(items);
    setItems([...items, text]);
  };

  const updateItem = (index: number, text: string) => {
    pushHistory(items);
    const next = [...items];
    next[index] = text;
    setItems(next);
  };

  const removeItem = (index: number) => {
    pushHistory(items);
    setItems(items.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    pushHistory(items);
    const updated = Array.from(items);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setItems(updated);
  };

  // Toolbar
  const handleSave = () => {
    navigate("/itinerary/1", { state: { updated: true } });
  };

  const handleCancel = () => {
    navigate("/itinerary/1", { state: { updated: false } });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setItems(prev);
    setHistory(history.slice(0, -1));
  };

  return (
    <div className="px-5 sm:px-6 flex flex-col items-center">
      <div className={`mb-4 w-[800px] max-h-[500px] min-h-[500px] ${bgMain} shadow-sm overflow-y-auto`}>
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <EditIcon className="w-6 h-6" mode={mode} />
            <h1 className={`text-xl font-bold ${textColor}`}>Itinerary Editor</h1>
          </div>
        </div>

        <div className="px-4 py-2 mt-6">
          <p style={{color : "#D0CBCB"}}>
            Edit your trip plan below. You can reorder, modify, or add new activities.
          </p>
          <h3 className={`text-sm font-bold ${textColor}`}>
            Day 1: Arrival & Exploration
          </h3>
        </div>

        <div className="px-4 py-3">
          {/* Drag and Drop */}
          {/* Drag and Drop */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-day1">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {items.map((t, i) => (
                    <Draggable key={`item-${i}`} draggableId={`item-${i}`} index={i}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-[#EDEDED] p-3 rounded-md"
                        >
                          <div
                            className="flex items-center gap-2 bg-white rounded-md shadow-sm px-3 py-2 border border-slate-200"
                          >
                            {/* Drag handle */}
                            <span {...provided.dragHandleProps} className="cursor-grab text-slate-500">
                              ☰
                            </span>

                            {/* Editable input */}
                            <input
                              type="text"
                              value={t}
                              onChange={(e) => updateItem(i, e.target.value)}
                              className="flex-1 border-none bg-transparent focus:ring-0 text-sm text-slate-700"
                            />

                            {/* Delete button */}
                            <button
                              onClick={() => removeItem(i)}
                              className="text-gray-400 hover:text-red-500 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>


          {/* Add new activity */}
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              placeholder="Add a new activity..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className={`flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 ${textColor}`}
            />
            <button
              onClick={() => {
                addItem(newText);
                setNewText("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium shadow hover:opacity-90"
              style={{  backgroundColor: mode === "light" ? "#1D3557" : "#F5A623" }}
            >
              <AddIcon />
              Add
            </button>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-5">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 text-white px-4 py-2 text-sm font-bold shadow hover:opacity-90"
            style={{ background: "#198754" }}
          >
            <SaveIcon />
            Save Changes
          </button>

          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-white px-4 py-2 text-sm font-bold shadow hover:opacity-90"
            style={{ background: "#C0BEBB" }}
          >
            <CancelIcon />
            Cancel Changes
          </button>

          <button
            onClick={handleUndo}
            className="inline-flex items-center gap-2 text-white px-4 py-2 font-bold text-sm shadow hover:opacity-90"
            style={{ background: "#F47984" }}
          >
            <UndoIcon />
            Undo
          </button>
        </div>
      </div>

    </div>
  );
}
