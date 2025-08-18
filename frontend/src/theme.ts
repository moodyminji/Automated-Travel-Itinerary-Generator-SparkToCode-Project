import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#1D3557' },   // Primary
    secondary: { main: '#F4A261' },   // Secondary
    background: {
      default: '#111827',             // Background (Dark)
      paper:   '#0F172A',             // Surface
    },
    text: {
      primary: '#F9FAFB',
      secondary: 'rgba(249,250,251,0.7)',
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
