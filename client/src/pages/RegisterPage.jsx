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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await register(username, password);
    if (result.success) navigate('/editor');
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

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <Input label="Username" type="text" placeholder="Choose a username (min 3 characters)" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
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

