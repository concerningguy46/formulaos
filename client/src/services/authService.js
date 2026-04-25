import api from './api';

/**
 * Auth service — handles registration, login, and user profile
 */
export const authService = {
  /** Register a new user */
  register: async (username, password) => {
    const { data } = await api.post('/auth/register', { username, password });
    return data;
  },

  /** Login with username/password */
  login: async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    return data;
  },

  /** Get current user profile */
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

