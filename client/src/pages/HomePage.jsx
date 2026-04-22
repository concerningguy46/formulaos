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

const HomePage = () => {
  return (
    <div className="page-shell">
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-14">
        <div className="hero-panel overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="relative grid gap-12 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-14">
            <div className="animate-fadeIn">
              <div className="section-kicker mb-6">
                <Sparkles size={13} />
                Formula logic, made human
              </div>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl tracking-tight text-ink leading-[0.95]"
                style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}
              >
                Search, save, and sell the formulas you already use.
              </h1>

              <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-navy-300">
                FormulaOS is the spreadsheet layer for non-experts. It helps people find formulas
                in plain English, keep their best logic in one place, and turn reusable knowledge
                into a marketplace product.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/editor">
                  <Button variant="primary" size="lg" icon={ArrowRight}>
                    Try the workspace
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="secondary" size="lg" icon={Store}>
                    Explore marketplace
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="metric-chip">
                  <div className="text-2xl font-bold text-teal">3</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-navy-400">
                    Core loops
                  </div>
                </div>
                <div className="metric-chip">
                  <div className="text-2xl font-bold text-gold">1</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-navy-400">
                    Shared library
                  </div>
                </div>
                <div className="metric-chip">
                  <div className="text-2xl font-bold text-teal">20</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-navy-400">
                    AI generations
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="surface-panel p-5 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-navy-400">Product snapshot</p>
                    <h2 className="mt-1 text-xl font-semibold text-navy-100">
                      What FormulaOS feels like today
                    </h2>
                  </div>
                  <div className="status-chip">
                    <Zap size={12} />
                    Live
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {liveItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-[4px] border border-ivory-3 bg-white p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              item.tone === 'gold' ? 'bg-gold/10 text-gold' : 'bg-teal/10 text-teal'
                            }`}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-navy-100">{item.title}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-navy-400">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-[4px] border border-ivory-3 bg-white p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-navy-500">
                    <span>Example prompt</span>
                    <span>Plain English</span>
                  </div>
                  <div className="mt-3 rounded-xl border border-teal/15 bg-teal/5 px-4 py-3 text-sm text-navy-200">
                    Calculate the percentage increase between last month and this month.
                  </div>
                  <div className="mt-3 rounded-xl border border-gold/15 bg-gold/5 px-4 py-3 font-mono text-sm text-teal">
                    =((C2-B2)/B2)*100
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-4 hidden max-w-xs rounded-[4px] border border-ivory-3 bg-white p-4 shadow-sm lg:block">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy-100">
                  <Clock3 size={16} className="text-gold" />
                  What is left to build
                </div>
                <ul className="mt-3 space-y-2 text-sm text-navy-400">
                  <li>Real import/export for xlsx and csv</li>
                  <li>Marketplace packs, pricing, and reviews</li>
                  <li>Formula variables and reusable inputs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="section-kicker mb-3">
              <CheckCircle2 size={13} />
              Built now vs next
            </div>
            <h2 className="section-title">The honest roadmap</h2>
          </div>
          <p className="hidden max-w-xl text-sm text-navy-400 md:block">
            The product already has the core shell. These cards show what is genuinely ready and
            what still needs to be completed before the PRD is fully matched.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {roadmap.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="roadmap-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-navy-500">{item.label}</div>
                    <h3 className="mt-2 text-xl font-semibold text-navy-100">{item.title}</h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-ivory-2 text-teal">
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-3 inline-flex rounded-[2px] border border-ivory-3 bg-white px-3 py-1 text-xs text-ink-2">
                  {item.status}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-navy-400">
                  {item.details.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="surface-panel px-6 py-8 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div>
              <div className="section-kicker mb-3">
                <Sparkles size={13} />
                Why it wins
              </div>
              <h2 className="section-title">The spreadsheet that remembers your best logic</h2>
              <p className="mt-4 max-w-xl text-navy-300 leading-relaxed">
                Every formula you save becomes searchable, reusable, and shareable. That memory
                loop is the product moat the PRD is aiming for.
              </p>
            </div>

            <div className="hidden h-24 w-px bg-ivory-3 lg:block" />

            <div className="grid gap-3 text-sm text-navy-300">
              <div className="flex items-center gap-3 rounded-2xl border border-teal/15 bg-teal/5 px-4 py-3">
                <CheckCircle2 size={16} className="text-teal" />
                Search, save, and AI generation are already wired into the app shell
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-gold/15 bg-gold/5 px-4 py-3">
                <Store size={16} className="text-gold" />
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
