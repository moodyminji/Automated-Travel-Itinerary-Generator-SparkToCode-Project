// src/routes/guards.tsx
import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/** Protects private pages. If no user, redirect to /login and remember where they came from. */
export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

/** Blocks auth pages for logged-in users (e.g., /login, /signup, /forgot-password). */
export function GuestOnly() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const switching = params.get("switch") === "1";

  if (user && !switching) {
    return <Navigate to="/profile" replace />;
  }
  return <Outlet />;
}