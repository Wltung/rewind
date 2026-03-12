// src/store/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  setAuth: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setAuth: (status) => set({ isAuthenticated: status }),
}));