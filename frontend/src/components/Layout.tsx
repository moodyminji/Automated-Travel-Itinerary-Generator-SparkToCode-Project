import { Link, NavLink, useLocation } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThemeMode } from '../hooks/useThemeMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg ${isActive ? 'bg-surface' : 'hover:bg-surface/70'}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[--color-border] bg-surface/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">Tajawal</Link>

          <nav className="hidden md:flex items-center gap-2">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/new-trip">Plan</NavItem>
            <NavItem to="/budget">Budget</NavItem>
            <NavItem to="/notifications">Notifications</NavItem>
            {user && <NavItem to="/profile">Profile</NavItem>}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className="px-3 py-2 rounded-lg hover:bg-surface/70"
              title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </button>

            {!user ? (
              <>
                <Link to="/auth" className="px-3 py-2 rounded-lg hover:bg-surface/70">Login</Link>
                <Link to="/auth#signup" className="btn-primary">Sign Up</Link>
              </>
            ) : (
              <>
                <span className="small text-muted">Hi, {user.name}</span>
                <button onClick={logout} className="px-3 py-2 rounded-lg hover:bg-surface/70">Logout</button>
              </>
            )}
          </div>
        </div>

        {/* Mobile quick nav (بدون Admin) */}
        <div className="md:hidden border-t border-[--color-border] px-2 py-2 flex gap-2 overflow-x-auto">
          <Link to="/" className={`px-3 py-2 rounded-lg ${pathname==='/'?'bg-surface':'hover:bg-surface/70'}`}>Home</Link>
          <Link to="/new-trip" className={`px-3 py-2 rounded-lg ${pathname.startsWith('/new-trip')?'bg-surface':'hover:bg-surface/70'}`}>Plan</Link>
          <Link to="/budget" className={`px-3 py-2 rounded-lg ${pathname.startsWith('/budget')?'bg-surface':'hover:bg-surface/70'}`}>Budget</Link>
          <Link to="/notifications" className={`px-3 py-2 rounded-lg ${pathname.startsWith('/notifications')?'bg-surface':'hover:bg-surface/70'}`}>Notifications</Link>
          {user && <Link to="/profile" className={`px-3 py-2 rounded-lg ${pathname.startsWith('/profile')?'bg-surface':'hover:bg-surface/70'}`}>Profile</Link>}
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </main>

      <footer className="border-t border-[--color-border] py-4 text-center text-sm text-muted">
        By Tajawal
      </footer>
    </div>
  );
}
