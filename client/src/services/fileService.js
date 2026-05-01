import api from './api'
import { createEmptyWorkbook } from '../utils/workbookTemplates'

const normalizeFile = file => ({
  ...file,
  fileId: file?._id || file?.fileId || '',
  fileName: file?.name || file?.fileName || 'Untitled File',
  data: Array.isArray(file?.data) && file.data.length ? file.data : createEmptyWorkbook(),
})

export const fileService = {
  listFiles: async () => {
    const { data } = await api.get('/sheets')
    return Array.isArray(data?.data) ? data.data.map(normalizeFile) : []
  },

  getFile: async (fileId) => {
    const { data } = await api.get(`/sheets/${fileId}`)
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

