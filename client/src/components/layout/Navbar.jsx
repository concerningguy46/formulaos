import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Grid3X3, BookOpen, Store, LogIn, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

/**
 * Top navigation bar — responsive with mobile hamburger menu.
 * Shows different nav items based on auth state.
 */
const Navbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/editor', label: 'Editor', icon: Grid3X3 },
    { to: '/library', label: 'Library', icon: BookOpen },
    { to: '/marketplace', label: 'Marketplace', icon: Store },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-ivory-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 flex items-center justify-center text-sm transition-transform group-hover:scale-105"
              style={{
                fontFamily: '"Instrument Serif", serif',
                fontStyle: 'italic',
                color: 'var(--ink)',
              }}
            >
              FO
            </div>
            <span
              className="hidden sm:flex items-center gap-2 text-[15px]"
              style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', color: 'var(--ink)' }}
            >
              FormulaOS
              <span className="status-chip">
                <Sparkles size={12} />
                MVP
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded text-[11px] uppercase tracking-[0.12em] transition-all ${
                  isActive(to)
                    ? 'text-ink'
                    : 'text-ink-3 hover:text-ink'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                  <Link
                    to={`/profile/${user._id}`}
                  className="flex items-center gap-2 text-sm text-ink-2 hover:text-ink transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-ivory-2 flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-sm flex items-center gap-1.5"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">
                  Log in
                </Link>
                <Link to="/register" className="btn-gold text-sm">
                  Sign up free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-ink-3 hover:text-ink"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slideInUp">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-[11px] uppercase tracking-[0.12em] ${
                    isActive(to)
                      ? 'text-ink'
                      : 'text-ink-3 hover:text-ink'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}

              <div className="border-t border-ivory-3 mt-2 pt-2">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded text-sm text-ink-2 hover:text-ink w-full"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded text-sm text-ink-2"
                    >
                      <LogIn size={16} />
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="btn-gold text-sm mx-4 mt-2 text-center"
                    >
                      Sign up free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
