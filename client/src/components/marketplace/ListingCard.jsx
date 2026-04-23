import { Link } from 'react-router-dom';
import { Download, Star, User } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatCurrency, formatCount } from '../../utils/formatters';

const ListingCard = ({ listing }) => {
  const isPaid = listing.price > 0;
  const isPack = listing.itemType === 'pack';

  return (
    <Link
      to={`/marketplace/${listing._id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid var(--ivory-3)',
        background: 'rgba(255,255,255,0.96)',
        boxShadow: '0 20px 50px rgba(28, 26, 23, 0.06)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <Badge variant={isPack ? 'gold' : 'teal'}>{isPack ? 'Pack' : 'Formula'}</Badge>
        <span style={{ fontSize: '14px', fontWeight: 600, color: isPaid ? 'var(--ink)' : 'var(--ink-2)' }}>
          {formatCurrency(listing.price)}
        </span>
      </div>

      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{listing.name}</h3>

      {listing.description ? (
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-3)' }}>
          {listing.description}
        </p>
      ) : null}

      {listing.userId ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '999px', background: 'var(--ivory-2)', display: 'grid', placeItems: 'center' }}>
            <User size={10} color="var(--ink-3)" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{listing.userId.name || 'Anonymous'}</span>
        </div>
      ) : null}

      {listing.tags?.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {listing.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                padding: '4px 8px',
                borderRadius: '999px',
                background: 'var(--ivory-2)',
                color: 'var(--ink-2)',
                fontSize: '10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--ivory-3)', fontSize: '12px', color: 'var(--ink-3)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={12} color="var(--ink-3)" />
          {formatCount(listing.downloadCount || 0)}
        </span>
        {listing.rating > 0 ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={12} color="var(--teal-text)" />
            {listing.rating.toFixed(1)}
          </span>
        ) : null}
        {isPack && listing.formulaIds ? <span>{listing.formulaIds.length} formulas</span> : null}
      </div>
    </Link>
  );
};

export default ListingCard;
