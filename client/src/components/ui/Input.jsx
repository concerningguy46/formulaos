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
    <div style={{ display: 'grid', gap: '6px' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
          }}
        >
          {label}
        </label>
      )}
      <input
        className={className}
        style={{
          width: '100%',
          padding: '13px 14px',
          borderRadius: '10px',
          border: `1px solid ${error ? 'rgba(185, 74, 69, 0.35)' : 'var(--ivory-3)'}`,
          background: 'white',
          color: 'var(--ink)',
          fontSize: '14px',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        {...props}
      />
      {error && (
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--danger)' }}>{error}</p>
      )}
    </div>
  );
};

export default Input;
