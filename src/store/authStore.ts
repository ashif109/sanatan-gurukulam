import { create } from 'zustand';
import { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  authView: 'login' | 'signup';
  login: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  openAuthModal: (view?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  setAuthView: (view: 'login' | 'signup') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthModalOpen: false,
  authView: 'login',

  login: (userData) => {
    const defaultUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || 'Student Name',
      email: userData.email || 'student@example.com',
      role: userData.role || 'student',
      avatarUrl: userData.avatarUrl || '',
      wishlist: [],
      certificates: [],
      createdAt: new Date().toISOString()
    };
    
    // Merge provided data with defaults
    set({ user: { ...defaultUser, ...userData }, isAuthModalOpen: false });
  },

  logout: () => set({ user: null }),
  
  openAuthModal: (view = 'login') => set({ isAuthModalOpen: true, authView: view }),
  
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  
  setAuthView: (view) => set({ authView: view })
}));
