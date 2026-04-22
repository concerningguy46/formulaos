import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, Download, Star, Calendar } from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/marketplace/ListingCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatCount, formatDate } from '../utils/formatters';

/**
 * Creator profile page — public profile with listings and stats.
 */
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-navy-200">User not found</h2>
      </div>
    );
  }

  const { user, formulas, packs, stats } = profile;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      {/* Profile Header */}
      <div className="glass-card-static p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal/20 to-gold/20 flex items-center justify-center flex-shrink-0">
            <User size={32} className="text-navy-300" />
          </div>

          {/* Info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-navy-100">{user.name}</h1>
            {user.bio && <p className="text-navy-400 mt-1">{user.bio}</p>}
            <p className="text-xs text-navy-500 mt-2 flex items-center gap-1 justify-center sm:justify-start">
              <Calendar size={12} />
              Joined {formatDate(user.createdAt)}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-teal">{stats.totalFormulas}</div>
              <div className="text-xs text-navy-400">Formulas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">{formatCount(stats.totalDownloads)}</div>
              <div className="text-xs text-navy-400">Downloads</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-navy-200 flex items-center gap-1 justify-center">
                <Star size={16} className="text-gold" />
                {stats.avgRating || '—'}
              </div>
              <div className="text-xs text-navy-400">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <h2 className="text-lg font-semibold text-navy-100 mb-4">
        Published Formulas ({formulas.length})
      </h2>

      {formulas.length === 0 ? (
        <p className="text-navy-500 text-sm">No public formulas yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {formulas.map((formula) => (
            <ListingCard
              key={formula._id}
              listing={{ ...formula, itemType: 'formula' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
