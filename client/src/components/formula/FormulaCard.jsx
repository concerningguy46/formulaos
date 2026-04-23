import Badge from '../ui/Badge';
import { Pencil, Trash2, Upload, Hash, Clock } from 'lucide-react';
import { formatDate, formatCount } from '../../utils/formatters';

const FormulaCard = ({ formula, onEdit, onDelete, onUpload, onInsert }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid var(--ivory-3)',
        background: 'rgba(255,255,255,0.96)',
        boxShadow: '0 20px 50px rgba(28, 26, 23, 0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {formula.name}
          </h3>
          {formula.description ? <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.5 }}>{formula.description}</p> : null}
        </div>
        {formula.isPublic ? <Badge variant="teal">Public</Badge> : null}
      </div>

      <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--ivory-2)', border: '1px solid var(--ivory-3)' }}>
        <code style={{ fontSize: '12px', color: 'var(--ink)', fontFamily: 'monospace', wordBreak: 'break-word' }}>{formula.syntax}</code>
      </div>

      {formula.tags?.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {formula.tags.slice(0, 4).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          {formula.tags.length > 4 ? <Badge>+{formula.tags.length - 4}</Badge> : null}
        </div>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--ivory-3)', fontSize: '12px', color: 'var(--ink-3)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Hash size={12} color="var(--ink-3)" />
          {formatCount(formula.usageCount || 0)} uses
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={12} color="var(--ink-3)" />
          {formatDate(formula.createdAt)}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '14px', borderTop: '1px solid var(--ivory-3)' }}>
        <button
          onClick={() => onInsert?.(formula)}
          style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink-2)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          Insert
        </button>
        <button onClick={() => onEdit?.(formula)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink-3)' }}>
          <Pencil size={13} />
        </button>
        <button onClick={() => onUpload?.(formula)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink-3)' }}>
          <Upload size={13} />
        </button>
        <button onClick={() => onDelete?.(formula)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--danger)' }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default FormulaCard;
