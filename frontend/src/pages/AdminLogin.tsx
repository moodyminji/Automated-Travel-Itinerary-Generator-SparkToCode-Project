import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useThemeMode } from "../hooks/useThemeMode";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { mode } = useThemeMode();

  const isDark = mode === "dark";
  const CARD_DARK = "#142A45";
  const TEXT_DARK = "#ffffffff";
  const SUBTEXT_DARK = "#B6C2D4";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !pwd) {
      setMsg("Please fill all fields.");
      return;
    }

    setMsg(null);
    setBusy(true);
    try {
      // call your backend (adjust baseURL if you use a Vite proxy)
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL ?? ""}/api/auth/login`,
        { usernameOrEmail: email, password: pwd }
      );
      // Expecting: { token: "...", username: "ali", isAdmin: true/false }
      if (data?.token) localStorage.setItem("token", data.token);

      // hydrate app auth state
      login({
        name: data?.username ?? email.split("@")[0] ?? "Traveler",
        email,
        isAdmin: !!data?.isAdmin,
      });

      navigate("/profile");
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Login failed. Check your email and password.";
      setMsg(String(apiMsg));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <main className="relative z-10 flex items-start md:items-center justify-center px-4 pt-24 pb-16 md:pt-28">
        <section
          className="w-full max-w-xl shadow-xl border px-8 md:px-12 py-10 relative"
          style={{
            backgroundColor: isDark ? CARD_DARK : "#FFFFFF",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}`,
          }}
        >
          {/* This link is redundant if you're already on admin login; keep or remove */}
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

            <div className="text-right -mt-1 w-full max-w-sm">
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
              disabled={busy}
              className="mx-auto block w-40 border-2 font-bold py-3 transition disabled:opacity-60"
              style={{
                borderColor: "#F5A623",
                color: "#F5A623",
                backgroundColor: "#ffffff",
              }}
            >
              {busy ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Removed social/Google login section */}
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
