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
  register: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.register(username, password);
      const { token, ...user } = result;

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

  /** Login with username/password */
  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.login(username, password);
      const { token, ...user } = result;

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

  /** Refresh user data from server */
  refreshUser: async () => {
    try {
      const user = await authService.getMe();
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

