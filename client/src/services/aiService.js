import api from './api';

/**
 * AI service — formula generation and explanation
 */
export const aiService = {
  /** Generate a formula from plain English description */
  generate: async (description, columnHeaders = [], sampleData = null) => {
    const { data } = await api.post('/ai/generate', {
      description,
      columnHeaders,
      sampleData,
    });
    return data;
  },

  /** Explain a formula in plain English */
  explain: async (formula) => {
    const { data } = await api.post('/ai/explain', { formula });
    return data;
  },
};
