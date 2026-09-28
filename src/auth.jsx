// Auth context — mock authentication backed by localStorage & API bridge
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  initStore, getUsers, getCurrentUser, setCurrentUser, clearCurrentUser,
  updateUser, setUsers, generateDonorId,
} from './store';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initStore();
    const stored = getCurrentUser();
    if (stored) setUser(stored);
    setReady(true);
  }, []);

  const login = useCallback((emailOrUser, password) => {
    // 1. If an object is passed directly (e.g. from the API response after login)
    if (typeof emailOrUser === 'object' && emailOrUser !== null) {
      setCurrentUser(emailOrUser);
      setUser(emailOrUser);
      return { ok: true, user: emailOrUser };
    }

    // 2. Safe string conversion to prevent '.toLowerCase is not a function' crashes
    const inputEmail = String(emailOrUser || '').trim();
    const inputPwd = String(password || '');

    const found = getUsers().find((u) => {
      const storedEmail = String(u.email || '').trim();
      // Case-insensitive comparison without calling methods directly on undefined/objects
      return storedEmail.localeCompare(inputEmail, undefined, { sensitivity: 'accent' }) === 0 && u.password === inputPwd;
    });

    if (!found) return { ok: false, error: 'Invalid email or password.' };

    setCurrentUser(found);
    setUser(found);
    return { ok: true, user: found };
  }, []);

  const register = useCallback((data) => {
    const inputEmail = String(data?.email || '').trim();
    const users = getUsers();

    const exists = users.some((u) => {
      const storedEmail = String(u.email || '').trim();
      return storedEmail.localeCompare(inputEmail, undefined, { sensitivity: 'accent' }) === 0;
    });

    if (exists) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: generateDonorId(),
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      bloodGroup: data.bloodGroup,
      gender: data.gender,
      phone: data.phone,
      location: data.location,
      lastDonation: null,
      available: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setUser(newUser);
    return { ok: true, user: newUser };
  }, []);

  const updateProfile = useCallback((updated) => {
    const saved = updateUser(updated);
    setUser(saved);
    return saved;
  }, []);

  const logout = useCallback(() => {
    clearCurrentUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}