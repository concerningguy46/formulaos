import api from './api';

/**
 * Formula service — CRUD operations for personal formula library
 */
export const formulaService = {
  /** Get all formulas for current user */
  getMyFormulas: async (params = {}) => {
    const { data } = await api.get('/formulas', { params });
    return data;
  },

  /** Get a single formula by ID */
  getFormula: async (id) => {
    const { data } = await api.get(`/formulas/${id}`);
    return data;
  },

  /** Create/save a new formula */
  createFormula: async (formulaData) => {
    const { data } = await api.post('/formulas', formulaData);
    return data;
  },

  /** Update an existing formula */
  updateFormula: async (id, updates) => {
    const { data } = await api.put(`/formulas/${id}`, updates);
    return data;
  },

  /** Delete a formula */
  deleteFormula: async (id) => {
    const { data } = await api.delete(`/formulas/${id}`);
    return data;
  },

  /** Track formula usage (inserted into cell) */
  trackUsage: async (id) => {
    const { data } = await api.post(`/formulas/${id}/use`);
    return data;
  },
};
