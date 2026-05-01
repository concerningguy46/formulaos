import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useBlocker } from 'react-router-dom';
import SpreadsheetGrid from '../components/spreadsheet/SpreadsheetGrid';
import FormulaBar from '../components/spreadsheet/FormulaBar';
import Toolbar from '../components/spreadsheet/Toolbar';
import FormulaSearchBar from '../components/formula/FormulaSearchBar';
import SaveFormulaModal from '../components/formula/SaveFormulaModal';
import FormulaExplainer from '../components/formula/FormulaExplainer';
import AIGenerator from '../components/ai/AIGenerator';
import { writeFormulaToActiveCell } from '../utils/formulaActions';
import {
  downloadWorkbookDraft,
  hasWorkbookContent,
  loadWorkbookDraft,
  saveWorkbookDraft,
} from '../utils/workbookPersistence';

const EditorPage = () => {
  const workbookRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [currentFormula, setCurrentFormula] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [workbookData, setWorkbookData] = useState(() => loadWorkbookDraft());

  const handleSearch = useCallback((query = '') => {
    setSearchQuery(query);
    setSearchOpen(true);
  }, []);
  const handleSave = useCallback((formula) => {
    setCurrentFormula(formula);
    setSaveModalOpen(true);
  }, []);
  const handleExplain = useCallback((formula) => {
    setCurrentFormula(formula);
    setExplainerOpen(true);
  }, []);
  const handleAI = useCallback(() => {
    setAiPrompt('');
    setAiOpen(true);
  }, []);
  const handleAIFromSearch = useCallback((query) => {
    setAiPrompt(query);
    setAiOpen(true);
  }, []);
  const handleInsertFormula = useCallback((syntax) => {
    const result = writeFormulaToActiveCell(workbookRef, syntax);
    const toast = document.createElement('div');
    toast.textContent = result.ok
      ? 'Formula inserted into the active cell.'
      : result.error || 'Select an active cell first.';
    toast.style.cssText =
      'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:50;padding:12px 16px;border-radius:10px;background:white;border:1px solid var(--ivory-3);color:var(--ink);font-size:12px;box-shadow:0 20px 40px rgba(28,26,23,0.08);';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }, []);

  const handleWorkbookChange = useCallback((data) => {
    setWorkbookData(data);
    saveWorkbookDraft(data);
  }, []);

  const shouldBlockLeave = useMemo(() => hasWorkbookContent(workbookData), [workbookData]);
  const blocker = useBlocker(shouldBlockLeave);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasWorkbookContent(workbookData)) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [workbookData]);
  const handleAISave = useCallback((formula) => {
    setCurrentFormula(formula);
    setSaveModalOpen(true);
  }, []);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('Import file:', file.name);
      }
    };
    input.click();
  };

  const handleExport = () => {
    console.log('Export triggered');
  };

  const handleDownloadAndLeave = () => {
    downloadWorkbookDraft(workbookData || []);
    blocker.proceed?.();
  };

  const handleStayHere = () => {
    blocker.reset?.();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(0,212,170,0.08), transparent 28%), linear-gradient(180deg, #f7f4ef 0%, #fbfaf7 60%, #f7f4ef 100%)',
      }}
    >
<Toolbar workbookRef={workbookRef} saveStatus={undefined} onSearch={handleSearch} onImport={handleImport} onExport={handleExport} />
      <FormulaBar
        onSearch={handleSearch}
        onSave={handleSave}
        onExplain={handleExplain}
        onAI={handleAI}
      />

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '18px 16px 24px' }}>
<SpreadsheetGrid
  workbookRef={workbookRef}
  initialData={workbookData || undefined}
  onWorkbookChange={handleWorkbookChange}
/>
      </main>

      <FormulaSearchBar
        key={`${searchOpen}-${searchQuery}`}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onInsert={handleInsertFormula}
        onAIGenerate={handleAIFromSearch}
        initialQuery={searchQuery}
      />

      <SaveFormulaModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        formulaSyntax={currentFormula}
      />

      <FormulaExplainer
        isOpen={explainerOpen}
        onClose={() => setExplainerOpen(false)}
        formula={currentFormula}
      />

      <AIGenerator
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onInsert={handleInsertFormula}
        onSave={handleAISave}
        initialPrompt={aiPrompt}
      />

      {blocker.state === 'blocked' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(28,26,23,0.22)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              width: 'min(92vw, 420px)',
              borderRadius: '18px',
              border: '1px solid var(--ivory-3)',
              background: 'white',
              padding: '22px',
              boxShadow: '0 30px 80px rgba(28,26,23,0.18)',
            }}
          >
            <h3 style={{ margin: 0, color: 'var(--ink)', fontSize: '1.2rem' }}>
              Do you want to download your work?
            </h3>
            <p style={{ margin: '10px 0 0', color: 'var(--ink-3)', lineHeight: 1.6, fontSize: '14px' }}>
              Your spreadsheet is saved in the browser, and you can also download a copy before you leave.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '22px' }}>
              <button
                onClick={handleStayHere}
                style={{
                  border: '1px solid var(--ivory-3)',
                  background: 'white',
                  color: 'var(--ink)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                }}
              >
                No, stay
              </button>
              <button
                onClick={handleDownloadAndLeave}
                style={{
                  border: 'none',
                  background: 'var(--teal)',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                }}
              >
                Yes, download and leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;
