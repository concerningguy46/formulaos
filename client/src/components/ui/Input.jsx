/**
 * Reusable input component with consistent styling.
 */
const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
          {label}
        </label>
      )}
      <input
        className={`input-base w-full ${error ? 'border-danger focus:border-danger focus:ring-danger/30' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
