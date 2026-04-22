import api from './api';

/**
 * Auth service — handles registration, login, and user profile
 */
export const authService = {
  /** Register a new user */
  register: async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },

  /** Login with email/password */
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  /** Get current user profile */
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  /** Get Google OAuth URL */
  getGoogleAuthUrl: () => {
    return `${import.meta.env.VITE_API_URL}/auth/google`;
  },
};
