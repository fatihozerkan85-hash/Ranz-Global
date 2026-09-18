"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { User } from "./types";
import { addUser, DEMO_PASSWORD, findUser, isPublicSessionUser } from "./store";

const KEY = "ranz-session";
const EVENT = "ranz-auth";

type PublicUser = Omit<User, "password">;

type Ctx = {
  user: PublicUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null; user: PublicUser | null }>;
  register: (name: string, email: string, password: string, phone?: string) => string | null;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

function strip(user: User): PublicUser {
  const { password: _pw, ...rest } = user;
  return rest;
}

export function portalPath(user: { role?: string } | null | undefined) {
  if (user?.role === "admin") return "/yonetim/erp";
  if (user?.role === "staff") return "/danisman";
  return "/panel";
}

function emitAuth() {
  window.dispatchEvent(new Event(EVENT));
}

function writeSession(next: PublicUser | null) {
  if (next) localStorage.setItem(KEY, JSON.stringify(next));
  else localStorage.removeItem(KEY);
  emitAuth();
}

function getSessionRaw() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parseSession(raw: string | null): PublicUser | null {
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw) as PublicUser;
    if (!isPublicSessionUser(saved)) return null;
    const fresh = findUser(saved.email);
    if (fresh && isPublicSessionUser(fresh)) return strip(fresh);
    return saved;
  } catch {
    return null;
  }
}

function subscribeSession(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  window.addEventListener("pageshow", cb);
  window.addEventListener("popstate", cb);
  window.addEventListener("focus", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("pageshow", cb);
    window.removeEventListener("popstate", cb);
    window.removeEventListener("focus", cb);
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const raw = useSyncExternalStore(subscribeSession, getSessionRaw, () => null);
  const user = useMemo(() => (mounted ? parseSession(raw) : null), [mounted, raw]);

  const login = useCallback(async (email: string, password: string) => {
    const { pullOps } = await import("./ops-client");
    await pullOps();
    const found = findUser(email);
    if (!found || !isPublicSessionUser(found)) return { error: "Bu e-posta ile hesap yok.", user: null };
    const expected = found.password ?? DEMO_PASSWORD;
    if (password !== expected) return { error: "Şifre hatalı.", user: null };
    const publicUser = strip(found);
    writeSession(publicUser);
    return { error: null, user: publicUser };
  }, []);

  const register = useCallback((name: string, email: string, password: string, phone?: string) => {
    if (password.length < 6) return "Şifre en az 6 karakter olmalı.";
    const created = addUser(name.trim(), email, password, phone);
    if (!created) return "Bu e-posta ile hesap var.";
    writeSession(strip(created));
    return null;
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready: mounted, login, register, logout }),
    [user, mounted, login, register, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth");
  return ctx;
}
