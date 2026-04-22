/**
 * Badge component for tags and categories.
 */
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-ivory-2 text-ink-2 border-transparent',
    teal: 'bg-teal-bg text-teal-text border-transparent',
    gold: 'bg-ivory-2 text-ink-2 border-transparent',
    outline: 'bg-transparent text-ink-2 border-ivory-3',
    dark: 'bg-ink text-ivory border-transparent',
    danger: 'bg-transparent text-danger border-danger/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-[10px] font-medium tracking-[0.08em] uppercase border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
