import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Search,
  Sparkles,
  Store,
  TrendingUp,
  WandSparkles,
  Zap,
} from 'lucide-react';
import Button from '../components/ui/Button';

const liveItems = [
  {
    title: 'Formula Search',
    description: 'Plain-English lookup for built-in formulas and your saved logic.',
    icon: Search,
    tone: 'teal',
  },
  {
    title: 'Personal Library',
    description: 'Save, name, and reuse formulas from any sheet.',
    icon: BookOpen,
    tone: 'gold',
  },
  {
    title: 'AI Generator',
    description: 'Describe the calculation you want and generate the formula.',
    icon: WandSparkles,
    tone: 'teal',
  },
];

const roadmap = [
  {
    label: 'Now',
    title: 'Core workspace',
    status: 'Partially live',
    details: ['Landing page', 'Editor shell', 'Library', 'Marketplace browse', 'AI formula flow'],
    icon: CheckCircle2,
  },
  {
    label: 'Next',
    title: 'Product depth',
    status: 'Still needed',
    details: ['Real import/export', 'Formula variables', 'Marketplace search tabs', 'Review flow'],
    icon: Clock3,
  },
  {
    label: 'Later',
    title: 'Scale features',
    status: 'Future phase',
    details: ['Collaboration', 'Team workspaces', 'Mobile-first editor', 'API access'],
    icon: TrendingUp,
  },
];

const cardStyle = {
  border: '1px solid var(--ivory-3)',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.92)',
  boxShadow: '0 20px 50px rgba(28, 26, 23, 0.06)',
};

const HomePage = () => {
  return (
    <div className="page-shell">
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '42px 18px 56px' }}>
        <div className="hero-panel" style={{ position: 'relative', overflow: 'hidden', borderRadius: '18px' }}>
          <div className="bg-grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.18 }} />
          <div
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1.15fr 0.85fr',
              gap: '44px',
              padding: '52px',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="section-kicker" style={{ marginBottom: '20px' }}>
                <Sparkles size={13} />
                Formula logic, made human
              </div>

              <h1
                style={{
                  margin: 0,
                  color: 'var(--ink)',
                  fontFamily: '"Instrument Serif", Georgia, serif',
                  fontSize: 'clamp(3rem, 6vw, 5.2rem)',
                  fontWeight: 400,
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  maxWidth: '12ch',
                }}
              >
                Search, save, and sell the formulas you already use.
              </h1>

              <p style={{ marginTop: '22px', maxWidth: '760px', fontSize: '1.06rem', lineHeight: 1.7, color: 'var(--ink-2)' }}>
                FormulaOS is the spreadsheet layer for non-experts. It helps people find formulas
                in plain English, keep their best logic in one place, and turn reusable knowledge
                into a marketplace product.
              </p>

              <div style={{ marginTop: '28px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link to="/editor" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="lg" icon={ArrowRight}>
                    Open workspace
                  </Button>
                </Link>
                <Link to="/marketplace" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="lg" icon={Store}>
                    Explore marketplace
                  </Button>
                </Link>
              </div>

              <div
                style={{
                  marginTop: '30px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '14px',
                }}
              >
                {[
                  ['3', 'Core loops', 'teal'],
                  ['1', 'Shared library', 'gold'],
                  ['20', 'AI generations', 'teal'],
                ].map(([value, label, tone]) => (
                  <div key={label} className="metric-chip" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: tone === 'gold' ? 'var(--warning)' : 'var(--teal)' }}>
                      {value}
                    </div>
                    <div
                      style={{
                        marginTop: '6px',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'var(--ink-3)',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="surface-panel" style={{ ...cardStyle, padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                      Product snapshot
                    </p>
                    <h2 style={{ margin: '6px 0 0', fontSize: '1.45rem', fontWeight: 600, color: 'var(--ink)' }}>
                      What FormulaOS feels like today
                    </h2>
                  </div>
                  <div className="status-chip">
                    <Zap size={12} />
                    Live
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
                  {liveItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        style={{
                          border: '1px solid var(--ivory-3)',
                          borderRadius: '12px',
                          background: 'white',
                          padding: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '14px',
                              display: 'grid',
                              placeItems: 'center',
                              background: item.tone === 'gold' ? 'rgba(245, 200, 66, 0.12)' : 'rgba(0, 212, 170, 0.12)',
                              color: item.tone === 'gold' ? 'var(--warning)' : 'var(--teal-text)',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--ink)' }}>{item.title}</h3>
                            <p style={{ margin: '6px 0 0', fontSize: '0.94rem', lineHeight: 1.6, color: 'var(--ink-3)' }}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '14px', border: '1px solid var(--ivory-3)', borderRadius: '12px', background: 'white', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                    <span>Example prompt</span>
                    <span>Plain English</span>
                  </div>
                  <div style={{ marginTop: '12px', border: '1px solid rgba(0,212,170,0.14)', background: 'rgba(0,212,170,0.06)', borderRadius: '12px', padding: '14px 16px', fontSize: '0.95rem', color: 'var(--ink)' }}>
                    Calculate the percentage increase between last month and this month.
                  </div>
                  <div style={{ marginTop: '12px', border: '1px solid rgba(245,200,66,0.18)', background: 'rgba(245,200,66,0.07)', borderRadius: '12px', padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.94rem', color: 'var(--teal-text)' }}>
                    =((C2-B2)/B2)*100
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 18px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div className="section-kicker" style={{ marginBottom: '12px' }}>
              <CheckCircle2 size={13} />
              Built now vs next
            </div>
            <h2 className="section-title" style={{ margin: 0, fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
              The honest roadmap
            </h2>
          </div>
          <p style={{ margin: 0, maxWidth: '600px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            The product already has the core shell. These cards show what is genuinely ready and
            what still needs to be completed before the PRD is fully matched.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
          {roadmap.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="roadmap-card" style={{ padding: '22px', ...cardStyle }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                      {item.label}
                    </div>
                    <h3 style={{ margin: '10px 0 0', fontSize: '1.4rem', color: 'var(--ink)' }}>{item.title}</h3>
                  </div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--ivory-2)', color: 'var(--teal)', display: 'grid', placeItems: 'center' }}>
                    <Icon size={18} />
                  </div>
                </div>
                <div style={{ marginTop: '14px' }} className="status-chip">
                  {item.status}
                </div>
                <ul style={{ margin: '16px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: '10px', color: 'var(--ink-2)', fontSize: '0.95rem' }}>
                  {item.details.map((line) => (
                    <li key={line} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ marginTop: '8px', width: '6px', height: '6px', borderRadius: '999px', background: 'var(--teal)', flexShrink: 0 }} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 18px 80px' }}>
        <div className="surface-panel" style={{ ...cardStyle, padding: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'center' }}>
            <div>
              <div className="section-kicker" style={{ marginBottom: '12px' }}>
                <Sparkles size={13} />
                Why it wins
              </div>
              <h2 className="section-title" style={{ margin: 0, fontSize: 'clamp(1.8rem, 3vw, 2.7rem)' }}>
                The spreadsheet that remembers your best logic
              </h2>
              <p style={{ marginTop: '14px', maxWidth: '640px', lineHeight: 1.7, color: 'var(--ink-2)' }}>
                Every formula you save becomes searchable, reusable, and shareable. That memory
                loop is the product moat the PRD is aiming for.
              </p>
            </div>

            <div style={{ width: '1px', height: '96px', background: 'var(--ivory-3)' }} />

            <div style={{ display: 'grid', gap: '12px', fontSize: '0.95rem', color: 'var(--ink-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(0,212,170,0.14)', background: 'rgba(0,212,170,0.06)', borderRadius: '14px', padding: '14px 16px' }}>
                <CheckCircle2 size={16} color="var(--teal)" />
                Search, save, and AI generation are already wired into the app shell
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(245,200,66,0.16)', background: 'rgba(245,200,66,0.06)', borderRadius: '14px', padding: '14px 16px' }}>
                <Store size={16} color="var(--warning)" />
                Marketplace browsing exists, but packs, reviews, and payment flow still need polish
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
