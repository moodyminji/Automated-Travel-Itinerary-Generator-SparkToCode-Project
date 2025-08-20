// src/pages/AdminDashboard.tsx
import React from "react";
import type { JSX } from "react";
import { FileWarning, Users, KeyRound, Cog, Download } from "lucide-react";
import { useThemeMode } from "../hooks/useThemeMode";

/* ---------- Data types ---------- */
type Level = "Info" | "Warning" | "Error";
type UserStatus = "Active" | "Banned";

interface Metric {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}
interface UserRow {
  name: string;
  email: string;
  status: UserStatus;
}
interface LogRow {
  time: string;
  level: Level;
  message: string;
  user: string;
}
interface ErrorRow {
  error: string;
  count: number;
  first: string;
  last: string;
}

/* ---------- Demo Data ---------- */
const initialMetrics: Metric[] = [
  { title: "Total Users", value: "1247", sub: "892 currently active", icon: <Users className="h-5 w-5 text-slate-500" /> },
  { title: "Total Errors", value: "16", sub: "Across 3 unique errors", icon: <FileWarning className="h-5 w-5 text-red-500" /> },
  { title: "Destinations", value: "4", sub: "3 healthy", icon: <Cog className="h-5 w-5 text-emerald-500" /> },
  { title: "Log Entries", value: "5", sub: "Last 24 hours", icon: <KeyRound className="h-5 w-5 text-indigo-500" /> },
];

const initialUsers: UserRow[] = [
  { name: "John Doe", email: "john@example.com", status: "Active" },
  { name: "Sarah Johnson", email: "sarah@example.com", status: "Active" },
  { name: "Mike Wilson", email: "mike@example.com", status: "Active" },
  { name: "Emily Brown", email: "emily@example.com", status: "Banned" },
];

const initialLogs: LogRow[] = [
  { time: "2025-08-13 14:30:22", level: "Info",    message: "User login successfully",    user: "johndoe@example.com" },
  { time: "2025-08-13 14:25:18", level: "Warning", message: "High memory usage detected", user: "System" },
  { time: "2025-08-13 14:20:45", level: "Error",   message: "Database connection timeout", user: "System" },
  { time: "2025-08-13 14:10:12", level: "Info",    message: "File upload completed",       user: "sarah@example.com" },
];

const initialErrors: ErrorRow[] = [
  { error: "Database connection timeout", count: 5, first: "2025-08-13 14:20:45", last: "2025-08-13 14:20:45" },
  { error: "Payment processing failed",   count: 3, first: "2025-08-13 14:10:12", last: "2025-08-13 14:10:12" },
  { error: "File upload size exceeded",   count: 8, first: "2025-08-13 13:45:22", last: "2025-08-13 13:45:22" },
];

/* ---------- Small UI helpers ---------- */
function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, string> = {
    Active: "bg-slate-900 text-white",
    Banned: "bg-rose-200 text-rose-800",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>{status}</span>;
}

function LevelBadge({ level }: { level: Level }) {
  const map: Record<Level, string> = {
    Info: "bg-slate-100 text-slate-700",
    Warning: "bg-amber-100 text-amber-700",
    Error: "bg-rose-100 text-rose-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[level]}`}>{level}</span>;
}

/* ---------- CSV helpers ---------- */
const EOL = "\n";
function csvEscapeCell(c: unknown): string {
  const s = String(c ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}
function logsToCSV(rows: LogRow[]): string {
  const header = ["Timestamp", "Level", "Message", "User"].join(",");
  const body = rows.map((r) => [r.time, r.level, r.message, r.user].map(csvEscapeCell).join(",")).join(EOL);
  return body ? `${header}${EOL}${body}` : header;
}

/* ---------- Page ---------- */
export default function AdminDashboard(): JSX.Element {
  const [metrics] = React.useState<Metric[]>(initialMetrics);
  const [users, setUsers] = React.useState<UserRow[]>(initialUsers);
  const [logs] = React.useState<LogRow[]>(initialLogs);
  const [errors, setErrors] = React.useState<ErrorRow[]>(initialErrors);

  const { mode } = useThemeMode();
  const isDark = mode === "dark";

  const exportLogs = (): void => {
    const csv = logsToCSV(logs);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logs_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const toggleBan = (email: string): void => {
    setUsers((prev) =>
      prev.map((u) =>
        u.email === email ? { ...u, status: u.status === "Banned" ? "Active" : "Banned" } : u
      )
    );
  };

  const clearErrors = (): void => {
    setErrors([]);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-transparent">
      {/* Page title (dark-mode aware) */}
      <section className="relative w-full px-6">
        <h1
          className="text-3xl font-bold"
          style={{ color: isDark ? "#FFFFFF" : "#0f172a" }}
        >
          Admin Dashboard
        </h1>
        <p
          className="mt-1"
          style={{ color: isDark ? "#B6C2D4" : "#475569" }}
        >
          Monitor and manage your application
        </p>
      </section>

      {/* Metrics cards */}
      <section className="relative mt-8 grid w-full grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.title} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{m.title}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{m.value}</div>
                <div className="mt-1 text-xs text-slate-500">{m.sub}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">{m.icon}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Logs */}
      <section id="logs" className="relative mt-10 w-full px-6">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-0 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Application Logs</h2>
              <p className="text-xs text-slate-500">Recent system activity and events</p>
            </div>
            <button onClick={exportLogs} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[.98]">
              <Download className="h-4 w-4" /> Export Logs
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 font-semibold text-slate-600">Timestamp</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Level</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Message</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">User</th>
                </tr>
              </thead>
              <tbody>
                {initialLogs.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-4 text-slate-700">{r.time}</td>
                    <td className="px-6 py-4"><LevelBadge level={r.level} /></td>
                    <td className="px-6 py-4 text-slate-800">{r.message}</td>
                    <td className="px-6 py-4 text-slate-600">{r.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Error Monitor */}
      <section id="errors" className="relative mt-10 w-full px-6">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-0 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Error Monitor</h2>
              <p className="text-xs text-slate-500">Track and manage application errors</p>
            </div>
            <button onClick={clearErrors} className="inline-flex items-center gap-2 rounded-xl bg-rose-200 px-3 py-2 text-sm font-medium text-rose-800 transition hover:bg-rose-300 active:scale-[.98]">
              Clear Errors
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 font-semibold text-slate-600">Error</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Count</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">First Occurred</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Last Occurred</th>
                </tr>
              </thead>
              <tbody>
                {errors.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-slate-500" colSpan={4}>No errors 🎉</td>
                  </tr>
                ) : (
                  errors.map((e, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="px-6 py-4 text-slate-800">{e.error}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
                          {e.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{e.first}</td>
                      <td className="px-6 py-4 text-slate-700">{e.last}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* User Management */}
      <section id="users" className="relative mt-10 w-full px-6">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-0 shadow-sm backdrop-blur-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">User Management</h2>
            <p className="text-xs text-slate-500">Admins manage and monitor app</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 font-semibold text-slate-600">Name</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Email</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-4 text-slate-800">{u.name}</td>
                    <td className="px-6 py-4 text-slate-700">{u.email}</td>
                    <td className="px-6 py-4"><StatusBadge status={u.status} /></td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleBan(u.email)}
                        className="rounded-full bg-rose-200 px-3 py-1 text-xs font-medium text-rose-800 transition hover:bg-rose-300 active:scale-[.98]"
                      >
                        {u.status === "Banned" ? "Unban User" : "Ban User"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Service Destinations */}
      <section id="destinations" className="relative mt-10 w-full px-6 mb-20">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-0 shadow-sm backdrop-blur-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Service Destinations</h2>
            <p className="text-xs text-slate-500">Monitor external service health and performance</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 font-semibold text-slate-600">Service</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Response Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "API Gateway", status: "Healthy", time: "45ms" },
                  { name: "Database", status: "Warning", time: "120ms" },
                  { name: "Email Service", status: "Healthy", time: "32ms" },
                  { name: "File Storage", status: "Healthy", time: "78ms" },
                ].map((s, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-4 text-slate-800">{s.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.status === "Healthy" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Quick Runtime Checks ---------- */
if (typeof window !== "undefined") {
  const csvSample = logsToCSV(initialLogs);
  console.assert(csvSample.split(/\r?\n/).length - 1 === initialLogs.length, "CSV row count mismatch");
  const before = [...initialUsers];
  const flipped = before.map((u) =>
    u.email === "john@example.com" ? { ...u, status: u.status === "Banned" ? "Active" : "Banned" } : u
  );
  const beforeStatus = before.find((u) => u.email === "john@example.com")?.status ?? "";
  const afterStatus  = flipped.find((u) => u.email === "john@example.com")?.status ?? "";
  console.assert(beforeStatus !== afterStatus, "Toggle ban logic failed");
  console.assert(csvSample.split(/\r?\n/)[0] === "Timestamp,Level,Message,User", "CSV header mismatch");
  const tricky: LogRow[] = [{ time: "t", level: "Info", message: 'He said "Hi, friend"', user: "u" }];
  const trickyCsv = logsToCSV(tricky);
  console.assert(/He said ""Hi, friend""/.test(trickyCsv), "CSV quotes not escaped correctly");
  console.assert(trickyCsv.split(/\r?\n/).length === 2, "CSV lines count wrong for single row");
}
