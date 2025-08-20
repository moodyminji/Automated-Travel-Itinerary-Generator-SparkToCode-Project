import { FaChartPie, FaCalendarDay, FaLightbulb, FaEdit } from "react-icons/fa";
import { useThemeMode } from "../hooks/useThemeMode";
import { useNavigate, useParams } from "react-router-dom";

// Spending breakdown data
const spendingData = [
  { name: "Accommodation", value: 1000, color: "#3598DB" },
  { name: "Transport", value: 390, color: "#2DCC70" },
  { name: "Food", value: 450, color: "#F39C11" },
  { name: "Shopping", value: 200, color: "#975AB5" },
  { name: "Activities", value: 600, color: "#E84C3D" },
];

// Daily costs data
const dailyCosts = [
  { day: "Day 1: Arrival & Dinner", cost: 180 },
  { day: "Day 2: Museum Tour", cost: 150 },
  { day: "Day 3: Mountain Hike", cost: 220 },
  { day: "Day 4: Shopping Day", cost: 130 },
  { day: "Day 5: Spa & Relax", cost: 175 },
];

export default function BudgetOverview() {
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();

  const totalBudget = 3000;
  const spent = 2500;

  // Theme-based colors
  const bgMain = mode === "light" ? "bg-[#FFFFFF]" : "bg-[#142A45]";
  const cardBg = mode === "light" ? "bg-white" : "bg-[#B6CDE8]";
  const textColor = mode === "light" ? "text-gray-900" : "text-black"; // dark mode: black text
  const tipBg = mode === "light" ? "bg-gray-100" : "bg-[#F6F4EF]";
  const tipTextColor = mode === "light" ? textColor : "text-black";
  const borderColor = mode === "light" ? "border-gray-300" : "border-black"; // Daily Costs lines

  return (
    <div className={`max-h-[800px] max-w-[1100px] bg-gradient-to-b ${bgMain} flex flex-col items-center py-10 mx-auto`}>
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <h1 className={`text-2xl font-bold text-center`}>Budget Overview</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Spending Breakdown */}
          <div className={`${cardBg} p-6 shadow-md`}>
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textColor}`}>
              <FaChartPie style={{ color: "#F5A623" }} /> Spending Breakdown
            </h2>
            <div className="mb-4 p-3 text-white font-bold text-center" style={{ backgroundColor: "#F5A623" }}>
              OMR {spent} <br />
              <span className="text-sm font-normal">Total spent of OMR {totalBudget}</span>
            </div>

            <div className="flex justify-center">
              <svg viewBox="0 0 32 32" width="200" height="200">
                {(() => {
                  const total = spendingData.reduce((sum, item) => sum + item.value, 0);
                  let cumulative = 0;
                  return spendingData.map((slice, i) => {
                    const [startX, startY] = [
                      16 + 16 * Math.cos((2 * Math.PI * cumulative) / total),
                      16 + 16 * Math.sin((2 * Math.PI * cumulative) / total),
                    ];
                    cumulative += slice.value;
                    const [endX, endY] = [
                      16 + 16 * Math.cos((2 * Math.PI * cumulative) / total),
                      16 + 16 * Math.sin((2 * Math.PI * cumulative) / total),
                    ];
                    const largeArc = slice.value / total > 0.5 ? 1 : 0;
                    return (
                      <path
                        key={i}
                        d={`M16,16 L${startX},${startY} A16,16 0 ${largeArc} 1 ${endX},${endY} Z`}
                        fill={slice.color}
                        stroke={mode === "light" ? "white" : "#B6CDE8"}
                        strokeWidth="0.5"
                      />
                    );
                  });
                })()}
              </svg>
            </div>

            {/* Legend with black text */}
            {/* Legend with black text in custom lines */}
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {/* Line 1: Accommodation & Food */}
              {spendingData.slice(0, 1).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="inline-block flex-shrink-0"
                    style={{ background: item.color, width: "50px", height: "15px" }}
                  ></span>
                  <span style={{ color: "black" }} className="font-medium">
                    {item.name}
                  </span>
                </div>
              ))}
              {spendingData.slice(2, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="inline-block flex-shrink-0"
                    style={{ background: item.color, width: "50px", height: "15px" }}
                  ></span>
                  <span style={{ color: "black" }} className="font-medium">
                    {item.name}
                  </span>
                </div>
              ))}

              {/* Line 2: Transport & Activities */}
              {spendingData.slice(1, 2).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="inline-block flex-shrink-0"
                    style={{ background: item.color, width: "50px", height: "15px" }}
                  ></span>
                  <span style={{ color: "black" }} className="font-medium">
                    {item.name}
                  </span>
                </div>
              ))}
              {spendingData.slice(4, 5).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="inline-block flex-shrink-0"
                    style={{ background: item.color, width: "50px", height: "15px" }}
                  ></span>
                  <span style={{ color: "black" }} className="font-medium">
                    {item.name}
                  </span>
                </div>
              ))}

              {/* Line 3: Shopping */}
              {spendingData.slice(3, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-2 col-span-2">
                  <span
                    className="inline-block flex-shrink-0"
                    style={{ background: item.color, width: "50px", height: "15px" }}
                  ></span>
                  <span style={{ color: "black" }} className="font-medium">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Daily Costs & Budget Tips */}
          <div className={`${cardBg} p-6 shadow-md`}>
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textColor}`}>
              <FaCalendarDay style={{ color: "#F5A623" }} /> Daily Costs
            </h2>
            {/* Daily Costs */}
            <div className="space-y-2 mb-6">
              {dailyCosts.map((item, index) => (
                <div key={index} className={`flex justify-between border-b pb-1 ${borderColor}`}>
                  {/* Day text - always black */}
                  <span className="font-medium text-black">{item.day}</span>

                  {/* Price text - always #F5A623 */}
                  <span className="font-bold" style={{ color: "#F5A623" }}>
                    OMR {item.cost}
                  </span>
                </div>
              ))}
            </div>


            {/* Budget Tips Card */}
            <div className={`${tipBg} p-4 shadow-sm mb-6`}>
              <h2 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tipTextColor}`}>
                <FaLightbulb style={{ color: "#F5A623" }} /> Budget Tips
              </h2>
              <ul className={`list-disc ml-6 text-sm space-y-1 ${tipTextColor}`}>
                <li>Book online: Skip the line & save 15% on tickets.</li>
                <li>Mid-week stays: Hotels are cheaper Sunday - Thursday.</li>
                <li>Visit free beaches: Many are stunning and uncrowded.</li>
                <li>Explore forts: Low entry fees and rich history.</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3">
              <button
                className="px-5 py-2 font-bold text-white hover:opacity-90"
                style={{ background: "#F5A623" }}
                onClick={() => navigate(`/itinerary/${tripId}`)}
              >
                Back to Itinerary
              </button>

              <button
                className="px-5 py-2 font-bold flex items-center gap-2 hover:opacity-90"
                style={
                  mode === "dark"
                    ? { background: "#ffffff", color: "#F5A623", border: "2px solid #F5A623" }
                    : { background: "#1D3557", color: "white" }
                }
                onClick={() => navigate(`/itinerary/${tripId}/edit`)}
              >
                <FaEdit /> Adjust Budget
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
