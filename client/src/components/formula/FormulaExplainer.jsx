import { useState } from 'react';
import { X, Lightbulb, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';

/**
 * Formula Explainer — slide-in side panel that explains a formula
 * in plain English using Claude AI.
 */
const FormulaExplainer = ({ isOpen, onClose, formula }) => {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /** Fetch explanation from AI */
  const fetchExplanation = async () => {
    if (!formula || loading) return;

    setLoading(true);
    setError('');

    try {
      const result = await aiService.explain(formula);
      setExplanation(result.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to explain formula. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch when opened with a new formula
  useState(() => {
    if (isOpen && formula) {
      fetchExplanation();
    }
  }, [isOpen, formula]);

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-full sm:w-96 z-40 bg-white border-l border-ivory-3 shadow-sm animate-slideInRight overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-ivory-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-gold" />
          <h3 className="font-semibold text-navy-100">Formula Explainer</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded text-ink-3 hover:text-ink hover:bg-ivory-2 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Formula */}
      <div className="px-5 py-4">
        <div className="px-4 py-3 rounded-[4px] bg-white border border-ivory-3 mb-4">
          <code className="text-sm text-ink font-mono break-all">{formula}</code>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-8 gap-3">
            <Loader2 size={24} className="text-teal animate-spin" />
            <p className="text-navy-400 text-sm">Analyzing formula...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-3 mb-4">
            {error}
            <button
              onClick={fetchExplanation}
              className="block mt-2 text-teal text-xs underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Explanation */}
        {explanation && !loading && (
          <div className="space-y-4 animate-fadeIn">
            {/* Summary */}
            {explanation.summary && (
              <div className="px-4 py-3 rounded-lg bg-teal/5 border border-teal/20">
                <p className="text-sm text-navy-200">{explanation.summary}</p>
              </div>
            )}

            {/* Steps */}
            {explanation.steps && explanation.steps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-navy-200 mb-2">Step by Step:</h4>
                <div className="space-y-2">
                  {explanation.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ivory-2 flex items-center justify-center text-xs text-ink font-bold">
                        {i + 1}
                      </span>
                      <p className="text-navy-300 pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            {explanation.examples && explanation.examples.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-navy-200 mb-2">Examples:</h4>
                <div className="space-y-2">
                  {explanation.examples.map((ex, i) => (
                    <div key={i} className="px-3 py-2 rounded-[4px] bg-white border border-ivory-3 text-xs">
                      <span className="text-navy-400">{ex.input}</span>
                      <span className="text-navy-500 mx-2">→</span>
                      <span className="text-gold">{ex.output}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {explanation.tips && explanation.tips.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-navy-200 mb-2">💡 Tips:</h4>
                <ul className="space-y-1">
                  {explanation.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-navy-400 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-teal">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Prompt to start */}
        {!explanation && !loading && !error && (
          <button
            onClick={fetchExplanation}
            className="w-full py-6 text-center"
          >
            <Lightbulb size={32} className="text-gold/50 mx-auto mb-2" />
            <p className="text-navy-400 text-sm">Click to explain this formula</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default FormulaExplainer;
