import { create } from 'zustand';
import api from '../services/api';
import { storage } from '../utils/storage';
import type { User, LoginPayload, RegisterPayload } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;  // true only during restoreSession (app startup)
  isLoading: boolean;       // true during login / register operations
  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user, tokens } = data.data;
      await storage.setAccessToken(tokens.accessToken);
      await storage.setRefreshToken(tokens.refreshToken);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Login failed. Check your credentials.';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', payload);
      const { user, tokens } = data.data;
      await storage.setAccessToken(tokens.accessToken);
      await storage.setRefreshToken(tokens.refreshToken);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Registration failed.';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      const refreshToken = await storage.getRefreshToken();
      if (refreshToken) await api.post('/auth/logout', { refreshToken }).catch(() => {});
    } finally {
      await storage.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  restoreSession: async () => {
    set({ isInitializing: true });
    try {
      const token = await storage.getAccessToken();
      if (!token) {
        set({ isAuthenticated: false, isInitializing: false });
        return;
      }
      const { data } = await api.get('/auth/profile');
      set({ user: data.data.user, isAuthenticated: true, isInitializing: false });
    } catch {
      await storage.clearTokens();
      set({ user: null, isAuthenticated: false, isInitializing: false });
    }
  },

  clearError: () => set({ error: null }),
}));
