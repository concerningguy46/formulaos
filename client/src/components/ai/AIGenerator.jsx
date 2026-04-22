import { useState } from 'react';
import { Sparkles, Send, Loader2, ArrowDownToLine, Save } from 'lucide-react';
import { aiService } from '../../services/aiService';
import Button from '../ui/Button';

/**
 * AI Formula Generator - takes plain English, returns formula + explanation.
 * Accessible from search bar empty state, formula bar, or /ai command.
 */
const AIGenerator = ({ isOpen, onClose, onInsert, onSave, initialPrompt = '' }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await aiService.generate(prompt.trim());
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate formula. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  if (!isOpen) return null;

  const promptChips = [
    'Calculate percentage increase',
    'Find duplicates in a column',
    'Show monthly profit margin',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-xl surface-panel overflow-hidden animate-scaleIn">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-ivory-3">
          <div className="w-8 h-8 rounded-[4px] bg-ivory-2 flex items-center justify-center">
            <Sparkles size={16} className="text-ink-2" />
          </div>
          <div>
            <h3 className="font-medium text-ink text-sm">AI Formula Generator</h3>
            <p className="text-xs text-ink-3">Describe what you need in plain English</p>
          </div>
        </div>

        <div className="px-5 pt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {promptChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setPrompt(chip)}
                className="rounded-[3px] border border-ivory-3 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:border-ink-3 hover:text-ink transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="flex gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='e.g., "Calculate the percentage increase between last month and this month"'
              className="input-base flex-1 h-20 resize-none text-sm"
              autoFocus
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="self-end p-3 rounded-[3px] bg-teal text-ink hover:bg-teal-dim transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-5 mb-4 rounded-[4px] border border-danger/20 bg-transparent px-4 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        {loading && (
          <div className="px-5 pb-6 flex flex-col items-center gap-3">
            <div className="w-full h-1 bg-ivory-3 rounded overflow-hidden">
              <div className="h-full bg-teal animate-shimmer rounded" />
            </div>
            <p className="text-ink-3 text-xs">Generating your formula...</p>
          </div>
        )}

        {result && !loading && (
          <div className="px-5 pb-5 space-y-4 animate-fadeIn">
            <div className="rounded-[4px] border border-ivory-3 bg-white px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase text-ink-3">Generated Formula</span>
              </div>
              <code className="block break-all font-mono text-sm font-bold text-ink">
                {result.formula}
              </code>
            </div>

            {result.explanation && result.explanation.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase text-ink-3">Explanation</h4>
                <div className="space-y-1.5">
                  {result.explanation.map((step, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="mt-0.5 text-xs font-bold text-ink-2">{i + 1}.</span>
                      <p className="text-ink-2">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.assumptions && result.assumptions.length > 0 && (
              <div className="rounded-[4px] border border-ivory-3 px-3 py-2 text-xs text-ink-3">
                <span className="font-medium text-ink">Note: </span>
                {result.assumptions.join('. ')}
              </div>
            )}

            {result.usage && (
              <div className="text-right text-xs text-ink-3">
                {result.usage.remaining} AI generations remaining this month
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                icon={ArrowDownToLine}
                onClick={() => {
                  onInsert?.(result.formula);
                  onClose();
                }}
              >
                Insert into Cell
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Save}
                onClick={() => {
                  onSave?.(result.formula, result.suggestedName || prompt);
                  onClose();
                }}
              >
                Save to Library
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerator;
