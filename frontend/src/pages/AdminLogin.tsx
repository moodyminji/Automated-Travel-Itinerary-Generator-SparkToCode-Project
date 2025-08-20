// src/pages/AdminLogin.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useThemeMode } from "../hooks/useThemeMode";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { mode } = useThemeMode();

  const isDark = mode === "dark";
  const CARD_DARK = "#122033";
  const TEXT_DARK = "#DDE9F7";
  const SUBTEXT_DARK = "#B6C2D4";
  const ACCENT = "#F4A83F";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) {
      setMsg("Please fill all fields.");
      return;
    }
    setMsg(null);
    // Same behavior as before: mark user as logged-in, then go to /profile
    login({ name: email.split("@")[0] || "Traveler", email, isAdmin: false });
    navigate("/profile");
  };

  return (
    // Background + logo come from Layout; keep this clean
    <div className="relative min-h-screen overflow-hidden">
      <main className="relative z-10 flex items-start md:items-center justify-center px-4 pt-24 pb-16 md:pt-28">
        <section
          className="w-full max-w-xl rounded-2xl shadow-xl border px-8 md:px-12 py-10 relative"
          style={{
            backgroundColor: isDark ? CARD_DARK : "#ffffff",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb",
          }}
        >
          {/* Link to admin-secure login page (unchanged route) */}
          <Link
            to="/admin/login"
            className="absolute right-6 top-6 text-sm font-semibold"
            style={{ color: isDark ? SUBTEXT_DARK : "#475569" }}
          >
            Login as Admin
          </Link>

          <h1
            className="text-4xl font-extrabold text-center"
            style={{ color: isDark ? TEXT_DARK : "#122033" }}
          >
            Log In
          </h1>
          <p
            className="text-center text-lg mt-2"
            style={{ color: isDark ? SUBTEXT_DARK : "#64748b" }}
          >
            Log in to access your trips
          </p>

          {msg && (
            <div
              className="mt-6 rounded-xl border px-4 py-3 text-sm"
              style={{
                backgroundColor: isDark ? "rgba(250,204,21,0.08)" : "#fffbeb",
                borderColor: isDark ? "rgba(250,204,21,0.25)" : "#fde68a",
                color: isDark ? "#facc15" : "#92400e",
              }}
            >
              {msg}
            </div>
          )}

          <form onSubmit={submit} className="mt-8 space-y-5">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-[17px] outline-none focus:ring-2 transition border"
              style={{
                backgroundColor: "#ffffff",
                color: "#0f172a",
                borderColor: "#CBD5E1",
                boxShadow: "inset 0 0 0 1px transparent",
              }}
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-[17px] outline-none focus:ring-2 transition border"
              style={{
                backgroundColor: "#ffffff",
                color: "#0f172a",
                borderColor: "#CBD5E1",
              }}
            />

            <div className="text-right -mt-1">
              <Link
                to="/forgot"
                className="text-sm font-semibold"
                style={{ color: isDark ? SUBTEXT_DARK : "#475569" }}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="mx-auto block w-56 rounded-xl border-2 font-semibold py-3 transition"
              style={{
                borderColor: ACCENT,
                color: ACCENT,
                backgroundColor: isDark ? "transparent" : "transparent",
              }}
            >
              Log in
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb" }}
            />
            <p
              className="text-sm font-semibold"
              style={{ color: isDark ? SUBTEXT_DARK : "#64748b" }}
            >
              or
            </p>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb" }}
            />
          </div>

          {/* Social icons (unchanged) */}
          <div className="text-center">
            <p
              className="text-sm mb-3"
              style={{ color: isDark ? SUBTEXT_DARK : "#64748b" }}
            >
              Login using
            </p>
            <div className="flex justify-center gap-6">
              <GoogleIcon className="h-8 w-8" />
              <AppleIcon className="h-8 w-8" />
              <FacebookIcon className="h-8 w-8" />
            </div>
          </div>

          <p
            className="text-center text-sm mt-6"
            style={{ color: isDark ? SUBTEXT_DARK : "#64748b" }}
          >
            <Link
              to="/signup"
              className="font-semibold"
              style={{ color: isDark ? TEXT_DARK : "#122033" }}
            >
              Create a new account
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

/* Tiny SVG icons (same visuals) */
function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 31.7 29.3 35 24 35c-6.6 0-12-5.4-12-12S17.4 11 24 11c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.8 5.3 29.7 3 24 3 16 3 8.9 7.6 6.3 14.7z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.2 18.8 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.8 5.3 29.7 3 24 3 16 3 8.9 7.6 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.5-5.3l-6.2-5.1C29.2 36.1 26.8 37 24 37c-5.3 0-9.8-3.4-11.3-8.1l-6.4 4.9C8.8 41.9 15.8 45 24 45z" />
      <path fill="#1976D2" d="M45 24c0-1.3-.1-2.2-.4-3.5H24v8h11.3c-.6 3-2.2 5.3-4.7 6.9l6.2 5.1C41.7 37 45 31.2 45 24z" />
    </svg>
  );
}
function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#111827" d="M34.9 25.5c0-6.1 5-8.1 5.1-8.2-2.8-4.1-7.2-4.7-8.7-4.7-3.7-.4-7.2 2.2-9 2.2s-4.7-2.1-7.6-2c-3.9.1-7.5 2.3-9.5 5.8-4.1 7.1-1 17.5 2.9 23.3 1.9 2.7 4.1 5.8 7 5.7 2.8-.1 3.9-1.8 7.4-1.8s4.5 1.8 7.6 1.8c3.2 0 5.2-2.7 7.1-5.4 2.2-3.2 3.1-6.3 3.2-6.4-.1 0-6.1-2.3-6.1-9.3z" />
      <path fill="#111827" d="M29.3 9.6c1.6-2 2.7-4.8 2.4-7.6-2.3.1-5 .9-6.6 2.9-1.4 1.6-2.7 4.5-2.4 7.1 2.6.2 5.1-1.3 6.6-2.4z" />
    </svg>
  );
}
function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#1877F2" d="M24 3C12.4 3 3 12.4 3 24c0 10.4 7.7 19 17.7 20.7V29.6h-5.3V24h5.3v-4.3c0-5.2 3.1-8.1 7.8-8.1 2.3 0 4.7.4 4.7.4v5.2h-2.7c-2.6 0-3.4 1.6-3.4 3.3V24h5.8l-.9 5.6h-4.9v15.1C37.3 43 45 34.4 45 24 45 12.4 35.6 3 24 3z" />
      <path fill="#fff" d="M33.4 29.6l.9-5.6h-5.8v-3.5c0-1.6.8-3.3 3.4-3.3h2.7v-5.2s-2.4-.4-4.7-.4c-4.7 0-7.8 2.9-7.8 8.1V24h-5.3v5.6h5.3v15.1c1.1.2 2.3.3 3.5.3s2.4-.1 3.5-.3V29.6h4.9z" />
    </svg>
  );
}
