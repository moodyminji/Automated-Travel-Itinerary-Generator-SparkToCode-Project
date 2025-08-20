import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import type { PropsWithChildren, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThemeMode } from '../hooks/useThemeMode';
import {
  DarkMode,
  LightMode,
  Home,
  FlightTakeoff,
  Notifications,
  AccountBalanceWallet,
  AccountCircle,
  LogoutOutlined,
} from '@mui/icons-material';

import Logo from '../assets/logo.png';
import WavesLight from '../assets/waves.png.png';
import WavesDark from '../assets/dark-.png';

function NavItem({
  to,
  icon,
  children,
}: {
  to?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const { mode } = useThemeMode();

  const isActive = to ? pathname === to : false;

  const textColor =
    mode === 'light'
      ? isActive
        ? '#F5A623'
        : '#1D3557'
      : isActive
      ? '#DDE9F7'
      : '#F5A623';

  return to ? (
    <NavLink
      to={to}
      className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-surface/70"
      style={{ color: textColor }}
    >
      {icon} {children}
    </NavLink>
  ) : (
    <button
      className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-surface/70"
      style={{ color: textColor }}
      type="button"
    >
      {icon} {children}
    </button>
  );
}

export default function Layout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();

  // Routes that should show the "slim" header (logo + theme only)
  const isLoginLike =
    pathname === '/login' ||
    pathname === '/auth' ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/login') ||
    pathname === '/signup'; // <-- added

  // Hide header ONLY on landing page
  const hideChrome = pathname === '/';

  const logoutColor = mode === 'light' ? '#1D3557' : '#F5A623';
  const themeColor = mode === 'light' ? '#1D3557' : '#F5A623';

  const handleLogout = async () => {
    try {
      await Promise.resolve(logout());
    } finally {
      navigate('/', { replace: true });
    }
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col ${
        mode === 'light' ? 'bg-[#FAF3E7]' : 'bg-gray-900'
      }`}
    >
      {/* Header (hidden on /; slim on login-like) */}
      {!hideChrome && (
        <header className="sticky top-0 z-50">
          <div className="w-full px-4 py-3 flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Tajawal Logo"
                  style={{ width: 90, height: 90, objectFit: 'contain' }}
                />
              </Link>
            </div>

            <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
              {/* Full nav normally; only theme toggle on login-like */}
              {!isLoginLike ? (
                <>
                  <nav className="hidden md:flex items-center gap-2">
                    <NavItem to="/itinerary/1" icon={<Home />}>My Trips</NavItem>
                    <NavItem to="/new-trip" icon={<FlightTakeoff />}>Plan Trip</NavItem>
                    <NavItem to="/notifications" icon={<Notifications />}>Notifications</NavItem>
                    <NavItem to="/budget/1" icon={<AccountBalanceWallet />}>Budget</NavItem>
                    {user && <NavItem to="/profile" icon={<AccountCircle />}>Profile</NavItem>}
                    {user && (
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-surface/70"
                        style={{ color: logoutColor }}
                        type="button"
                      >
                        <LogoutOutlined /> Logout
                      </button>
                    )}
                  </nav>

                  {/* Mobile quick nav */}
                  <div className="md:hidden flex gap-2 overflow-x-auto px-2 py-2">
                    <NavItem to="/itinerary/1" icon={<Home />}>My Trips</NavItem>
                    <NavItem to="/new-trip" icon={<FlightTakeoff />}>Plan Trip</NavItem>
                    <NavItem to="/notifications" icon={<Notifications />}>Notifications</NavItem>
                    <NavItem to="/budget" icon={<AccountBalanceWallet />}>Budget</NavItem>
                    {user && <NavItem to="/profile" icon={<AccountCircle />}>Profile</NavItem>}
                    {user && (
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-surface/70"
                        style={{ color: logoutColor }}
                        type="button"
                      >
                        <LogoutOutlined /> Logout
                      </button>
                    )}
                  </div>
                </>
              ) : null}

              {/* Theme toggle (always shown) */}
              <button
                onClick={toggleMode}
                className="px-3 py-2 rounded-lg hover:bg-surface/70"
                title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
                aria-label="Toggle theme"
                style={{ color: themeColor }}
                type="button"
              >
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Content */}
      <main className="flex-1 relative z-10">
        <div className={hideChrome ? '' : 'w-full px-4 py-8'}>{children}</div>
      </main>

      {/* Bottom waves (visible on all except landing) */}
      {!hideChrome && (
        <div
          className="absolute bottom-0 left-0 w-full bg-no-repeat bg-bottom z-0"
          style={{
            backgroundImage: `url(${mode === 'light' ? WavesLight : WavesDark})`,
            height: '275px',
            backgroundSize: 'cover',
          }}
        />
      )}
    </div>
  );
}


