'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;

  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        // Clear cookie
        document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        set({ user: null });
      },

      isAdmin: () => get().user?.role === 'admin',
      isAuthenticated: () => !!get().user,
    }),
    {
      name: 'veerji-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
