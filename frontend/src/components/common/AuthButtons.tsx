import { Link, useNavigate } from "react-router-dom";
import { Button } from "../UI";
import { useAuth } from "../../hooks/useAuth";

export default function AuthButtons() {
  const { user, logout } = useAuth() as {
    user: { name?: string } | null;
    logout?: () => void;
  };
  const nav = useNavigate();

  // Guest view: Login + Sign Up
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button to="/login" variant="subtle">Login</Button>
        <Button to="/signup" variant="primary">Sign Up</Button>
      </div>
    );
  }

  // Authed view: Profile + Switch account + Logout
  const initial = (user.name || "?").trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    if (typeof logout === "function") logout();
    nav("/login");
  };

  return (
    <div className="flex items-center gap-3">
      <Link to="/profile" className="flex items-center gap-2">
        <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-sm font-semibold">
          {initial}
        </span>
        <span className="hidden sm:block">Hi, {user.name || "User"}</span>
      </Link>

      {/* NEW: Let logged-in users reach the login form */}
      <Button to="/login?switch=1" variant="subtle">Switch account</Button>
      {/* (Optional) also expose sign-up switching */}
      {/* <Button to="/signup?switch=1" variant="subtle">Sign up another</Button> */}

      <Button onClick={handleLogout} variant="subtle">Logout</Button>
    </div>
  );
}
