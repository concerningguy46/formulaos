import Badge from '../ui/Badge';
import { Pencil, Trash2, Upload, Hash, Clock } from 'lucide-react';
import { formatDate, formatCount } from '../../utils/formatters';

/**
 * Formula card — displays a formula in the library grid.
 * Shows name, description, syntax (collapsed), tags, usage count.
 */
const FormulaCard = ({ formula, onEdit, onDelete, onUpload, onInsert }) => {
  return (
    <div className="glass-card p-5 flex flex-col group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-ink text-sm truncate">{formula.name}</h3>
          {formula.description && (
            <p className="text-xs text-ink-3 mt-1 line-clamp-2">{formula.description}</p>
          )}
        </div>
        {formula.isPublic && (
          <Badge variant="teal" className="ml-2 flex-shrink-0">Public</Badge>
        )}
      </div>

      {/* Formula Syntax */}
      <div className="px-3 py-2 rounded-[4px] bg-ivory-2 border border-ivory-3 mb-3">
        <code className="text-xs text-ink font-mono break-all line-clamp-2">{formula.syntax}</code>
      </div>

      {/* Tags */}
      {formula.tags && formula.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {formula.tags.slice(0, 4).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          {formula.tags.length > 4 && (
            <Badge>+{formula.tags.length - 4}</Badge>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-ink-3 mt-auto pt-3 border-t border-ivory-3">
        <span className="flex items-center gap-1">
          <Hash size={12} />
          {formatCount(formula.usageCount || 0)} uses
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {formatDate(formula.createdAt)}
        </span>
      </div>

      {/* Actions (show on hover) */}
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-ivory-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onInsert?.(formula)}
          className="flex-1 py-1.5 rounded-[3px] text-[11px] uppercase tracking-[0.08em] text-ink-2 bg-transparent border border-ivory-3 hover:border-ink-3 transition-colors"
        >
          Insert
        </button>
        <button
          onClick={() => onEdit?.(formula)}
          className="p-1.5 rounded text-ink-3 hover:text-ink hover:bg-ivory-2 transition-colors"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onUpload?.(formula)}
          className="p-1.5 rounded text-ink-3 hover:text-teal transition-colors"
        >
          <Upload size={13} />
        </button>
        <button
          onClick={() => onDelete?.(formula)}
          className="p-1.5 rounded text-ink-3 hover:text-danger transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default FormulaCard;
