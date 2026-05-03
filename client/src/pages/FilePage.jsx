import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  const latestWorkbookDataRef = useRef(createEmptyWorkbook())
  const latestFileNameRef = useRef('Untitled File')
  const latestDataRef = useRef(null)
  const isDirtyRef = useRef(false)

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
    latestDataRef.current = data
    setWorkbookData(data)
    setIsDirty(true)
    setSaveStatus('saving')
    isDirtyRef.current = true
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (latestDataRef.current && fileId && isDirtyRef.current) {
        isDirtyRef.current = false
        console.log('AUTOSAVE FIRING — data:', latestDataRef.current)
        try {
          await fileService.saveFile(fileId, {
            name: latestFileNameRef.current,
            data: latestDataRef.current
          })
          console.log('AUTOSAVE SUCCESS')
          setSaveStatus('saved')
          setIsDirty(false)
          setSaveError('')
        } catch (e) {
          console.log('AUTOSAVE ERROR:', e.message)
          setSaveStatus('error')
          setSaveError(e.message)
        }
      } else {
        console.log('AUTOSAVE SKIPPED — latestDataRef:', !!latestDataRef.current, 'fileId:', fileId, 'isDirty:', isDirtyRef.current)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [fileId])

  useEffect(() => {
    const loadFile = async () => {
      setLoading(true)
      setLoadError('')
      try {
        const file = await fileService.getFile(fileId)
        const nextName = file.fileName || 'Untitled File'
        const nextData = file.data || createEmptyWorkbook()
        setFileName(nextName)
        latestFileNameRef.current = nextName
        setWorkbookData(nextData)
        latestDataRef.current = nextData
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
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        const pendingData = workbookRef.current?.getAllSheets?.() || latestDataRef.current || latestWorkbookDataRef.current
        const pendingName = latestFileNameRef.current
        ;(async () => {
          try {
            await fileService.saveFile(fileId, { name: pendingName, data: pendingData })
          } catch {
            // ignore cleanup save failures
          }
        })()
      }
    }
  }, [fileId])

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

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      try {
        const text = await file.text()
        let data
        try {
          data = JSON.parse(text)
        } catch (parseErr) {
          console.error('Import failed - Invalid JSON:', parseErr.message)
          setSaveError('Failed to import: Invalid JSON format. ' + parseErr.message)
          return
        }
        if (!Array.isArray(data)) {
          console.error('Import failed - Not an array')
          setSaveError('Failed to import: File must contain a JSON array')
          return
        }
        setWorkbookData(data)
        latestDataRef.current = data
        setLoadedVersion(prev => prev + 1)
        setIsDirty(true)
        setSaveStatus('saving')
        await fileService.saveFile(fileId, { name: latestFileNameRef.current, data })
        setSaveStatus('saved')
        setIsDirty(false)
        setSaveError('')
      } catch (err) {
        console.error('Import failed:', err.message)
        setSaveError('Failed to import file: ' + err.message)
      }
    }

    input.click()
  }

  const handleExport = () => {
    const dataToExport = workbookRef.current?.getAllSheets?.() || workbookData
    downloadWorkbookDraft(dataToExport, `${fileName || 'formulaos'}.json`)
  }

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
          <h1 style={{ margin: 0, color: 'var(--ink)' }}>Can't open file</h1>
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
              latestFileNameRef.current = nextName
              setIsDirty(true)
              setSaveStatus('saving')
              if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
              saveTimerRef.current = setTimeout(async () => {
                try {
                  const currentData = workbookRef.current?.getAllSheets?.() || latestDataRef.current
                  await fileService.saveFile(fileId, { name: nextName, data: currentData })
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
    </div>
  )
}

export default FilePage
