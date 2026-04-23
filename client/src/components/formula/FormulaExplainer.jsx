import { useEffect, useState } from 'react';
import { X, Lightbulb, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';

const FormulaExplainer = ({ isOpen, onClose, formula }) => {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (isOpen && formula) {
      fetchExplanation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, formula]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', right: 0, top: '64px', bottom: 0, width: 'min(100vw, 420px)', zIndex: 40, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--ivory-3)', background: 'rgba(255,255,255,0.98)', boxShadow: '-12px 0 40px rgba(28,26,23,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--ivory-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(245,200,66,0.14)', display: 'grid', placeItems: 'center', color: 'var(--warning)' }}>
            <Lightbulb size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--ink)' }}>Formula Explainer</h3>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--ink-3)' }}>Plain English breakdown</p>
          </div>
        </div>
        <button onClick={onClose} style={{ width: '36px', height: '36px', display: 'grid', placeItems: 'center', borderRadius: '10px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink-3)' }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ padding: '18px 20px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '16px', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--ivory-3)', background: 'white' }}>
          <code style={{ fontFamily: 'monospace', color: 'var(--ink)' }}>{formula}</code>
        </div>

        {loading ? (
          <div style={{ display: 'grid', placeItems: 'center', gap: '12px', padding: '24px 0' }}>
            <Loader2 size={24} className="animate-spin" />
            <p style={{ margin: 0, color: 'var(--ink-3)', fontSize: '13px' }}>Analyzing formula...</p>
          </div>
        ) : null}

        {error ? (
          <div style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(185, 74, 69, 0.25)', background: 'rgba(185, 74, 69, 0.05)', color: 'var(--danger)', fontSize: '13px' }}>
            {error}
            <button onClick={fetchExplanation} style={{ display: 'block', marginTop: '10px', border: 0, background: 'transparent', color: 'var(--teal-text)', textDecoration: 'underline', padding: 0 }}>
              Try again
            </button>
          </div>
        ) : null}

        {explanation && !loading ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {explanation.summary ? (
              <div style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(0,212,170,0.14)', background: 'rgba(0,212,170,0.06)', color: 'var(--ink-2)', fontSize: '14px', lineHeight: 1.6 }}>
                {explanation.summary}
              </div>
            ) : null}

            {explanation.steps?.length ? (
              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                  Step by Step
                </h4>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {explanation.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: 'var(--ink-2)' }}>
                      <span style={{ width: '26px', height: '26px', borderRadius: '999px', background: 'var(--ivory-2)', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700 }}>
                        {i + 1}
                      </span>
                      <p style={{ margin: 0, lineHeight: 1.6 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {explanation.examples?.length ? (
              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                  Examples
                </h4>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {explanation.examples.map((ex, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--ivory-3)', background: 'white', fontSize: '13px' }}>
                      <span style={{ color: 'var(--ink-3)' }}>{ex.input}</span>
                      <span style={{ color: 'var(--ink-3)', margin: '0 8px' }}>→</span>
                      <span style={{ color: 'var(--warning)' }}>{ex.output}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {explanation.tips?.length ? (
              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                  Tips
                </h4>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '8px' }}>
                  {explanation.tips.map((tip, i) => (
                    <li key={i} style={{ color: 'var(--ink-3)', fontSize: '13px', lineHeight: 1.5 }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {!explanation && !loading && !error ? (
          <button onClick={fetchExplanation} style={{ width: '100%', border: '1px dashed var(--ivory-3)', borderRadius: '16px', background: 'white', padding: '28px 18px', color: 'var(--ink-3)' }}>
            <Lightbulb size={28} color="var(--warning)" style={{ margin: '0 auto 8px', display: 'block' }} />
            <div style={{ fontSize: '14px' }}>Click to explain this formula</div>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default FormulaExplainer;
