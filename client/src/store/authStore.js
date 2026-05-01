import { create } from 'zustand';
import { authService } from '../services/authService';

/**
 * Auth store — manages user authentication state.
 * Persists token and user to localStorage.
 */
const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  /** Register a new user */
  register: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.register(username, password);
      const { token, ...user } = result;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
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

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
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
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    } catch {
      // Silently fail if token is invalid
    }
  },

  /** Logout */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, error: null });
  },

  /** Clear error state */
  clearError: () => set({ error: null }),

  /** Check if user is authenticated */
  isAuthenticated: () => !!get().token,
}));

export default useAuthStore;

