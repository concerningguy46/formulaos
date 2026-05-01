import { useCallback, useEffect, useRef, useState } from 'react'
import { useBlocker, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Search } from 'lucide-react'
import SpreadsheetGrid from '../components/spreadsheet/SpreadsheetGrid'
import Toolbar from '../components/spreadsheet/Toolbar'
import FormulaBar from '../components/spreadsheet/FormulaBar'
import FormulaSearchBar from '../components/formula/FormulaSearchBar'
import SaveFormulaModal from '../components/formula/SaveFormulaModal'
import FormulaExplainer from '../components/formula/FormulaExplainer'
import AIGenerator from '../components/ai/AIGenerator'
import { writeFormulaToActiveCell } from '../utils/formulaActions'
import { createEmptyWorkbook } from '../utils/workbookTemplates'
import { downloadWorkbookDraft } from '../utils/workbookPersistence'
import { fileService } from '../services/fileService'

const FilePage = () => {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const workbookRef = useRef(null)
  const saveTimerRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [fileName, setFileName] = useState('Untitled File')
  const [workbookData, setWorkbookData] = useState(createEmptyWorkbook())
  const [loadedVersion, setLoadedVersion] = useState(0)
  const [saveStatus, setSaveStatus] = useState('saved')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [explainerOpen, setExplainerOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [currentFormula, setCurrentFormula] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  const handleSearch = useCallback((query = '') => {
    setSearchQuery(query)
    setSearchOpen(true)
  }, [])

  const handleSave = useCallback((formula) => {
    setCurrentFormula(formula)
    setSaveModalOpen(true)
  }, [])

  const handleExplain = useCallback((formula) => {
    setCurrentFormula(formula)
    setExplainerOpen(true)
  }, [])

  const handleAI = useCallback(() => {
    setAiPrompt('')
    setAiOpen(true)
  }, [])

  const handleAIFromSearch = useCallback((query) => {
    setAiPrompt(query)
    setAiOpen(true)
  }, [])

  const handleInsertFormula = useCallback((syntax) => {
    const result = writeFormulaToActiveCell(workbookRef, syntax)
    const toast = document.createElement('div')
    toast.textContent = result.ok
      ? 'Formula inserted into the active cell.'
      : result.error || 'Select an active cell first.'
    toast.style.cssText =
      'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:50;padding:12px 16px;border-radius:10px;background:white;border:1px solid var(--ivory-3);color:var(--ink);font-size:12px;box-shadow:0 20px 40px rgba(28,26,23,0.08);'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2500)
  }, [])

  const handleWorkbookChange = useCallback((data) => {
    setWorkbookData(data)
    setIsDirty(true)
    setSaveStatus('saving')
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }
    saveTimerRef.current = setTimeout(async () => {
      try {
        await fileService.saveFile(fileId, { name: fileName, data })
        setSaveStatus('saved')
        setIsDirty(false)
        setSaveError('')
      } catch (err) {
        setSaveStatus('error')
        setSaveError(err.response?.data?.message || 'Autosave failed')
      }
    }, 1000)
  }, [fileId, fileName])

  useEffect(() => {
    const loadFile = async () => {
      setLoading(true)
      setLoadError('')
      try {
        const file = await fileService.getFile(fileId)
        setFileName(file.fileName || 'Untitled File')
        setWorkbookData(Array.isArray(file.data) && file.data.length ? file.data : createEmptyWorkbook())
        setIsDirty(false)
        setLoadedVersion(v => v + 1)
      } catch (err) {
        setLoadError(err.response?.data?.message || 'File not found or inaccessible')
      } finally {
        setLoading(false)
      }
    }

    if (fileId) loadFile()

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [fileId])

  const blocker = useBlocker(isDirty)

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault()
        event.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleDownloadAndLeave = () => {
    downloadWorkbookDraft(workbookData || [])
    blocker.proceed?.()
  }

  const handleStayHere = () => {
    blocker.reset?.()
  }

  const handleImport = () => {}
  const handleExport = () => {}

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ color: 'var(--ink-3)' }}>Loading file...</div>
      </div>
    )
  }

  if (!loading && loadError) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '520px', width: '100%', border: '1px solid var(--ivory-3)', background: 'white', borderRadius: '18px', padding: '24px' }}>
          <h1 style={{ margin: 0, color: 'var(--ink)' }}>Can&apos;t open file</h1>
          <p style={{ margin: '10px 0 0', color: 'var(--ink-3)' }}>{loadError}</p>
          <button onClick={() => navigate('/editor')} style={{ marginTop: '18px', border: 'none', background: 'var(--teal)', color: 'white', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer' }}>
            Back to workspace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f7f4ef 0%, #fbfaf7 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderBottom: '1px solid var(--ivory-3)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 20 }}>
        <button onClick={() => navigate('/editor')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid var(--ivory-3)', borderRadius: '12px', background: 'white', padding: '10px 12px', cursor: 'pointer' }}>
          <ArrowLeft size={16} />
          Workspace
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            value={fileName}
            onChange={(e) => {
              const nextName = e.target.value
              setFileName(nextName)
              setIsDirty(true)
              setSaveStatus('saving')
              if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
              saveTimerRef.current = setTimeout(async () => {
                try {
                  await fileService.saveFile(fileId, { name: nextName, data: workbookData })
                  setSaveStatus('saved')
                  setIsDirty(false)
                } catch {
                  setSaveStatus('error')
                }
              }, 500)
            }}
            style={{ width: '100%', border: '1px solid var(--ivory-3)', borderRadius: '12px', background: 'white', padding: '10px 14px', color: 'var(--ink)', fontSize: '15px' }}
          />
        </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-3)', fontSize: '12px' }}>
          {saveStatus === 'saving' ? <Save size={14} /> : <Search size={14} />}
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save failed' : 'Saved'}
        </div>
      </div>

      {saveError ? (
        <div style={{ maxWidth: '1440px', margin: '12px auto 0', padding: '0 16px' }}>
          <div style={{ border: '1px solid rgba(225, 80, 80, 0.2)', background: 'rgba(225, 80, 80, 0.06)', color: 'var(--ink)', borderRadius: '12px', padding: '12px 14px' }}>
            {saveError}
          </div>
        </div>
      ) : null}

      <Toolbar workbookRef={workbookRef} saveStatus={saveStatus} onSearch={handleSearch} onImport={handleImport} onExport={handleExport} />
      <FormulaBar onSearch={handleSearch} onSave={handleSave} onExplain={handleExplain} onAI={handleAI} />

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '18px 16px 24px' }}>
        <SpreadsheetGrid
          key={`${fileId}-${loadedVersion}`}
          workbookRef={workbookRef}
          initialData={workbookData}
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
        onSave={() => {}}
        initialPrompt={aiPrompt}
      />

      {blocker.state === 'blocked' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'grid', placeItems: 'center', background: 'rgba(28,26,23,0.22)', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: 'min(92vw, 420px)', borderRadius: '18px', border: '1px solid var(--ivory-3)', background: 'white', padding: '22px', boxShadow: '0 30px 80px rgba(28,26,23,0.18)' }}>
            <h3 style={{ margin: 0, color: 'var(--ink)', fontSize: '1.2rem' }}>
              Download a copy before you leave?
            </h3>
            <p style={{ margin: '10px 0 0', color: 'var(--ink-3)', lineHeight: 1.6, fontSize: '14px' }}>
              Your file is autosaved to your private workspace. You can also export a copy to your computer.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '22px' }}>
              <button onClick={handleStayHere} style={{ border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink)', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer' }}>
                No, stay
              </button>
              <button onClick={handleDownloadAndLeave} style={{ border: 'none', background: 'var(--teal)', color: 'white', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer' }}>
                Yes, download and leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilePage
