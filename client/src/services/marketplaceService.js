import api from './api';

/**
 * Marketplace service — browse, search, upload, download
 */
export const marketplaceService = {
  /** Browse marketplace with filters */
  browse: async (params = {}) => {
    const { data } = await api.get('/marketplace', { params });
    return data;
  },

  /** Get listing detail */
  getDetail: async (id, type = 'formula') => {
    const { data } = await api.get(`/marketplace/${id}`, { params: { type } });
    return data;
  },

  /** Upload formula/pack to marketplace */
  upload: async (listingData) => {
    const { data } = await api.post('/marketplace/upload', listingData);
    return data;
  },

  /** Download a free formula */
  download: async (id) => {
    const { data } = await api.post(`/marketplace/${id}/download`);
    return data;
  },
};
