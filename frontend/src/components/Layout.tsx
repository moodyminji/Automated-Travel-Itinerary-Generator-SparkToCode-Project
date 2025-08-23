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
  VerifiedUser, // <-- added
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
    pathname.startsWith('/admin/login') ||
    pathname === '/signup'; // <-- unchanged except removing '/admin'

  // Admin dashboard/header should be slim: logo + logout + theme toggle
  const isAdminSlim = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  // Hide header on landing page AND on 404 page
  const hideChrome = pathname === '/' || pathname === '/404';

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
      className={`relative min-h-screen flex flex-col ${mode === 'light' ? 'bg-[#FAF3E7]' : 'bg-gray-900'
        }`}
    >
      {/* Header (hidden on /; slim on login-like) */}
      {!hideChrome && (
        <header
          className="relative z-[60] w-full"   // <- not fixed anymore
          style={{
            backgroundColor:
              mode === 'light'
                ? 'rgba(250,243,231,0.92)'
                : 'rgba(17,24,39,0.92)',
            backdropFilter: 'saturate(180%) blur(8px)',
          }}
        >
          <div className="w-full px-4 py-3 flex items-center justify-between">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Tajawal Logo"
                  style={{ width: 90, height: 90, objectFit: 'contain' }}
                />
              </Link>

              {/* For admins only pill beside logo on admin routes */}
              {isAdminSlim && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : '#0F2742',
                    color: '#FFFFFF',
                  }}
                >
                  <VerifiedUser style={{ fontSize: 14 }} />
                  For admins only
                </span>
              )}
            </div>

            <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
              {/* Full nav normally; hidden on login-like and admin-slim */}
              {!isLoginLike && !isAdminSlim ? (
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

              {/* Admin slim: only Logout (plus theme toggle below) */}
              {isAdminSlim && user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-surface/70"
                  style={{ color: logoutColor }}
                  type="button"
                >
                  <LogoutOutlined /> Logout
                </button>
              )}

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
        <div className={hideChrome ? '' : 'w-full px-4 py-8'}>{children}</div> {/* <- removed pt-[100px] */}
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
