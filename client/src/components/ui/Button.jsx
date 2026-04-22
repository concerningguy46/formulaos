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
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    gold: 'btn-gold',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-[11px]',
    md: 'px-5 py-2.5 text-[12px]',
    lg: 'px-6 py-3 text-[12px]',
  };

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} inline-flex items-center justify-center gap-2 ${className}`}
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
