import React, { createContext, useContext, useEffect, useState } from 'react';

export type User = { name: string; email: string; isAdmin?: boolean };

type AuthCtx = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  makeAdmin: (on: boolean) => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = 'tajawal:auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      /* ignore corrupted localStorage */
    }
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
  };

  const makeAdmin = (on: boolean) => {
    if (!user) return;
    const u = { ...user, isAdmin: on };
    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
  };

  return <Ctx.Provider value={{ user, login, logout, makeAdmin }}>{children}</Ctx.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
}
