import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Store } from 'lucide-react';
import { searchBuiltInFormulas } from '../../utils/formulaIndex';
import useFormulaStore from '../../store/formulaStore';
import Badge from '../ui/Badge';

/**
 * Formula Search Bar - floating command palette with 3 tabs:
 * Built-in, My Formulas, Marketplace.
 * Empty state leads to AI generator.
 */
const FormulaSearchBar = ({ isOpen, onClose, onInsert, onAIGenerate }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('builtin');
  const [builtinResults, setBuiltinResults] = useState([]);
  const inputRef = useRef(null);
  const { formulas: myFormulas } = useFormulaStore();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setBuiltinResults(searchBuiltInFormulas(''));
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab === 'builtin') {
      setBuiltinResults(searchBuiltInFormulas(query));
    }
  }, [query, activeTab]);

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-2xl surface-panel overflow-hidden animate-scaleIn">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-ivory-3">
          <Search size={18} className="text-ink-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search formulas or describe the calculation you need"
            className="flex-1 bg-transparent text-ink placeholder-ink-3 text-base outline-none"
          />
          <button onClick={onClose} className="p-1 text-ink-3 hover:text-ink">
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-0 px-5 pt-3 border-b border-ivory-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'text-ink border-teal'
                  : 'text-ink-3 border-transparent hover:text-ink'
              }`}
            >
              {tab.label}
              <span className="text-xs opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {activeTab === 'builtin' &&
            builtinResults.map((formula, i) => (
            <button
              key={`${formula.name}-${i}`}
              onClick={() => handleInsert(formula)}
              className="w-full flex items-center gap-4 px-5 py-3 hover:bg-ivory-2 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-[4px] bg-ivory-2 flex items-center justify-center flex-shrink-0">
                <span className="text-ink-2 font-mono text-xs font-bold">fx</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink text-sm">{formula.name}</span>
                  <Badge variant="outline">{formula.category}</Badge>
                </div>
                <p className="text-xs text-ink-3 mt-0.5 truncate">{formula.description}</p>
                <code className="text-xs text-ink-3 font-mono">{formula.syntax}</code>
              </div>
              <ArrowRight
                size={14}
                className="text-ink-3 group-hover:text-ink transition-colors flex-shrink-0"
              />
            </button>
          ))}

          {activeTab === 'my' &&
            filteredMyFormulas.map((formula) => (
            <button
              key={formula._id}
              onClick={() => handleInsert(formula)}
              className="w-full flex items-center gap-4 px-5 py-3 hover:bg-ivory-2 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-[4px] bg-ivory-2 flex items-center justify-center flex-shrink-0">
                <span className="text-ink-2 font-mono text-xs font-bold">My</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-ink text-sm">{formula.name}</span>
                {formula.description && (
                  <p className="text-xs text-ink-3 mt-0.5 truncate">{formula.description}</p>
                )}
                <code className="text-xs text-ink-3 font-mono">{formula.syntax}</code>
              </div>
              <ArrowRight
                size={14}
                className="text-ink-3 group-hover:text-ink transition-colors flex-shrink-0"
              />
            </button>
          ))}

          {activeTab === 'marketplace' && (
            <div className="px-5 py-8 text-center text-ink-3 text-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[4px] bg-ivory-2 text-ink-2">
                <Store size={18} />
              </div>
              <p>Marketplace search is still a Phase 2 follow-up inside this overlay.</p>
              <p className="mt-1 text-ink-3">
                Browse the full marketplace to explore live listings.
              </p>
            </div>
          )}

          {!hasResults && query.length > 2 && (
            <div className="px-5 py-6 text-center">
              <p className="text-ink-3 text-sm mb-3">
                Can&apos;t find it? Describe what you need and AI will generate it.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onAIGenerate(query);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] border border-ivory-3 text-ink hover:border-ink-3 transition-all"
              >
                <Sparkles size={16} />
                Generate with AI
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaSearchBar;
