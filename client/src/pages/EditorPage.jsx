import { useState, useCallback } from 'react';
import SpreadsheetGrid from '../components/spreadsheet/SpreadsheetGrid';
import FormulaBar from '../components/spreadsheet/FormulaBar';
import Toolbar from '../components/spreadsheet/Toolbar';
import FormulaSearchBar from '../components/formula/FormulaSearchBar';
import SaveFormulaModal from '../components/formula/SaveFormulaModal';
import FormulaExplainer from '../components/formula/FormulaExplainer';
import AIGenerator from '../components/ai/AIGenerator';

/**
 * Editor page - main spreadsheet workspace.
 * Assembles grid, toolbar, formula bar, search, AI, and explainer.
 */
const EditorPage = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [currentFormula, setCurrentFormula] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const handleSearch = useCallback(() => {
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
      toast.className =
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-[3px] bg-white border border-ivory-3 text-ink text-xs font-medium shadow-sm animate-slideInUp';
      toast.textContent = 'Formula copied. Paste into the active cell.';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    });
  }, []);

  const handleAISave = useCallback((formula, name) => {
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
    <div className="flex flex-col min-h-screen bg-ivory">
      <Toolbar onImport={handleImport} onExport={handleExport} />

      <FormulaBar
        onSearch={handleSearch}
        onSave={handleSave}
        onExplain={handleExplain}
        onAI={handleAI}
      />

      <div className="flex-1 relative">
        <SpreadsheetGrid />
      </div>

      <FormulaSearchBar
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onInsert={handleInsertFormula}
        onAIGenerate={handleAIFromSearch}
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
