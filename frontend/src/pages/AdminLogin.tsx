import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE || 'admin123';

export default function AdminLogin() {
  const [msg, setMsg] = useState('');
  const nav = useNavigate();
  const { login, makeAdmin, user } = useAuth();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '');
    const code = String(f.get('code') || '');
    if (!email || !code) return setMsg('Please fill all fields.');
    if (code !== ADMIN_CODE) return setMsg('Invalid admin code.');

    if (!user) login({ name: email.split('@')[0], email, isAdmin: true });
    else makeAdmin(true);

    nav('/admin');
  };

  return (
    <section className="max-w-md mx-auto card p-6">
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Admin Login
      </Typography>

      {msg && <Alert severity="warning" sx={{ mb: 2 }}>{msg}</Alert>}

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField name="email" label="Admin Email" type="email" fullWidth />
        <TextField name="code" label="Admin Code" type="password" fullWidth />
        <div className="flex items-center justify-end gap-2">
          <Button type="submit" variant="contained">Enter Dashboard</Button>
        </div>
      </Box>
    </section>
  );
}
