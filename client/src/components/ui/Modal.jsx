import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Modal dialog component with backdrop blur and slide-in animation.
 * Closes on Escape key or backdrop click.
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 420,
    md: 560,
    lg: 760,
    xl: 960,
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'grid',
        placeItems: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(28,26,23,0.18)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div
        ref={modalRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: `${sizeClasses[size]}px`,
          border: '1px solid var(--ivory-3)',
          borderRadius: '18px',
          background: 'rgba(255,255,255,0.98)',
          boxShadow: '0 30px 80px rgba(28, 26, 23, 0.12)',
          padding: '24px',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--ink)' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '10px',
              border: '1px solid var(--ivory-3)',
              background: 'white',
              color: 'var(--ink-3)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
