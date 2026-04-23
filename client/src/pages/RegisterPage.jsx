import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const panelStyle = {
  border: '1px solid var(--ivory-3)',
  borderRadius: '22px',
  background: 'rgba(255,255,255,0.96)',
  boxShadow: '0 24px 70px rgba(28, 26, 23, 0.08)',
};

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await register(name, email, password);
    if (result.success) navigate('/editor');
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'grid',
        placeItems: 'center',
        padding: '32px 16px',
        background:
          'radial-gradient(circle at top left, rgba(0,212,170,0.07), transparent 28%), linear-gradient(180deg, #f7f4ef 0%, #fbfaf7 56%, #f7f4ef 100%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ ...panelStyle, padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              Join FormulaOS
            </div>
            <h1 style={{ margin: '8px 0 0', fontFamily: '"Instrument Serif", Georgia, serif', fontSize: '2.4rem', fontWeight: 400, color: 'var(--ink)' }}>
              Create your account
            </h1>
          </div>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid var(--ivory-3)',
              background: 'white',
              color: 'var(--ink)',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--ivory-3)' }} />
            <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              or
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--ivory-3)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <Input label="Full Name" type="text" placeholder="Dikshyant" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

            {error ? (
              <div style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(185, 74, 69, 0.25)', background: 'rgba(185, 74, 69, 0.05)', color: 'var(--danger)', fontSize: '13px' }}>
                {error}
              </div>
            ) : null}

            <Button type="submit" variant="primary" loading={loading} className="w-full" icon={UserPlus}>
              Create account
            </Button>
          </form>
        </div>

        <p style={{ marginTop: '18px', textAlign: 'center', color: 'var(--ink-3)', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
