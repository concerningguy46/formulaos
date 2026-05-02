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
import api from '../services/api';

const EditorPage = () => {
  const { id } = useParams();
  const workbookRef = useRef(null);
  const saveTimerRef = useRef(null);
  const sheetsDataRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [fileName, setFileName] = useState('Untitled Sheet');
  const [loadedVersion, setLoadedVersion] = useState(0);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [searchOpen, setSearchOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [currentFormula, setCurrentFormula] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sheets, setSheets] = useState([{
    name: 'Sheet1',
    id: 'sheet1',
    celldata: [],
    row: 100,
    column: 26,
    status: 1
  }]);

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

  const handleChange = (data) => {
    sheetsDataRef.current = data
    setSaveStatus('saving')
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveSheet(data)
    }, 3000)
  }

  const saveSheet = async (data) => {
    try {
      if (!id || !data) return
      await api.put('/sheets/' + id, {
        data: data,
        updatedAt: new Date()
      })
      setSaveStatus('saved')
    } catch (err) {
      console.error('Save failed:', err)
      setSaveStatus('error')
    }
  }

  // Load sheet data when page opens
  useEffect(() => {
    const loadSheet = async () => {
      try {
        if (!id) return
        const response = await api.get('/sheets/' + id)
        const sheet = response.data
        setFileName(sheet.name || 'Untitled Sheet')
        if (sheet.data && sheet.data.length > 0) {
          setSheets(sheet.data)
        } else {
          setSheets([{
            name: sheet.name || 'Sheet1',
            id: 'sheet1',
            celldata: [],
            row: 100,
            column: 26,
            status: 1
          }])
        }
      } catch (err) {
        console.error('Load failed:', err)
      }
    }
    loadSheet()
  }, [id])

  // Save before user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sheetsDataRef.current && id) {
        navigator.sendBeacon(
          '/api/sheets/' + id,
          JSON.stringify({ data: sheetsDataRef.current })
        )
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [id])

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
    downloadWorkbookDraft(sheets);
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

      <Toolbar 
        workbookRef={workbookRef}
        saveStatus={saveStatus}
        onSearch={handleSearch}
        onImport={handleImport}
        onExport={handleExport}
      />
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
          initialData={sheets}
          onWorkbookChange={handleChange}
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
