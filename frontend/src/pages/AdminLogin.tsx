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
  const CARD_DARK = "#142A45";
  const TEXT_DARK = "#ffffffff";
  const SUBTEXT_DARK = "#B6C2D4";

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
          className="w-full max-w-xl shadow-xl border px-8 md:px-12 py-10 relative"
          style={{
            // Match Sign Up card colors exactly
            backgroundColor: isDark ? CARD_DARK : "#FFFFFF",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}`,
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
            style={{ color: isDark ? TEXT_DARK : "#1C2B39" }}
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

          <form onSubmit={submit} className="mt-8 space-y-5 flex flex-col items-center">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-100 h-15 rounded-xl px-3 py-2 text-[15px] outline-none focus:ring-2 transition border"
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
              className="w-100 h-15 rounded-xl px-3 py-2 text-[15px] outline-none focus:ring-2 transition border"
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
              className="mx-auto block w-40 border-2 font-bold py-3 transition"
              style={{
                borderColor: "#F5A623",       // stroke
                color: "#F5A623",             // text
                backgroundColor: "#ffffff",   // fill white (both modes)
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

          {/* Social login (Google only, same hover style as Sign Up) */}
          <div className="text-center">
            <p
              className="text-sm mb-3"
              style={{ color: isDark ? SUBTEXT_DARK : "#64748b" }}
            >
              Login using
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                className="p-2 rounded transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? "#1f3555" : "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? "#142A45" : "#ffffff";
                }}
                style={{
                  backgroundColor: isDark ? "#142A45" : "#ffffff",
                }}
              >
                <GoogleIcon className="w-9 h-9" />
              </button>
            </div>
          </div>

          <p
            className="text-center text-sm mt-6"
            style={{ color: isDark ? SUBTEXT_DARK : "#64748b" }}
          >
            <Link
              to="/signup"
              className="font-semibold"
              style={{ color: isDark ? TEXT_DARK : "#475569" }}
            >
              Create a new account
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

/* Tiny SVG icon */
function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 533.5 544.3" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M533.5 278.4c0-18.4-1.5-36.8-4.7-54.8H272v103.9h147.5c-6.3 34.5-25.5 63.8-54.4 83.3v68h87.7c51.4-47.4 80.7-117.4 80.7-200.4z"
      />
      <path
        fill="#34A853"
        d="M272 544.3c73.6 0 135.4-24.4 180.5-66.1l-87.7-68c-24.4 16.4-55.7 26.2-92.8 26.2-71.2 0-131.5-48.1-153-112.9H28.1v70.8c45.3 89.7 137.3 150 243.9 150z"
      />
      <path
        fill="#FBBC05"
        d="M119 323.5c-10.9-32.5-10.9-67.5 0-100l-90.9-70.8c-39.9 79.7-39.9 172 0 251.7l90.9-70.9z"
      />
      <path
        fill="#EA4335"
        d="M272 107.7c39.9 0 75.9 13.7 104.2 40.5l78-78C407.4 24.4 345.6 0 272 0 165.4 0 73.4 60.3 28.1 150.9l90.9 70.8c21.5-64.8 81.8-113.9 153-113.9z"
      />
    </svg>
  );
}
