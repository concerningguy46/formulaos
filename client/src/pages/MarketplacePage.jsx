import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Store, Sparkles, TrendingUp, Download } from 'lucide-react';
import useMarketplaceStore from '../store/marketplaceStore';
import ListingCard from '../components/marketplace/ListingCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { CATEGORIES, SORT_OPTIONS } from '../utils/constants';

const MarketplacePage = () => {
  const { listings, total, loading, filters, setFilters, fetchListings } = useMarketplaceStore();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [filters, fetchListings]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 18px 56px' }}>
      <div style={{ border: '1px solid var(--ivory-3)', borderRadius: '20px', background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,244,239,0.92))', boxShadow: '0 20px 50px rgba(28, 26, 23, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '999px', border: '1px solid var(--ivory-3)', background: 'white', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            <Store size={13} />
            Marketplace
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'end', marginTop: '18px' }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4.4rem)', fontWeight: 400, lineHeight: 0.95, color: 'var(--ink)', maxWidth: '12ch' }}>
                Browse formulas, packs, and the logic people actually reuse.
              </h1>
              <p style={{ marginTop: '16px', maxWidth: '760px', lineHeight: 1.7, color: 'var(--ink-2)' }}>
                The marketplace is the platform layer in the PRD. It is here to turn a good spreadsheet trick into something searchable, reusable, and eventually sellable.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
              {[
                ['Live', 'Browse', 'teal'],
                ['Soon', 'Packs', 'gold'],
                ['Next', 'Payments', 'teal'],
              ].map(([value, label, tone]) => (
                <div key={label} style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--ivory-3)', background: 'white', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: tone === 'gold' ? 'var(--warning)' : 'var(--teal)' }}>{value}</div>
                  <div style={{ marginTop: '6px', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
            {[
              ['Discovery', 'Search and sort public formulas.', Sparkles, 'teal'],
              ['Trending', 'The homepage can later surface weekly bestsellers.', TrendingUp, 'gold'],
              ['Downloads', 'Free items are ready to browse and open.', Download, 'teal'],
            ].map(([title, desc, Icon, tone]) => (
              <div key={title} style={{ border: '1px solid var(--ivory-3)', borderRadius: '16px', background: 'white', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ink-2)', fontSize: '14px' }}>
                  <Icon size={15} color={tone === 'gold' ? 'var(--warning)' : 'var(--teal-text)'} />
                  {title}
                </div>
                <p style={{ margin: '10px 0 0', color: 'var(--ink-3)', fontSize: '13px', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--ink-3)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Search marketplace..."
              style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: '14px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink)', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--ivory-3)', background: showFilters ? 'rgba(0,212,170,0.08)' : 'white', color: showFilters ? 'var(--teal-text)' : 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {showFilters ? (
          <div style={{ padding: '18px', borderRadius: '16px', border: '1px solid var(--ivory-3)', background: 'white' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
              {[
                ['Category', filters.category, (value) => setFilters({ category: value }), CATEGORIES],
                ['Sort by', filters.sort, (value) => setFilters({ sort: value }), SORT_OPTIONS],
                ['Type', filters.type, (value) => setFilters({ type: value }), [
                  { value: 'all', label: 'All' },
                  { value: 'formula', label: 'Formulas' },
                  { value: 'pack', label: 'Packs' },
                ]],
              ].map(([label, value, onChange, options]) => (
                <div key={label} style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{label}</label>
                  <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: '13px 14px', borderRadius: '12px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink)' }}>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ marginBottom: '12px', color: 'var(--ink-3)', fontSize: '14px' }}>
        {total} result{total !== 1 ? 's' : ''} found
      </div>

      {loading ? <LoadingSpinner message="Browsing marketplace..." /> : null}

      {!loading && listings.length === 0 ? (
        <div style={{ padding: '60px 24px', border: '1px solid var(--ivory-3)', borderRadius: '18px', background: 'white', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--ivory-2)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <Store size={32} color="var(--ink-3)" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--ink)' }}>No listings yet</h3>
          <p style={{ margin: '10px 0 0', color: 'var(--ink-3)', fontSize: '14px' }}>
            {filters.search ? `No results for "${filters.search}". Try a different search.` : 'Be the first to upload a formula to the marketplace!'}
          </p>
        </div>
      ) : null}

      {!loading && listings.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default MarketplacePage;
