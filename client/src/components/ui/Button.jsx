import { Loader2 } from 'lucide-react';

/**
 * Reusable button component with multiple variants.
 * Variants: primary, secondary, gold, danger, ghost
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const variantClasses = {
    primary: {
      background: 'var(--ink)',
      color: 'white',
      border: '1px solid var(--ink)',
    },
    secondary: {
      background: 'white',
      color: 'var(--ink)',
      border: '1px solid var(--ivory-3)',
    },
    gold: {
      background: 'var(--teal)',
      color: 'var(--ink)',
      border: '1px solid var(--teal)',
    },
    danger: {
      background: 'white',
      color: 'var(--danger)',
      border: '1px solid rgba(185, 74, 69, 0.28)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink-2)',
      border: '1px solid transparent',
    },
  };

  const sizeStyles = {
    sm: { padding: '10px 12px', fontSize: '11px' },
    md: { padding: '12px 18px', fontSize: '12px' },
    lg: { padding: '14px 22px', fontSize: '12px' },
  };

  return (
    <button
      className={className}
      style={{
        ...variantClasses[variant],
        ...sizeStyles[size],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        transition: 'transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease',
        boxShadow: 'none',
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
