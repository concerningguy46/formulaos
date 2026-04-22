import { create } from 'zustand';
import { formulaService } from '../services/formulaService';

/**
 * Formula store — manages personal formula library state.
 */
const useFormulaStore = create((set, get) => ({
  formulas: [],
  loading: false,
  error: null,

  /** Fetch all user's formulas */
  fetchFormulas: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const result = await formulaService.getMyFormulas(params);
      set({ formulas: result.data, loading: false });
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Failed to fetch formulas' });
    }
  },

  /** Save a new formula */
  saveFormula: async (formulaData) => {
    try {
      const result = await formulaService.createFormula(formulaData);
      set((state) => ({ formulas: [result.data, ...state.formulas] }));
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to save formula' };
    }
  },

  /** Update a formula */
  updateFormula: async (id, updates) => {
    try {
      const result = await formulaService.updateFormula(id, updates);
      set((state) => ({
        formulas: state.formulas.map((f) => (f._id === id ? result.data : f)),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update' };
    }
  },

  /** Delete a formula */
  deleteFormula: async (id) => {
    try {
      await formulaService.deleteFormula(id);
      set((state) => ({
        formulas: state.formulas.filter((f) => f._id !== id),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete' };
    }
  },
}));

export default useFormulaStore;
