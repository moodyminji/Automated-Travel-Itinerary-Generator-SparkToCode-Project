// src/pages/AdminSecureLogin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeMode } from '../hooks/useThemeMode';

export default function AdminSecureLogin() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const nav = useNavigate();
  const { login } = useAuth();

  // Dark-mode palette (matches app)
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const CARD_DARK = '#122033';
  const TEXT_DARK = '#FFFFFF';
  const SUBTEXT_DARK = '#B6C2D4';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) {
      setMsg('Please fill all fields.');
      return;
    }
    setMsg(null);

    // Mark as admin and go to admin dashboard
    login({ name: email.split('@')[0] || 'Admin', email, isAdmin: true });
    nav('/admin/dashboard');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <main className="relative z-10 flex items-start md:items-center justify-center px-4 pt-24 pb-16 md:pt-28">
        <section
          className="w-full max-w-xl shadow-xl border px-8 md:px-12 py-10"
          style={{
            backgroundColor: isDark ? CARD_DARK : '#ffffff',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
            boxShadow: isDark
              ? '0 20px 40px rgba(0,0,0,.45)'
              : '0 20px 40px rgba(0,0,0,.15)',
          }}
        >
          <h1
            className="text-4xl font-extrabold text-center"
            style={{ color: isDark ? TEXT_DARK : '#122033' }}
          >
            Admin Login
          </h1>
          <p
            className="text-center text-lg mt-2"
            style={{ color: isDark ? SUBTEXT_DARK : '#475569' }}
          >
            Enter your admin credentials
          </p>

          {msg && (
            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-amber-800 text-sm">
              {msg}
            </div>
          )}

          <form onSubmit={submit} className="mt-8 space-y-5">
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[17px] text-[#122033] placeholder-[#64748B] outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
            />

            <input
              type="password"
              placeholder="Password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[17px] text-[#122033] placeholder-[#64748B] outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
            />

            <button
              type="submit"
              className="mx-auto block w-40 border-2 font-bold py-3 hover:bg-orange-50 transition" style={{
                borderColor: "#F5A623",       // stroke
                color: "#F5A623",             // text
                backgroundColor: "#ffffff",   // fill white (both modes)
              }}
            >
              Log in
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
