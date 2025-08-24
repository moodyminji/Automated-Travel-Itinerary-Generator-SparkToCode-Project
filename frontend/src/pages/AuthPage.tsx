
import { useState } from "react";
import { TextField, Button, Tabs, Tab, Alert, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export default function AuthPage() {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Sign Up
  const [msg, setMsg] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  const base = import.meta.env.VITE_API_URL ?? ""; // use Vite proxy if you prefer

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    if (!email || !password) return setMsg("Please fill all fields.");

    setMsg("");
    setBusy(true);
    try {
      const { data } = await axios.post(`${base}/api/auth/login`, {
        usernameOrEmail: email,
        password,
      });
      // expected shape (adjust if yours differs):
      // { token: "...", username: "ali", isAdmin: false }
      if (data?.token) localStorage.setItem("token", data.token);

      login({
        name: data?.username ?? email.split("@")[0] ?? "Traveler",
        email,
        isAdmin:
          Boolean(data?.isAdmin) ||
          (Array.isArray(data?.roles) && data.roles.includes("ADMIN")),
      });

      nav("/profile");
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Login failed. Check your email and password.";
      setMsg(String(apiMsg));
    } finally {
      setBusy(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "");
    const email = String(f.get("email") || "");
    const password = String(f.get("password") || "");
    const confirm = String(f.get("confirm") || "");
    if (!name || !email || !password) return setMsg("Please fill all fields.");
    if (password !== confirm) return setMsg("Passwords do not match.");

    setMsg("");
    setBusy(true);
    try {
      // register
      await axios.post(`${base}/api/auth/register`, {
        username: name,
        email,
        password,
      });

      // optional: auto-login after signup
      const { data } = await axios.post(`${base}/api/auth/login`, {
        usernameOrEmail: email,
        password,
      });
      if (data?.token) localStorage.setItem("token", data.token);

      login({
        name: data?.username ?? name,
        email,
        isAdmin:
          Boolean(data?.isAdmin) ||
          (Array.isArray(data?.roles) && data.roles.includes("ADMIN")),
      });

      nav("/profile");
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Sign up failed. Please check your inputs.";
      setMsg(String(apiMsg));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto card p-6">
      <div className="flex items-center justify-between mb-2">
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        <Link to="/admin/login" className="px-3 py-2 rounded-lg hover:bg-surface/70">
          Admin
        </Link>
      </div>

      {msg && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}

      {tab === 0 ? (
        <Box component="form" onSubmit={handleLogin} sx={{ display: "grid", gap: 2 }}>
          <TextField name="email" label="Email" type="email" fullWidth />
          <TextField name="password" label="Password" type="password" fullWidth />
          <div className="flex items-center justify-between">
            <span className="link-muted" />
            <Button type="submit" variant="contained" color="primary" disabled={busy}>
              {busy ? "Logging in..." : "Login"}
            </Button>
          </div>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSignup} sx={{ display: "grid", gap: 2 }}>
          <TextField name="name" label="Name" fullWidth />
          <TextField name="email" label="Email" type="email" fullWidth />
          <TextField name="password" label="Password" type="password" fullWidth />
          <TextField name="confirm" label="Confirm Password" type="password" fullWidth />
          <div className="flex items-center justify-end gap-2">
            <Button type="submit" variant="contained" color="primary" disabled={busy}>
              {busy ? "Creating..." : "Sign Up"}
            </Button>
          </div>
        </Box>
      )}
    </section>
  );
}
