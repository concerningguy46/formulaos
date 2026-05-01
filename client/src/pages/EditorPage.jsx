import { useCallback, useState, useRef } from 'react';
import SpreadsheetGrid from '../components/spreadsheet/SpreadsheetGrid';
import FormulaBar from '../components/spreadsheet/FormulaBar';
import Toolbar from '../components/spreadsheet/Toolbar';
import FormulaSearchBar from '../components/formula/FormulaSearchBar';
import SaveFormulaModal from '../components/formula/SaveFormulaModal';
import FormulaExplainer from '../components/formula/FormulaExplainer';
import AIGenerator from '../components/ai/AIGenerator';

const EditorPage = () => {
  const workbookRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [currentFormula, setCurrentFormula] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
    navigator.clipboard.writeText(syntax).then(() => {
      const toast = document.createElement('div');
      toast.textContent = 'Formula copied. Paste into the active cell.';
      toast.style.cssText =
        'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:50;padding:12px 16px;border-radius:10px;background:white;border:1px solid var(--ivory-3);color:var(--ink);font-size:12px;box-shadow:0 20px 40px rgba(28,26,23,0.08);';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    });
  }, []);
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

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(0,212,170,0.08), transparent 28%), linear-gradient(180deg, #f7f4ef 0%, #fbfaf7 60%, #f7f4ef 100%)',
      }}
    >
<Toolbar workbookRef={workbookRef} onImport={handleImport} onExport={handleExport} />
      <FormulaBar
        onSearch={handleSearch}
        onSave={handleSave}
        onExplain={handleExplain}
        onAI={handleAI}
      />

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '18px 16px 24px' }}>
<SpreadsheetGrid workbookRef={workbookRef} />
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
    </div>
  );
};

export default EditorPage;
