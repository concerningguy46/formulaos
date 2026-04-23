import { Search, Save, HelpCircle, Sparkles, ArrowUpRight } from 'lucide-react';
import useSpreadsheetStore from '../../store/spreadsheetStore';

const FormulaBar = ({ onSearch, onSave, onExplain, onAI }) => {
  const { selectedCell, selectedCellValue, selectedCellFormula, isSaving, lastSaved } =
    useSpreadsheetStore();

  const getCellRef = () => {
    if (!selectedCell) return 'A1';
    const col = String.fromCharCode(65 + (selectedCell.col || 0));
    const row = (selectedCell.row || 0) + 1;
    return `${col}${row}`;
  };

  const hasFormula = selectedCellFormula && selectedCellFormula.startsWith('=');
  const displayValue = hasFormula ? selectedCellFormula : selectedCellValue;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 16px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,244,239,0.95))',
        borderBottom: '1px solid var(--ivory-3)',
      }}
    >
      <div
        style={{
          minWidth: '64px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          background: 'var(--ivory-2)',
          border: '1px solid var(--ivory-3)',
          fontSize: '12px',
          fontFamily: 'monospace',
          fontWeight: 600,
          color: 'var(--ink-2)',
        }}
      >
        {getCellRef()}
      </div>

      <div
        style={{
          flex: '1 1 260px',
          minHeight: '34px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 14px',
          borderRadius: '10px',
          border: '1px solid var(--ivory-3)',
          background: 'white',
          color: 'var(--ink)',
          fontFamily: 'monospace',
          overflow: 'hidden',
        }}
      >
        <span style={{ color: 'var(--ink-2)', fontWeight: 700 }}>fx</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayValue || 'Empty cell'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <ActionButton icon={Search} label="Search" onClick={onSearch} />
        <ActionButton icon={Sparkles} label="AI" onClick={onAI} />
        {hasFormula ? <ActionButton icon={Save} label="Save" onClick={() => onSave(selectedCellFormula)} /> : null}
        {hasFormula ? (
          <ActionButton icon={HelpCircle} label="Explain" onClick={() => onExplain(selectedCellFormula)} />
        ) : null}
      </div>

      <div
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '8px',
          marginLeft: 'auto',
          padding: '8px 12px',
          borderRadius: '999px',
          border: '1px solid var(--ivory-3)',
          background: 'white',
          fontSize: '11px',
          color: 'var(--ink-3)',
        }}
      >
        {isSaving ? 'Saving...' : lastSaved ? 'Saved' : null}
        <ArrowUpRight size={12} />
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

export default FormulaBar;
