import { useState } from 'react';
import { TextField, Button, Tabs, Tab, Alert, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AuthPage() {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Sign Up
  const [msg, setMsg] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '');
    const password = String(form.get('password') || '');
    if (!email || !password) return setMsg('Please fill all fields.');
    login({ name: email.split('@')[0], email, isAdmin: false });
    setMsg('');
    nav('/profile');
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '');
    const email = String(f.get('email') || '');
    const password = String(f.get('password') || '');
    const confirm = String(f.get('confirm') || '');
    if (!name || !email || !password || password !== confirm) {
      return setMsg('Check your inputs.');
    }
    login({ name, email, isAdmin: false });
    setMsg('');
    nav('/profile');
  };

  return (
    <section className="max-w-xl mx-auto card p-6">
      {/* Tabs + زر Admin داخل صفحة الدخول */}
      <div className="flex items-center justify-between mb-2">
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        <Link to="/admin/login" className="px-3 py-2 rounded-lg hover:bg-surface/70">
          Admin
        </Link>
      </div>

      {msg && <Alert severity="warning" sx={{ mb: 2 }}>{msg}</Alert>}

      {tab === 0 ? (
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'grid', gap: 2 }}>
          <TextField name="email" label="Email" type="email" fullWidth />
          <TextField name="password" label="Password" type="password" fullWidth />
          <div className="flex items-center justify-between">
            <span className="link-muted" />
            <Button type="submit" variant="contained" color="primary">Login</Button>
          </div>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSignup} sx={{ display: 'grid', gap: 2 }}>
          <TextField name="name" label="Name" fullWidth />
          <TextField name="email" label="Email" type="email" fullWidth />
          <TextField name="password" label="Password" type="password" fullWidth />
          <TextField name="confirm" label="Confirm Password" type="password" fullWidth />
          <div className="flex items-center justify-end gap-2">
            <Button type="submit" variant="contained" color="primary">Sign Up</Button>
          </div>
        </Box>
      )}
    </section>
  );
}
