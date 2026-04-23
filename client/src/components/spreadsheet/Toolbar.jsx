import { Bold, Italic, Palette, Type, Download, Upload } from 'lucide-react';

const Toolbar = ({ onImport, onExport }) => {
  const tabs = ['File', 'Home', 'Insert', 'Draw', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'];

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.94)',
        borderBottom: '1px solid var(--ivory-3)',
        boxShadow: '0 1px 0 rgba(28,26,23,0.02)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '10px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', overflowX: 'auto', paddingBottom: '2px' }}>
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              style={{
                position: 'relative',
                border: 0,
                background: 'transparent',
                color: index === 1 ? 'var(--ink)' : 'var(--ink-3)',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '8px 0',
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
              {index === 1 ? (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: '-1px',
                    height: '2px',
                    background: 'var(--teal)',
                    borderRadius: '999px',
                  }}
                />
              ) : null}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid var(--ivory-3)',
              borderRadius: '999px',
              background: 'white',
              padding: '8px 12px',
              fontSize: '11px',
              color: 'var(--ink-3)',
            }}
          >
            Saved
          </div>
          <ActionButton icon={Upload} label="Import" onClick={onImport} />
          <ActionButton icon={Download} label="Export" onClick={onExport} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '10px', marginLeft: '2px', borderLeft: '1px solid var(--ivory-3)' }}>
            <IconButton title="Bold" icon={Bold} />
            <IconButton title="Italic" icon={Italic} />
            <div style={{ width: '1px', height: '20px', background: 'var(--ivory-3)', margin: '0 6px' }} />
            <IconButton title="Font size" icon={Type} />
            <IconButton title="Cell color" icon={Palette} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '9px 12px',
      borderRadius: '8px',
      fontSize: '11px',
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      color: 'var(--ink-2)',
      border: '1px solid var(--ivory-3)',
      background: 'white',
    }}
  >
    <Icon size={13} />
    {label}
  </button>
);

const IconButton = ({ icon: Icon, title }) => (
  <button
    type="button"
    title={title}
    style={{
      width: '34px',
      height: '34px',
      display: 'grid',
      placeItems: 'center',
      borderRadius: '8px',
      color: 'var(--ink-3)',
      background: 'transparent',
      border: '1px solid transparent',
    }}
  >
    <Icon size={15} />
  </button>
);

export default Toolbar;
