import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilePlus2, FolderOpen, Home, Search, Clock3, MoreVertical, Trash2 } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { fileService } from '../services/fileService'
import { createEmptyWorkbook } from '../utils/workbookTemplates'

const sidebarItemStyle = active => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid transparent',
  background: active ? 'rgba(0,212,170,0.10)' : 'transparent',
  color: active ? 'var(--ink)' : 'var(--ink-3)',
  cursor: 'pointer',
  textAlign: 'left',
})

const WorkspacePage = () => {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadFiles = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const result = await fileService.listFiles()
        setFiles(result)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your files')
      } finally {
        setLoading(false)
      }
    }

    loadFiles()
  }, [token])

  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return files
    return files.filter(file =>
      String(file.fileName || '').toLowerCase().includes(query)
    )
  }, [files, search])

  const handleNewFile = async () => {
    setCreating(true)
    try {
      const file = await fileService.createFile({
        name: 'Untitled File',
        data: createEmptyWorkbook(),
      })
      navigate(`/file/${file.fileId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create a file')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (fileId) => {
    if (!window.confirm('Delete this file? This cannot be undone.')) return
    try {
      await fileService.deleteFile(fileId)
      setFiles(prev => prev.filter(file => file.fileId !== fileId))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete file')
    }
  }

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px' }}>
        <div style={{ maxWidth: '520px', width: '100%', border: '1px solid var(--ivory-3)', borderRadius: '20px', background: 'white', padding: '28px', boxShadow: '0 20px 50px rgba(28,26,23,0.08)' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--ink)' }}>Sign in to your workspace</h1>
          <p style={{ margin: '12px 0 0', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            Your files are private. Sign in to create, open, and autosave your own workspace.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{ marginTop: '20px', border: 'none', borderRadius: '12px', padding: '12px 16px', background: 'var(--teal)', color: 'white', cursor: 'pointer' }}
          >
            Go to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '260px 1fr', background: 'linear-gradient(180deg, #f7f4ef 0%, #fbfaf7 100%)' }}>
      <aside style={{ borderRight: '1px solid var(--ivory-3)', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg, #fff, #f7f4ef)', border: '1px solid var(--ivory-3)', fontFamily: '"Instrument Serif", serif' }}>
            FO
          </div>
          <div>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.1rem', color: 'var(--ink)' }}>FormulaOS</div>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              {user?.name || 'Workspace'}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '8px' }}>
          <button onClick={() => navigate('/editor')} style={sidebarItemStyle(true)}>
            <Home size={16} />
            Home
          </button>
          <button onClick={handleNewFile} style={sidebarItemStyle(false)}>
            <FilePlus2 size={16} />
            New
          </button>
          <button onClick={() => navigate('/editor')} style={sidebarItemStyle(false)}>
            <FolderOpen size={16} />
            Open
          </button>
        </div>

        <div style={{ marginTop: '24px', padding: '14px', borderRadius: '16px', border: '1px solid var(--ivory-3)', background: 'white' }}>
          <p style={{ margin: 0, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Private files</p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            Every file is tied to your user ID and loaded only for your account.
          </p>
        </div>
      </aside>

      <main style={{ padding: '28px', overflow: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Workspace</div>
              <h1 style={{ margin: '8px 0 0', fontSize: 'clamp(2rem, 4vw, 3.4rem)', color: 'var(--ink)', fontFamily: '"Instrument Serif", Georgia, serif', fontWeight: 400 }}>
                Your private files
              </h1>
              <p style={{ margin: '10px 0 0', color: 'var(--ink-3)', maxWidth: '760px', lineHeight: 1.6 }}>
                Create a new file, open any existing one, and keep everything private to your account.
              </p>
            </div>

            <button
              onClick={handleNewFile}
              disabled={creating}
              style={{
                border: 'none',
                borderRadius: '14px',
                padding: '12px 16px',
                background: 'var(--teal)',
                color: 'white',
                cursor: 'pointer',
                minWidth: '132px',
              }}
            >
              {creating ? 'Creating...' : 'New File'}
            </button>
          </div>

          <div style={{ position: 'relative', marginTop: '22px' }}>
            <Search size={18} color="var(--ink-3)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your files..."
              style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: '14px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink)', boxSizing: 'border-box' }}
            />
          </div>

          {error ? (
            <div style={{ marginTop: '16px', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(225, 80, 80, 0.2)', background: 'rgba(225, 80, 80, 0.06)', color: 'var(--ink)' }}>
              {error}
            </div>
          ) : null}

          <div style={{ marginTop: '26px', display: 'grid', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-3)', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              <Clock3 size={14} />
              Recent files
            </div>

            {loading ? (
              <div style={{ padding: '24px', border: '1px solid var(--ivory-3)', borderRadius: '16px', background: 'white', color: 'var(--ink-3)' }}>
                Loading your files...
              </div>
            ) : null}

            {!loading && filteredFiles.length === 0 ? (
              <div style={{ padding: '40px 24px', border: '1px solid var(--ivory-3)', borderRadius: '16px', background: 'white', textAlign: 'center', color: 'var(--ink-3)' }}>
                <p style={{ margin: 0, fontSize: '15px' }}>No files yet. Create your first private file.</p>
              </div>
            ) : null}

            {!loading && filteredFiles.map((file) => {
              const updatedAt = file.lastSavedAt || file.updatedAt || file.createdAt
              return (
                <div
                  key={file.fileId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    padding: '16px 18px',
                    borderRadius: '16px',
                    border: '1px solid var(--ivory-3)',
                    background: 'white',
                    boxShadow: '0 16px 36px rgba(28,26,23,0.04)',
                  }}
                >
                  <button
                    onClick={() => navigate(`/file/${file.fileId}`)}
                    style={{ flex: 1, textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{file.fileName}</div>
                    <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--ink-3)' }}>
                      Last modified: {updatedAt ? new Date(updatedAt).toLocaleString() : 'Just now'}
                    </div>
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/file/${file.fileId}`)}
                      style={{ border: '1px solid var(--ivory-3)', background: 'white', borderRadius: '10px', padding: '10px 12px', cursor: 'pointer' }}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(file.fileId)}
                      style={{ border: '1px solid var(--ivory-3)', background: 'white', borderRadius: '10px', padding: '10px', cursor: 'pointer' }}
                      aria-label={`Delete ${file.fileName}`}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      style={{ border: '1px solid var(--ivory-3)', background: 'white', borderRadius: '10px', padding: '10px', cursor: 'pointer' }}
                      aria-label="More actions"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default WorkspacePage

