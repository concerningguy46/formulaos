import { useEffect, useState } from 'react';
import { Search, BookOpen, Plus, Sparkles, Clock3 } from 'lucide-react';
import useFormulaStore from '../store/formulaStore';
import useAuthStore from '../store/authStore';
import FormulaCard from '../components/formula/FormulaCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const LibraryPage = () => {
  const { formulas, loading, fetchFormulas, deleteFormula } = useFormulaStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchFormulas();
  }, [user, fetchFormulas]);

  const filtered = formulas.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase()) ||
      f.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (formula) => {
    if (window.confirm(`Delete "${formula.name}"? This cannot be undone.`)) {
      await deleteFormula(formula._id);
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '120px 18px', textAlign: 'center' }}>
        <BookOpen size={48} color="var(--ink-3)" />
        <h2 style={{ margin: '18px 0 8px', fontSize: '2rem', color: 'var(--ink)' }}>Your Formula Library</h2>
        <p style={{ margin: '0 0 24px', color: 'var(--ink-3)' }}>Sign in to save and manage your formulas</p>
        <Button variant="primary" onClick={() => navigate('/login')}>
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 18px 56px' }}>
      <div style={{ border: '1px solid var(--ivory-3)', borderRadius: '20px', background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,244,239,0.92))', boxShadow: '0 20px 50px rgba(28, 26, 23, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '999px', border: '1px solid var(--ivory-3)', background: 'white', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            <BookOpen size={13} />
            Personal library
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '24px', alignItems: 'end', marginTop: '18px' }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4.4rem)', fontWeight: 400, lineHeight: 0.95, color: 'var(--ink)', maxWidth: '12ch' }}>
                Keep your best formulas in one searchable place.
              </h1>
              <p style={{ marginTop: '16px', maxWidth: '760px', lineHeight: 1.7, color: 'var(--ink-2)' }}>
                This is the memory layer from the PRD. Save a formula once, name it, tag it, and come back to it from any sheet.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
              {[
                ['Reuse', 'Saved formulas can be inserted again later.', Sparkles, 'teal'],
                ['Usage', 'Count how often each formula gets used.', Clock3, 'gold'],
              ].map(([title, desc, Icon, tone]) => (
                <div key={title} style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--ivory-3)', background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                    <Icon size={12} color={tone === 'gold' ? 'var(--warning)' : 'var(--teal-text)'} />
                    {title}
                  </div>
                  <p style={{ margin: '10px 0 0', fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-3)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginTop: '26px', marginBottom: '18px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--ink)' }}>My Formula Library</h2>
          <p style={{ margin: '6px 0 0', color: 'var(--ink-3)' }}>
            {formulas.length} formula{formulas.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('/editor')}>
          Create New
        </Button>
      </div>

      <div style={{ position: 'relative', marginBottom: '18px' }}>
        <Search size={18} color="var(--ink-3)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your formulas..."
          style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: '14px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink)', boxSizing: 'border-box' }}
        />
      </div>

      {loading ? <LoadingSpinner message="Loading your formulas..." /> : null}

      {!loading && formulas.length === 0 ? (
        <div style={{ padding: '60px 24px', border: '1px solid var(--ivory-3)', borderRadius: '18px', background: 'white', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--ivory-2)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <BookOpen size={32} color="var(--ink-3)" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--ink)' }}>No formulas yet</h3>
          <p style={{ margin: '10px 0 18px', color: 'var(--ink-3)', fontSize: '14px' }}>
            Go to the editor, create a formula, and click "Save" to add it here.
          </p>
          <Button variant="primary" onClick={() => navigate('/editor')}>
            Open Editor
          </Button>
        </div>
      ) : null}

      {!loading && formulas.length > 0 && filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 24px', color: 'var(--ink-3)' }}>
          No formulas match "{search}"
        </div>
      ) : null}

      {!loading && filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map((formula) => (
            <FormulaCard
              key={formula._id}
              formula={formula}
              onDelete={handleDelete}
              onInsert={() => navigate('/editor')}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default LibraryPage;
