import { useState } from "react";
import { Link } from "react-router-dom";
import { useThemeMode } from "../hooks/useThemeMode";

type Notification = {
  id: string;
  title: string;
  time: string;
  message: string;
  read?: boolean;
  tripId?: string;
};

export default function NotificationsCenter() {
  const { mode } = useThemeMode(); // get current theme
  const [items, setItems] = useState<Notification[]>([
    {
      id: "1",
      title: "Reminder: Passport Expiry",
      time: "Today at 3:35 PM",
      message:
        "Your passport expires in 28 days. Renew it before your trip to London.",
      tripId: "london",
    },
    {
      id: "2",
      title: "Weather Alert: Rain in Rome",
      time: "Tomorrow, 10:00 AM",
      message:
        "Heavy rain expected on Day 2 of your London trip. Consider indoor activities.",
      tripId: "rome",
    },
    {
      id: "3",
      title: "Flight Update: Delayed",
      time: "Today, 08:30 AM",
      message:
        "Your flight Airbus A330 to London has been delayed by 1h 30m. Check details.",
      tripId: "london",
    },
  ]);

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const remove = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  const containerBg = mode === "light" ? "bg-[#FFFFFF]" : "bg-[#142A45]";
  const titleColor = mode === "light" ? "#111827" : "#FFFFFF";
  const textColor = mode === "light" ? "black" : "white";

  return (
    <div className={`max-h-[800px] max-w-[900px] bg-gradient-to-b ${containerBg} flex flex-col items-center py-10 mx-auto`}>
      <section className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-center" style={{ color: titleColor }}>
          Notifications Center
        </h1>
        <div className="space-y-4">
          {items.map((n) => (
            <div
              key={n.id}
              className={`p-4 shadow-sm flex items-center justify-between gap-4 rounded ${
                n.read
                  ? mode === "light"
                    ? "bg-white"
                    : "bg-gray-800"
                  : mode === "light"
                  ? "bg-gray-100"
                  : "bg-gray-700"
              }`}
            >
              {/* Left side: notification content */}
              <div className="flex-1 space-y-1">
                <h2 className={`font-bold`} style={{ color: textColor }}>{n.title}</h2>
                <p className="text-xs" style={{ color: textColor }}>{n.time}</p>
                <p className="text-sm" style={{ color: textColor }}>{n.message}</p>
              </div>

              {/* Right side: buttons */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => markRead(n.id)}
                  className="px-3 py-1 font-bold text-sm rounded"
                  style={{
                    background: mode === "dark" ? "#F5A623" : "#1D3557",
                    color: "white",
                  }}
                >
                  {n.read ? "Read" : "Mark as Read"}
                </button>

                {n.tripId && (
                  <Link
                    to={`/itinerary/${n.tripId}`}
                    className="px-3 py-1 font-bold text-sm rounded flex items-center justify-center"
                    style={
                      mode === "dark"
                        ? {
                            background: "#FFFFFF",
                            color: "#F5A623",
                            border: "2px solid #F5A623",
                          }
                        : {
                            background: "#F5A623",
                            color: "white",
                          }
                    }
                  >
                    View Trip
                  </Link>
                )}

                <button
                  onClick={() => remove(n.id)}
                  className="px-3 py-1 font-bold text-white text-sm rounded"
                  style={{ background: "#F47984" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
