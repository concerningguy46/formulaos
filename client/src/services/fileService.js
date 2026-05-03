import api from './api'
import { createEmptyWorkbook } from '../utils/workbookTemplates'

const normalizeFile = file => {
  let data = file?.data
  
  // Validate data is a proper array of sheets with required fields
  if (Array.isArray(data) && data.length > 0) {
    // Check if sheets have proper structure (name, celldata/data, etc.)
    const hasValidSheet = data.some(sheet => 
      sheet && typeof sheet === 'object' && (sheet.name || sheet.celldata || sheet.data)
    )
    if (!hasValidSheet) {
      data = createEmptyWorkbook()
    }
  } else {
    data = createEmptyWorkbook()
  }
  
  return {
    ...file,
    fileId: file?._id || file?.fileId || '',
    fileName: file?.name || file?.fileName || 'Untitled File',
    data,
  }
}

export const fileService = {
  listFiles: async () => {
    const { data } = await api.get('/sheets')
    return Array.isArray(data?.data) ? data.data.map(normalizeFile) : []
  },

  getFile: async (fileId, signal) => {
    const { data } = await api.get(`/sheets/${fileId}`, { signal })
    return normalizeFile(data?.data)
  },

  createFile: async ({ name = 'Untitled File', data = createEmptyWorkbook() } = {}) => {
    const { data: response } = await api.post('/sheets/save', {
      name,
      data,
    })
    return normalizeFile(response?.data)
  },

  saveFile: async (fileId, payload = {}) => {
    const { data } = await api.post('/sheets/save', {
      sheetId: fileId,
      name: payload.name,
      data: payload.data,
    })
    return normalizeFile(data?.data)
  },

  deleteFile: async (fileId) => {
    await api.delete(`/sheets/${fileId}`)
  },
}

