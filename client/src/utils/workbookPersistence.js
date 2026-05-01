const WORKBOOK_DRAFT_KEY = 'formulaos.workbookDraft'

export const loadWorkbookDraft = () => {
  try {
    const raw = localStorage.getItem(WORKBOOK_DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export const saveWorkbookDraft = data => {
  try {
    localStorage.setItem(WORKBOOK_DRAFT_KEY, JSON.stringify(data || []))
    return true
  } catch {
    return false
  }
}

export const clearWorkbookDraft = () => {
  try {
    localStorage.removeItem(WORKBOOK_DRAFT_KEY)
  } catch {
    // Ignore storage failures.
  }
}

export const hasWorkbookContent = data => {
  return Array.isArray(data) && data.some(sheet => (sheet?.celldata || []).length > 0)
}

export const downloadWorkbookDraft = (data, filename = 'formulaos-workbook.json') => {
  const blob = new Blob([JSON.stringify(data || [], null, 2)], {
    type: 'application/json;charset=utf-8'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

