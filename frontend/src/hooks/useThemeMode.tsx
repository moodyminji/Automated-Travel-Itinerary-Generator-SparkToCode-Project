import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';

type Ctx = {
  mode: PaletteMode;
  toggleMode: () => void;
  setMode: (m: PaletteMode) => void;
};

const ThemeModeCtx = createContext<Ctx | null>(null);
const KEY = 'tajawal:theme';

function makeMuiTheme(mode: PaletteMode) {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: '#1D3557' },
      secondary: { main: '#F4A261' },
      background: {
        default: isDark ? '#111827' : '#F9FAFB',
        paper: isDark ? '#0F172A' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F9FAFB' : '#111827',
        secondary: isDark ? 'rgba(249,250,251,0.7)' : '#6B7280',
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
      h1: { fontSize: 32, fontWeight: 700, lineHeight: 1.2 },
      h2: { fontSize: 24, fontWeight: 500, lineHeight: 1.25 },
      body1: { fontSize: 16, fontWeight: 400 },
      caption: { fontSize: 14, fontWeight: 300 },
    },
  });
}

function getInitialMode(): PaletteMode {
  try {
    const saved = localStorage.getItem(KEY) as PaletteMode | null;
    if (saved === 'dark' || saved === 'light') return saved;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode());

  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute('data-theme', mode);
    el.style.colorScheme = mode;
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const ctx = useMemo<Ctx>(
    () => ({
      mode,
      toggleMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
      setMode,
    }),
    [mode]
  );

  const muiTheme = useMemo(() => makeMuiTheme(mode), [mode]);

  return (
    <ThemeModeCtx.Provider value={ctx}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeMode() {
  const v = useContext(ThemeModeCtx);
  if (!v) throw new Error('useThemeMode must be used inside <ThemeModeProvider>');
  return v;
}
