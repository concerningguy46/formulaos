import { Search, Save, HelpCircle, Sparkles, ArrowUpRight } from 'lucide-react';
import useSpreadsheetStore from '../../store/spreadsheetStore';

/**
 * Custom formula bar overlay — Shows cell reference, formula content,
 * and action buttons (Save, Explain, Search, AI).
 */
const FormulaBar = ({ onSearch, onSave, onExplain, onAI }) => {
  const { selectedCell, selectedCellValue, selectedCellFormula, isSaving, lastSaved } =
    useSpreadsheetStore();

  /** Get cell reference label like "A1", "B3" */
  const getCellRef = () => {
    if (!selectedCell) return 'A1';
    const col = String.fromCharCode(65 + (selectedCell.col || 0));
    const row = (selectedCell.row || 0) + 1;
    return `${col}${row}`;
  };

  const hasFormula = selectedCellFormula && selectedCellFormula.startsWith('=');
  const displayValue = hasFormula ? selectedCellFormula : selectedCellValue;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white border-b border-ivory-3">
      {/* Cell Reference */}
      <div className="flex items-center justify-center w-14 h-7 rounded-[4px] bg-ivory-2 border border-ivory-3 text-xs font-mono text-ink-2 font-medium">
        {getCellRef()}
      </div>

      {/* Formula / Value Display */}
      <div className="flex-1 min-w-[220px] flex items-center gap-2 h-7 px-3 rounded-[4px] bg-white border border-ivory-3 text-sm text-ink font-mono overflow-hidden">
        {hasFormula && <span className="text-ink-2 font-bold">fx</span>}
        <span className="truncate">{displayValue || 'Empty cell'}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* Search */}
        <button
          onClick={onSearch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-teal transition-all border border-transparent hover:border-ivory-3"
          title="Search formulas"
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search</span>
        </button>

        {/* AI Generate */}
        <button
          onClick={onAI}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-teal transition-all border border-transparent hover:border-ivory-3"
          title="Generate with AI"
        >
          <Sparkles size={16} />
          <span className="hidden sm:inline">AI</span>
        </button>

        {/* Save Formula (show when cell has formula) */}
        {hasFormula && (
          <button
            onClick={() => onSave(selectedCellFormula)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] text-[11px] uppercase tracking-[0.08em] text-ink-2 bg-white hover:border-ivory-3 transition-all border border-ivory-3"
          >
            <Save size={14} />
            Save
          </button>
        )}

        {/* Explain Formula (show when cell has formula) */}
        {hasFormula && (
          <button
            onClick={() => onExplain(selectedCellFormula)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] text-[11px] uppercase tracking-[0.08em] text-ink-2 bg-white hover:border-ivory-3 transition-all border border-ivory-3"
          >
            <HelpCircle size={14} />
            Explain
          </button>
        )}
      </div>

      {/* Auto-save Status */}
      <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-ivory-3 bg-white px-3 py-1.5 text-[11px] text-ink-3">
        {isSaving ? (
          <span className="flex items-center gap-1">
            Saving...
          </span>
        ) : lastSaved ? (
          <span>Saved</span>
        ) : null}
        <ArrowUpRight size={12} className="text-ink-3" />
      </div>
    </div>
  );
};

export default FormulaBar;
