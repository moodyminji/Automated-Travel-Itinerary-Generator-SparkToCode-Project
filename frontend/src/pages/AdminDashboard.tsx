/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useState } from 'react';
import { Button, Chip } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type Log = { time: string; level: 'info' | 'warn' | 'error'; user?: string; message: string };
type AppError = { id: number; time: string; message: string };
type Dest = { name: string; count: number };
type UserRow = { id: number; name: string; email: string; banned?: boolean };

// custom hook لتوليد بيانات تجريبية
function useDemoData() {
  const [users, setUsers] = useState<UserRow[]>([
    { id: 1, name: 'Yaqeen', email: 'yaqeen@example.com' },
    { id: 2, name: 'Jokha', email: 'jokha@example.com' },
    { id: 3, name: 'Tasneem', email: 'tasneem@example.com' },
  ]);
  const [logs] = useState<Log[]>([
    { time: '2025-08-17 09:10', level: 'info', user: 'Yaqeen', message: 'Created a trip to Dubai' },
    { time: '2025-08-17 10:21', level: 'warn', user: 'Anonymous', message: 'Rate limit near threshold' },
    { time: '2025-08-17 11:05', level: 'error', user: 'Service', message: 'Itinerary API timeout' },
  ]);
  const [errors, setErrors] = useState<AppError[]>([
    { id: 101, time: '2025-08-17 11:05', message: 'Itinerary API timeout' },
    { id: 102, time: '2025-08-17 11:16', message: 'Budget calc NaN for trip #42' },
  ]);
  const [destinations] = useState<Dest[]>([
    { name: 'Dubai', count: 12 },
    { name: 'Muscat', count: 8 },
    { name: 'Istanbul', count: 6 },
    { name: 'Riyadh', count: 5 },
  ]);

  return { users, setUsers, logs, errors, setErrors, destinations };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  if (!user?.isAdmin) return <Navigate to="/admin/login" replace />;

  const { users, setUsers, logs, errors, setErrors, destinations } = useDemoData();

  const stats = useMemo(
    () => ({
      users: users.length,
      trips: 42,
      errors: errors.length,
      destinations: destinations.length,
    }),
    [users.length, errors.length, destinations.length]
  );

  const exportLogs = () => {
    const csv =
      'time,level,user,message\n' +
      logs
        .map(l => [l.time, l.level, l.user || '', `"${l.message.replace(/"/g, '""')}"`].join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tajawal-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const banUser = (id: number) =>
    setUsers(arr => arr.map(u => (u.id === id ? { ...u, banned: true } : u)));

  const clearErrors = () => setErrors([]);

  return (
    <section className="space-y-6">
      <h1 className="h2">Admin Dashboard</h1>
      <p className="small text-muted -mt-2">Purpose: For admins only. Admins manage and monitor the app.</p>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-4"><div className="small text-muted">Users</div><div className="text-2xl font-semibold">{stats.users}</div></div>
        <div className="card p-4"><div className="small text-muted">Trips</div><div className="text-2xl font-semibold">{stats.trips}</div></div>
        <div className="card p-4"><div className="small text-muted">Errors</div><div className="text-2xl font-semibold">{stats.errors}</div></div>
        <div className="card p-4"><div className="small text-muted">Destinations</div><div className="text-2xl font-semibold">{stats.destinations}</div></div>
      </div>

      {/* Logs */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Logs</h3>
          <Button variant="contained" onClick={exportLogs}>Export Logs</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted">
              <tr><th className="text-left py-2">Time</th><th className="text-left py-2">Level</th><th className="text-left py-2">User</th><th className="text-left py-2">Message</th></tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i} className="border-t border-[--color-border]">
                  <td className="py-2">{l.time}</td>
                  <td className="py-2">
                    <Chip size="small" label={l.level.toUpperCase()} color={l.level === 'error' ? 'error' : l.level === 'warn' ? 'warning' : 'default'} />
                  </td>
                  <td className="py-2">{l.user || '-'}</td>
                  <td className="py-2">{l.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Errors */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Errors</h3>
          <Button variant="outlined" onClick={clearErrors}>Clear Errors</Button>
        </div>
        {errors.length === 0 ? (
          <p className="small text-muted">No errors 🎉</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {errors.map(e => (
              <li key={e.id} className="border border-[--color-border] rounded-xl p-3">
                <div className="small text-muted">{e.time}</div>
                <div>{e.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Destinations */}
      <div className="card p-5">
        <h3 className="font-semibold mb-3">Top Destinations</h3>
        <div className="flex gap-2 flex-wrap">
          {destinations.map(d => (<Chip key={d.name} label={`${d.name} • ${d.count}`} />))}
        </div>
      </div>

      {/* Users */}
      <div className="card p-5">
        <h3 className="font-semibold mb-3">Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted">
              <tr><th className="text-left py-2">Name</th><th className="text-left py-2">Email</th><th className="text-left py-2">Status</th><th className="text-left py-2">Action</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-[--color-border]">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.banned ? <Chip size="small" label="Banned" color="error" /> : <Chip size="small" label="Active" color="success" />}</td>
                  <td className="py-2">
                    <Button size="small" variant="outlined" disabled={!!u.banned} onClick={() => banUser(u.id)}>Ban User</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
