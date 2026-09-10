"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "./types";
import { addUser, DEMO_PASSWORD, findUser } from "./store";

const KEY = "ranz-session";

type PublicUser = Omit<User, "password">;

type Ctx = {
  user: PublicUser | null;
  ready: boolean;
  login: (email: string, password: string) => { error: string | null; user: PublicUser | null };
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

function strip(user: User): PublicUser {
  const { password: _pw, ...rest } = user;
  return rest;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw) as PublicUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = (next: PublicUser | null) => {
    setUser(next);
    if (next) localStorage.setItem(KEY, JSON.stringify(next));
    else localStorage.removeItem(KEY);
  };

  const login = (email: string, password: string) => {
    const found = findUser(email);
    if (!found) return { error: "Bu e-posta ile hesap yok.", user: null };
    const expected = found.password ?? DEMO_PASSWORD;
    if (password !== expected) return { error: "Şifre hatalı.", user: null };
    const publicUser = strip(found);
    persist(publicUser);
    return { error: null, user: publicUser };
  };

  const register = (name: string, email: string, password: string) => {
    if (password.length < 6) return "Şifre en az 6 karakter olmalı.";
    const created = addUser(name.trim(), email, password);
    persist(strip(created));
    return null;
  };

  const logout = () => persist(null);

  const value = useMemo(() => ({ user, ready, login, register, logout }), [user, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth");
  return ctx;
}
