import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
import { createEmptyWorkbook } from '../utils/workbookTemplates';
import { fileService } from '../services/fileService';

const EditorPage = () => {
  const { id } = useParams();
  const workbookRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [fileName, setFileName] = useState('Untitled Sheet');
  const [loadedVersion, setLoadedVersion] = useState(0);
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

  // Load sheet data from backend when ID is provided
  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;

    const loadSheet = async () => {
      if (!id) return;

      setLoading(true);
      setLoadError('');
      try {
        const file = await fileService.getFile(id, controller.signal);
        if (!isCurrent) return;

        setFileName(file.fileName || 'Untitled Sheet');
        setWorkbookData(Array.isArray(file.data) && file.data.length ? file.data : createEmptyWorkbook());
        setLoadedVersion((v) => v + 1);
      } catch (err) {
        if (!isCurrent) return;
        const isAbortError = err.name === 'CanceledError' || err.name === 'AbortError' || err.code === 'ERR_CANCELED';
        if (!isAbortError) {
          setLoadError(err.response?.data?.message || 'Could not load sheet');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    loadSheet();

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [id]);

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
  };

  const handleStayHere = () => {
    // no-op when navigation blocking is unavailable
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(0,212,170,0.08), transparent 28%), linear-gradient(180deg, #f7f4ef 0%, #fbfaf7 60%, #f7f4ef 100%)',
      }}
    >
      <div
        style={{
          padding: '18px 16px 0',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--ink)' }}>{fileName}</h1>
          {loadedVersion > 0 && (
            <p style={{ margin: '6px 0 0', color: 'var(--ink-4)', fontSize: '13px' }}>
              Loaded version {loadedVersion}
            </p>
          )}
        </div>
        {loading && (
          <div style={{ color: 'var(--teal)', fontWeight: 600 }}>Loading sheet…</div>
        )}
      </div>

      <Toolbar workbookRef={workbookRef} saveStatus={undefined} onSearch={handleSearch} onImport={handleImport} onExport={handleExport} />
      <FormulaBar
        onSearch={handleSearch}
        onSave={handleSave}
        onExplain={handleExplain}
        onAI={handleAI}
      />

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '18px 16px 24px' }}>
        {loadError ? (
          <div
            style={{
              marginBottom: '18px',
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255,146,146,0.14)',
              color: '#7A1F1F',
              border: '1px solid rgba(255,146,146,0.28)',
            }}
          >
            {loadError}
          </div>
        ) : null}
        <SpreadsheetGrid
          key={loadedVersion}
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
    </div>
  );
};

export default EditorPage;
