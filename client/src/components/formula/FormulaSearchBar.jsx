import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Store } from 'lucide-react';
import { searchBuiltInFormulas } from '../../utils/formulaIndex';
import useFormulaStore from '../../store/formulaStore';
import Badge from '../ui/Badge';

const FormulaSearchBar = ({ isOpen, onClose, onInsert, onAIGenerate, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('builtin');
  const inputRef = useRef(null);
  const { formulas: myFormulas } = useFormulaStore();

  const builtinResults = useMemo(() => {
    return activeTab === 'builtin' ? searchBuiltInFormulas(query) : [];
  }, [query, activeTab]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredMyFormulas = myFormulas.filter(
    (f) =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.description?.toLowerCase().includes(query.toLowerCase())
  );

  const handleInsert = (formula) => {
    onInsert(formula.syntax || formula.formula || '');
    onClose();
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'builtin', label: 'Built-in', count: builtinResults.length },
    { id: 'my', label: 'My Formulas', count: filteredMyFormulas.length },
    { id: 'marketplace', label: 'Marketplace', count: 0 },
  ];

  const hasResults =
    (activeTab === 'builtin' && builtinResults.length > 0) ||
    (activeTab === 'my' && filteredMyFormulas.length > 0);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'grid', placeItems: 'start center', padding: '96px 16px 24px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,26,23,0.18)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '760px', border: '1px solid var(--ivory-3)', borderRadius: '20px', background: 'rgba(255,255,255,0.98)', boxShadow: '0 28px 80px rgba(28,26,23,0.14)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', borderBottom: '1px solid var(--ivory-3)' }}>
          <Search size={18} color="var(--ink-3)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search formulas or describe the calculation you need"
            style={{ flex: 1, border: 0, outline: 'none', fontSize: '15px', color: 'var(--ink)', background: 'transparent' }}
          />
          <button onClick={onClose} style={{ width: '36px', height: '36px', display: 'grid', placeItems: 'center', borderRadius: '10px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink-3)' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', padding: '14px 18px 0', borderBottom: '1px solid var(--ivory-3)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 14px',
                border: 0,
                borderBottom: activeTab === tab.id ? '2px solid var(--teal)' : '2px solid transparent',
                background: 'transparent',
                color: activeTab === tab.id ? 'var(--ink)' : 'var(--ink-3)',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {tab.label} <span style={{ opacity: 0.65 }}>({tab.count})</span>
            </button>
          ))}
        </div>

        <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
          {activeTab === 'builtin' ? (
            builtinResults.map((formula, i) => (
              <button
                key={`${formula.name}-${i}`}
                onClick={() => handleInsert(formula)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', border: 0, borderBottom: '1px solid var(--ivory-3)', background: 'white', textAlign: 'left' }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', display: 'grid', placeItems: 'center', background: 'var(--ivory-2)', color: 'var(--ink-2)', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700 }}>fx</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{formula.name}</span>
                    <Badge variant="outline">{formula.category}</Badge>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--ink-3)' }}>{formula.description}</p>
                  <code style={{ fontSize: '12px', color: 'var(--ink-3)', fontFamily: 'monospace' }}>{formula.syntax}</code>
                </div>
                <ArrowRight size={15} color="var(--ink-3)" />
              </button>
            ))
          ) : null}

          {activeTab === 'my' ? (
            filteredMyFormulas.map((formula) => (
              <button
                key={formula._id}
                onClick={() => handleInsert(formula)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', border: 0, borderBottom: '1px solid var(--ivory-3)', background: 'white', textAlign: 'left' }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', display: 'grid', placeItems: 'center', background: 'rgba(0,212,170,0.10)', color: 'var(--teal-text)', flexShrink: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>My</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{formula.name}</span>
                  {formula.description ? <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--ink-3)' }}>{formula.description}</p> : null}
                  <code style={{ fontSize: '12px', color: 'var(--ink-3)', fontFamily: 'monospace' }}>{formula.syntax}</code>
                </div>
                <ArrowRight size={15} color="var(--ink-3)" />
              </button>
            ))
          ) : null}

          {activeTab === 'marketplace' ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--ink-3)' }}>
              <div style={{ width: '52px', height: '52px', margin: '0 auto 12px', borderRadius: '16px', background: 'var(--ivory-2)', display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>
                <Store size={18} />
              </div>
              <p style={{ margin: 0, fontSize: '14px' }}>Marketplace search is still a Phase 2 follow-up inside this overlay.</p>
              <p style={{ margin: '8px 0 0', fontSize: '13px' }}>Browse the full marketplace to explore live listings.</p>
            </div>
          ) : null}

          {!hasResults && query.length > 2 ? (
            <div style={{ padding: '28px 20px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 12px', color: 'var(--ink-3)', fontSize: '14px' }}>
                Can&apos;t find it? Describe what you need and AI will generate it.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onAIGenerate(query);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink)' }}
              >
                <Sparkles size={16} />
                Generate with AI
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FormulaSearchBar;
