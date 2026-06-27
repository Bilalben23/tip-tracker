import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { storage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => string | null;
  register: (username: string, password: string, salary: number, currency: string) => string | null;
  logout: () => void;
  updateUser: (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = storage.getCurrentUserId();
    if (userId) {
      const found = storage.getUsers().find(u => u.id === userId);
      if (found) setUser(found);
    }
  }, []);

  const login = useCallback((username: string, password: string): string | null => {
    const found = storage.getUsers().find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!found) return 'errInvalid';
    setUser(found);
    storage.setCurrentUserId(found.id);
    return null;
  }, []);

  const register = useCallback((
    username: string, password: string, salary: number, currency: string
  ): string | null => {
    if (username.trim().length < 2) return 'errUsernameShort';
    if (password.length < 4) return 'errPasswordShort';
    const users = storage.getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
      return 'errTaken';
    const newUser: User = {
      id: crypto.randomUUID(),
      username: username.trim(),
      password,
      salary,
      currency,
      createdAt: new Date().toISOString(),
    };
    storage.saveUsers([...users, newUser]);
    setUser(newUser);
    storage.setCurrentUserId(newUser.id);
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.setCurrentUserId(null);
  }, []);

  const updateUser = useCallback((updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    storage.saveUsers(storage.getUsers().map(u => u.id === user.id ? updated : u));
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
