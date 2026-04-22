import { create } from 'zustand';
import { marketplaceService } from '../services/marketplaceService';

/**
 * Marketplace store — manages browse state, filters, and search.
 */
const useMarketplaceStore = create((set) => ({
  listings: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
    sort: '-createdAt',
    type: 'all',
  },

  /** Update filter values */
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1,
    }));
  },

  /** Fetch marketplace listings with current filters */
  fetchListings: async () => {
    set({ loading: true, error: null });
    try {
      const state = useMarketplaceStore.getState();
      const params = {
        ...state.filters,
        page: state.page,
        limit: 20,
      };

      // Remove empty search
      if (!params.search) delete params.search;

      const result = await marketplaceService.browse(params);
      set({
        listings: result.data,
        total: result.total,
        pages: result.pages,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch marketplace',
      });
    }
  },

  /** Set page for pagination */
  setPage: (page) => set({ page }),
}));

export default useMarketplaceStore;
