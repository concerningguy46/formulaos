import { Bold, Italic, Palette, Type, Download, Upload } from 'lucide-react';

/**
 * Excel-inspired toolbar shell for spreadsheet formatting.
 * UI only - keeps the same handlers and shortcuts in place.
 */
const Toolbar = ({ onImport, onExport }) => {
  const tabs = ['File', 'Home', 'Insert', 'Draw', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'];

  return (
    <div className="bg-white border-b border-ivory-3 shadow-[0_1px_0_rgba(28,26,23,0.02)]">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center gap-5 overflow-x-auto pr-2">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`relative whitespace-nowrap pb-1 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                index === 1 ? 'text-ink' : 'text-ink-3 hover:text-ink'
              }`}
            >
              {tab}
              {index === 1 && <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-teal" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-ivory-3 bg-white px-3 py-1 text-[11px] text-ink-3">
            Saved
          </div>
          <button
            onClick={onImport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-[11px] uppercase tracking-[0.08em] text-ink-2 bg-transparent border border-ivory-3 hover:border-ink-3 transition-colors"
          >
            <Upload size={13} />
            Import
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-[11px] uppercase tracking-[0.08em] text-ink-2 bg-transparent border border-ivory-3 hover:border-ink-3 transition-colors"
          >
            <Download size={13} />
            Export
          </button>
          <div className="hidden xl:flex items-center gap-2 border-l border-ivory-3 pl-3 ml-1">
            <button className="p-2 rounded text-ink-3 hover:text-ink hover:bg-ivory-2 transition-colors" title="Bold">
              <Bold size={15} />
            </button>
            <button className="p-2 rounded text-ink-3 hover:text-ink hover:bg-ivory-2 transition-colors" title="Italic">
              <Italic size={15} />
            </button>
            <div className="w-px h-5 bg-ivory-3 mx-1" />
            <button className="p-2 rounded text-ink-3 hover:text-ink hover:bg-ivory-2 transition-colors" title="Font size">
              <Type size={15} />
            </button>
            <button className="p-2 rounded text-ink-3 hover:text-ink hover:bg-ivory-2 transition-colors" title="Cell color">
              <Palette size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
