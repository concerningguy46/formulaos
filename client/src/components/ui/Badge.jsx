/**
 * Badge component for tags and categories.
 */
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: {
      background: 'var(--ivory-2)',
      color: 'var(--ink-2)',
      border: '1px solid transparent',
    },
    teal: {
      background: 'var(--teal-bg)',
      color: 'var(--teal-text)',
      border: '1px solid transparent',
    },
    gold: {
      background: 'var(--ivory-2)',
      color: 'var(--ink-2)',
      border: '1px solid transparent',
    },
    outline: {
      background: 'transparent',
      color: 'var(--ink-2)',
      border: '1px solid var(--ivory-3)',
    },
    dark: {
      background: 'var(--ink)',
      color: 'var(--ivory)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'transparent',
      color: 'var(--danger)',
      border: '1px solid rgba(185, 74, 69, 0.3)',
    },
  };

  return (
    <span
      className={className}
      style={{
        ...variants[variant],
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '2px',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
