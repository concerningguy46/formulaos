import { useEffect, useState } from 'react';
import { Search, BookOpen, Plus, Sparkles, Clock3 } from 'lucide-react';
import useFormulaStore from '../store/formulaStore';
import useAuthStore from '../store/authStore';
import FormulaCard from '../components/formula/FormulaCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

/**
 * Library page — personal formula collection.
 * Shows all saved formulas as a card grid with search and filter.
 */
const LibraryPage = () => {
  const { formulas, loading, fetchFormulas, deleteFormula } = useFormulaStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Fetch formulas on mount
  useEffect(() => {
    if (user) {
      fetchFormulas();
    }
  }, [user, fetchFormulas]);

  // Filter formulas by search
  const filtered = formulas.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase()) ||
      f.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  /** Handle delete with confirmation */
  const handleDelete = async (formula) => {
    if (window.confirm(`Delete "${formula.name}"? This cannot be undone.`)) {
      await deleteFormula(formula._id);
    }
  };

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <BookOpen size={48} className="text-navy-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy-100 mb-2">Your Formula Library</h2>
        <p className="text-navy-400 mb-6">Sign in to save and manage your formulas</p>
        <Button variant="primary" onClick={() => navigate('/login')}>
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="page-shell max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="hero-panel mb-8 overflow-hidden">
        <div className="relative px-6 py-8 sm:px-8">
          <div className="section-kicker mb-4">
            <BookOpen size={13} />
            Personal library
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1
                className="section-title text-4xl sm:text-5xl"
                style={{ fontWeight: 400 }}
              >
                Keep your best formulas in one searchable place.
              </h1>
              <p className="mt-4 max-w-2xl text-navy-300 leading-relaxed">
                This is the memory layer from the PRD. Save a formula once, name it, tag it, and
                come back to it from any sheet.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="metric-chip">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-navy-500">
                  <Sparkles size={12} />
                  Reuse
                </div>
                <p className="mt-2 text-sm text-navy-200">Saved formulas can be inserted again later.</p>
              </div>
              <div className="metric-chip">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-navy-500">
                  <Clock3 size={12} />
                  Usage
                </div>
                <p className="mt-2 text-sm text-navy-200">Count how often each formula gets used.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-100">My Formula Library</h2>
          <p className="text-navy-400 mt-1">
            {formulas.length} formula{formulas.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('/editor')}>
          Create New
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your formulas..."
          className="input-search w-full pl-11"
        />
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner message="Loading your formulas..." />}

      {/* Empty State */}
      {!loading && formulas.length === 0 && (
        <div className="surface-panel text-center py-16 animate-fadeIn">
          <div className="w-20 h-20 rounded-2xl bg-navy-800 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-navy-600" />
          </div>
          <h3 className="text-lg font-semibold text-navy-200 mb-2">No formulas yet</h3>
          <p className="text-navy-400 text-sm mb-6">
            Go to the editor, create a formula, and click "Save" to add it here.
          </p>
          <Button variant="primary" onClick={() => navigate('/editor')}>
            Open Editor
          </Button>
        </div>
      )}

      {/* No search results */}
      {!loading && formulas.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-navy-400">No formulas match "{search}"</p>
        </div>
      )}

      {/* Formula Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filtered.map((formula) => (
            <FormulaCard
              key={formula._id}
              formula={formula}
              onDelete={handleDelete}
              onInsert={() => navigate('/editor')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
