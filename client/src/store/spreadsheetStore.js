import { create } from 'zustand';
import api from '../services/api';

/**
 * Spreadsheet store — manages sheet data, auto-save, and cell selection.
 */
const useSpreadsheetStore = create((set, get) => ({
  sheetId: null,
  sheetData: null,
  isDirty: false,
  isSaving: false,
  lastSaved: null,
  selectedCell: null,
  selectedCellValue: '',
  selectedCellFormula: '',
  autoSaveTimer: null,

  /** Set the current sheet data */
  setSheetData: (data) => {
    set({ sheetData: data, isDirty: true });
  },

  /** Set selected cell info */
  setSelectedCell: (cell, value = '', formula = '') => {
    set({
      selectedCell: cell,
      selectedCellValue: value,
      selectedCellFormula: formula,
    });
  },

  /** Save sheet data to backend */
  saveSheet: async () => {
    const { sheetId, sheetData, isSaving } = get();
    if (isSaving || !sheetData) return;

    set({ isSaving: true });
    try {
      const { data } = await api.post('/sheets/save', {
        sheetId,
        data: sheetData,
      });

      set({
        sheetId: data.data._id,
        isDirty: false,
        isSaving: false,
        lastSaved: new Date(),
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      set({ isSaving: false });
    }
  },

  /** Load a sheet by ID */
  loadSheet: async (id) => {
    try {
      const { data } = await api.get(`/sheets/${id}`);
      set({
        sheetId: data.data._id,
        sheetData: data.data.data,
        isDirty: false,
      });
      return data.data;
    } catch (error) {
      console.error('Failed to load sheet:', error);
      return null;
    }
  },

  /** Start auto-save timer (every 30 seconds) */
  startAutoSave: () => {
    const timer = setInterval(() => {
      if (get().isDirty) {
        get().saveSheet();
      }
    }, 30000);
    set({ autoSaveTimer: timer });
  },

  /** Stop auto-save timer */
  stopAutoSave: () => {
    const { autoSaveTimer } = get();
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      set({ autoSaveTimer: null });
    }
  },
}));

export default useSpreadsheetStore;
