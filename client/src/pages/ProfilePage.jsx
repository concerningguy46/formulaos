import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, Star, Calendar } from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/marketplace/ListingCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatCount, formatDate } from '../utils/formatters';

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${id}/profile`);
        setProfile(data.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (!profile) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '120px 18px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--ink)', fontSize: '1.8rem' }}>User not found</h2>
      </div>
    );
  }

  const { user, formulas, stats } = profile;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 18px 56px' }}>
      <div style={{ padding: '28px', border: '1px solid var(--ivory-3)', borderRadius: '20px', background: 'rgba(255,255,255,0.96)', boxShadow: '0 20px 50px rgba(28, 26, 23, 0.06)', marginBottom: '26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'center' }}>
          <div style={{ width: '88px', height: '88px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(245,200,66,0.12))', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <User size={34} color="var(--ink-2)" />
          </div>

          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--ink)' }}>{user.name}</h1>
            {user.bio ? <p style={{ margin: '8px 0 0', color: 'var(--ink-3)' }}>{user.bio}</p> : null}
            <p style={{ margin: '10px 0 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-3)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <Calendar size={12} />
              Joined {formatDate(user.createdAt)}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
            <Stat value={stats.totalFormulas} label="Formulas" tone="teal" />
            <Stat value={formatCount(stats.totalDownloads)} label="Downloads" tone="gold" />
            <Stat value={stats.avgRating || '—'} label="Avg Rating" tone="ink" icon={Star} />
          </div>
        </div>
      </div>

      <h2 style={{ margin: '0 0 14px', color: 'var(--ink)', fontSize: '1.5rem' }}>
        Published Formulas ({formulas.length})
      </h2>

      {formulas.length === 0 ? (
        <p style={{ color: 'var(--ink-3)' }}>No public formulas yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {formulas.map((formula) => (
            <ListingCard key={formula._id} listing={{ ...formula, itemType: 'formula' }} />
          ))}
        </div>
      )}
    </div>
  );
};

const Stat = ({ value, label, tone, icon: Icon }) => (
  <div style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--ivory-3)', background: 'white', textAlign: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.6rem', fontWeight: 700, color: tone === 'gold' ? 'var(--warning)' : tone === 'teal' ? 'var(--teal)' : 'var(--ink)' }}>
      {Icon ? <Icon size={18} color="var(--warning)" /> : null}
      {value}
    </div>
    <div style={{ marginTop: '6px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{label}</div>
  </div>
);

export default ProfilePage;
