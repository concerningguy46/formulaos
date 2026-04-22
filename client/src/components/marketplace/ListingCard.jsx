import { Link } from 'react-router-dom';
import { Download, Star, User } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatCurrency, formatCount } from '../../utils/formatters';

/**
 * Listing card for marketplace grid.
 * Glassmorphism design with preview info, no raw syntax for paid.
 */
const ListingCard = ({ listing }) => {
  const isPaid = listing.price > 0;
  const isPack = listing.itemType === 'pack';

  return (
    <Link
      to={`/marketplace/${listing._id}`}
      className="glass-card p-5 flex flex-col group cursor-pointer"
    >
      {/* Top row: type badge + price */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant={isPack ? 'gold' : 'teal'}>
          {isPack ? '📦 Pack' : '📐 Formula'}
        </Badge>
        <span className={`text-sm font-medium ${isPaid ? 'text-ink' : 'text-ink-2'}`}>
          {formatCurrency(listing.price)}
        </span>
      </div>

      {/* Name */}
      <h3 className="font-medium text-ink text-sm mb-1 group-hover:text-ink-2 transition-colors">
        {listing.name}
      </h3>

      {/* Description */}
      {listing.description && (
        <p className="text-xs text-ink-3 line-clamp-2 mb-3">{listing.description}</p>
      )}

      {/* Creator */}
      {listing.userId && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-ivory-2 flex items-center justify-center">
            <User size={10} className="text-ink-3" />
          </div>
          <span className="text-xs text-ink-3">{listing.userId.name || 'Anonymous'}</span>
        </div>
      )}

      {/* Tags */}
      {listing.tags && listing.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listing.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-[2px] bg-ivory-2 text-ink-2">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mt-auto pt-3 border-t border-ivory-3 text-xs text-ink-3">
        <span className="flex items-center gap-1">
          <Download size={12} />
          {formatCount(listing.downloadCount || 0)}
        </span>
        {listing.rating > 0 && (
          <span className="flex items-center gap-1">
            <Star size={12} className="text-teal" />
            {listing.rating.toFixed(1)}
          </span>
        )}
        {isPack && listing.formulaIds && (
          <span>{listing.formulaIds.length} formulas</span>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;
