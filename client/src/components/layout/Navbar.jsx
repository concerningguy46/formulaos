import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Grid3X3, BookOpen, Store, LogIn, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';

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
    { to: '/editor', label: 'Workspace', icon: <Grid3X3 size={16} /> },
    { to: '/library', label: 'Library', icon: <BookOpen size={16} /> },
    { to: '/marketplace', label: 'Marketplace', icon: <Store size={16} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--ivory-3)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '16px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid var(--ivory-3)',
                borderRadius: '10px',
                background: 'linear-gradient(180deg, #fff, #f7f4ef)',
                fontFamily: '"Instrument Serif", serif',
                fontStyle: 'italic',
                color: 'var(--ink)',
              }}
            >
              FO
            </div>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: '"Instrument Serif", serif',
                fontStyle: 'italic',
                color: 'var(--ink)',
                fontSize: '16px',
              }}
            >
              FormulaOS
              <span className="status-chip">
                <Sparkles size={12} />
                MVP
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1', justifyContent: 'center' }}>
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive(to) ? 'var(--ink)' : 'var(--ink-3)',
                  background: isActive(to) ? 'rgba(0,212,170,0.08)' : 'transparent',
                }}
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  to={`/profile/${user._id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-2)', textDecoration: 'none' }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '999px', background: 'var(--ivory-2)', display: 'grid', placeItems: 'center' }}>
                    <User size={14} />
                  </div>
                  <span>{user.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} icon={LogOut}>
                  Logout
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Button variant="gold" size="sm">
                    Sign up free
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'grid',
              placeItems: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              border: '1px solid var(--ivory-3)',
              background: 'white',
              color: 'var(--ink-2)',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ paddingBottom: '16px', animation: 'slideInUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px' }}>
              {navLinks.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isActive(to) ? 'var(--ink)' : 'var(--ink-3)',
                    background: isActive(to) ? 'rgba(0,212,170,0.08)' : 'transparent',
                  }}
                >
                  {icon}
                  {label}
                </Link>
              ))}

              <div style={{ borderTop: '1px solid var(--ivory-3)', marginTop: '10px', paddingTop: '10px' }}>
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--ivory-3)',
                      background: 'white',
                      color: 'var(--ink-2)',
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', color: 'var(--ink-2)', textDecoration: 'none' }}
                    >
                      <LogIn size={16} />
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      style={{ display: 'block', margin: '8px 14px 0', textAlign: 'center', textDecoration: 'none' }}
                    >
                      <Button variant="gold" size="sm" className="w-full">
                        Sign up free
                      </Button>
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
