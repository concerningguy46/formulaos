import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Store, Sparkles, TrendingUp, Download } from 'lucide-react';
import useMarketplaceStore from '../store/marketplaceStore';
import ListingCard from '../components/marketplace/ListingCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { CATEGORIES, SORT_OPTIONS } from '../utils/constants';

/**
 * Marketplace browse page — search, filter, sort public formulas.
 */
const MarketplacePage = () => {
  const { listings, total, loading, filters, setFilters, fetchListings } = useMarketplaceStore();
  const [showFilters, setShowFilters] = useState(false);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchListings();
  }, [filters, fetchListings]);

  return (
    <div className="page-shell max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="hero-panel mb-8 overflow-hidden">
        <div className="relative px-6 py-8 sm:px-8">
          <div className="section-kicker mb-4">
            <Store size={13} />
            Marketplace
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1
                className="section-title text-4xl sm:text-5xl"
                style={{ fontWeight: 400 }}
              >
                Browse formulas, packs, and the logic people actually reuse.
              </h1>
              <p className="mt-4 max-w-2xl text-navy-300 leading-relaxed">
                The marketplace is the platform layer in the PRD. It is here to turn a good
                spreadsheet trick into something searchable, reusable, and eventually sellable.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="metric-chip text-center">
                <div className="text-2xl font-bold text-teal">Live</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-navy-500">
                  Browse
                </div>
              </div>
              <div className="metric-chip text-center">
                <div className="text-2xl font-bold text-gold">Soon</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-navy-500">
                  Packs
                </div>
              </div>
              <div className="metric-chip text-center">
                <div className="text-2xl font-bold text-teal">Next</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-navy-500">
                  Payments
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[4px] border border-ivory-3 bg-white p-4">
              <div className="flex items-center gap-2 text-sm text-navy-400">
                <Sparkles size={15} className="text-teal" />
                Discovery
              </div>
              <p className="mt-2 text-sm text-navy-200">Search and sort public formulas.</p>
            </div>
            <div className="rounded-[4px] border border-ivory-3 bg-white p-4">
              <div className="flex items-center gap-2 text-sm text-navy-400">
                <TrendingUp size={15} className="text-gold" />
                Trending
              </div>
              <p className="mt-2 text-sm text-navy-200">The homepage can later surface weekly bestsellers.</p>
            </div>
            <div className="rounded-[4px] border border-ivory-3 bg-white p-4">
              <div className="flex items-center gap-2 text-sm text-navy-400">
                <Download size={15} className="text-teal" />
                Downloads
              </div>
              <p className="mt-2 text-sm text-navy-200">Free items are ready to browse and open.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Search marketplace..."
            className="input-search w-full pl-11"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-[3px] border transition-all ${
            showFilters
              ? 'bg-teal-bg border-ivory-3 text-teal-text'
              : 'bg-white border-ivory-3 text-ink-2 hover:text-ink'
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass-card-static p-4 mb-6 animate-slideInUp">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-navy-400 mb-1.5">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ category: e.target.value })}
                className="input-base w-full text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-medium text-navy-400 mb-1.5">Sort by</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ sort: e.target.value })}
                className="input-base w-full text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-navy-400 mb-1.5">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ type: e.target.value })}
                className="input-base w-full text-sm"
              >
                <option value="all">All</option>
                <option value="formula">Formulas</option>
                <option value="pack">Packs</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-navy-500 mb-4">
        {total} result{total !== 1 ? 's' : ''} found
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner message="Browsing marketplace..." />}

      {/* Empty State */}
      {!loading && listings.length === 0 && (
        <div className="surface-panel text-center py-16 animate-fadeIn">
          <div className="w-20 h-20 rounded-[4px] bg-ivory-2 flex items-center justify-center mx-auto mb-4">
            <Store size={32} className="text-ink-3" />
          </div>
          <h3 className="text-lg font-medium text-ink mb-2">No listings yet</h3>
          <p className="text-ink-3 text-sm">
            {filters.search
              ? `No results for "${filters.search}". Try a different search.`
              : 'Be the first to upload a formula to the marketplace!'}
          </p>
        </div>
      )}

      {/* Listings Grid */}
      {!loading && listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
