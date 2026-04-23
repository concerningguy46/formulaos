import { useState } from 'react';
import { Sparkles, Send, Loader2, ArrowDownToLine, Save } from 'lucide-react';
import { aiService } from '../../services/aiService';
import Button from '../ui/Button';

const panelStyle = {
  border: '1px solid var(--ivory-3)',
  borderRadius: '20px',
  background: 'rgba(255,255,255,0.98)',
  boxShadow: '0 28px 80px rgba(28, 26, 23, 0.14)',
};

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

  const promptChips = ['Calculate percentage increase', 'Find duplicates in a column', 'Show monthly profit margin'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'grid', placeItems: 'start center', padding: '72px 16px 24px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,26,23,0.18)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      <div style={{ ...panelStyle, position: 'relative', width: '100%', maxWidth: '720px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 20px', borderBottom: '1px solid var(--ivory-3)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '14px', display: 'grid', placeItems: 'center', background: 'rgba(0,212,170,0.10)', color: 'var(--teal-text)' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--ink)' }}>AI Formula Generator</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--ink-3)' }}>Describe what you need in plain English</p>
          </div>
        </div>

        <div style={{ padding: '16px 20px 0', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {promptChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setPrompt(chip)}
              style={{
                padding: '9px 12px',
                borderRadius: '999px',
                border: '1px solid var(--ivory-3)',
                background: 'white',
                color: 'var(--ink-2)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 20px 20px', display: 'grid', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='e.g., "Calculate the percentage increase between last month and this month"'
              autoFocus
              style={{
                minHeight: '110px',
                width: '100%',
                resize: 'vertical',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid var(--ivory-3)',
                background: 'white',
                color: 'var(--ink)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              style={{
                width: '52px',
                height: '52px',
                alignSelf: 'end',
                borderRadius: '16px',
                border: '1px solid var(--teal)',
                background: 'var(--teal)',
                color: 'var(--ink)',
                display: 'grid',
                placeItems: 'center',
                opacity: !prompt.trim() || loading ? 0.55 : 1,
              }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>

          {error ? (
            <div style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(185, 74, 69, 0.25)', background: 'rgba(185, 74, 69, 0.05)', color: 'var(--danger)', fontSize: '13px' }}>
              {error}
            </div>
          ) : null}

          {loading ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: 'var(--ivory-2)', overflow: 'hidden' }}>
                <div style={{ width: '55%', height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, var(--teal), var(--teal-dim))' }} />
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-3)' }}>Generating your formula...</p>
            </div>
          ) : null}

          {result && !loading ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ border: '1px solid var(--ivory-3)', borderRadius: '14px', background: 'white', padding: '16px' }}>
                <div style={{ marginBottom: '8px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                  Generated Formula
                </div>
                <code style={{ display: 'block', wordBreak: 'break-word', fontFamily: 'monospace', color: 'var(--ink)' }}>{result.formula}</code>
              </div>

              {result.explanation?.length ? (
                <div>
                  <div style={{ marginBottom: '8px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                    Explanation
                  </div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {result.explanation.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--ink-2)' }}>
                        <span style={{ color: 'var(--teal-text)', fontWeight: 700 }}>{i + 1}.</span>
                        <p style={{ margin: 0 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {result.assumptions?.length ? (
                <div style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--ivory-3)', background: 'rgba(247,244,239,0.6)', fontSize: '13px', color: 'var(--ink-2)' }}>
                  <strong style={{ color: 'var(--ink)' }}>Note:</strong> {result.assumptions.join('. ')}
                </div>
              ) : null}

              {result.usage ? (
                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--ink-3)' }}>
                  {result.usage.remaining} AI generations remaining this month
                </div>
              ) : null}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
