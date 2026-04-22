import { create } from 'zustand';
import { authService } from '../services/authService';

/**
 * Auth store — manages user authentication state.
 * Persists token and user to localStorage.
 */
const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('formulaos_user')) || null,
  token: localStorage.getItem('formulaos_token') || null,
  loading: false,
  error: null,

  /** Register a new user */
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.register(name, email, password);
      const { token, ...user } = result.data;

      localStorage.setItem('formulaos_token', token);
      localStorage.setItem('formulaos_user', JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  /** Login with email/password */
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.login(email, password);
      const { token, ...user } = result.data;

      localStorage.setItem('formulaos_token', token);
      localStorage.setItem('formulaos_user', JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  /** Set token from Google OAuth callback */
  setTokenFromOAuth: async (token) => {
    localStorage.setItem('formulaos_token', token);
    set({ token, loading: true });

    try {
      const result = await authService.getMe();
      const user = result.data;
      localStorage.setItem('formulaos_user', JSON.stringify(user));
      set({ user, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to get user profile' });
    }
  },

  /** Refresh user data from server */
  refreshUser: async () => {
    try {
      const result = await authService.getMe();
      const user = result.data;
      localStorage.setItem('formulaos_user', JSON.stringify(user));
      set({ user });
    } catch {
      // Silently fail if token is invalid
    }
  },

  /** Logout */
  logout: () => {
    localStorage.removeItem('formulaos_token');
    localStorage.removeItem('formulaos_user');
    set({ user: null, token: null, error: null });
  },

  /** Clear error state */
  clearError: () => set({ error: null }),

  /** Check if user is authenticated */
  isAuthenticated: () => !!get().token,
}));

export default useAuthStore;
