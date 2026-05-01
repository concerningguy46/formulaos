export const getSheetFromWorkbookRef = workbookRef => {
  return workbookRef?.current?.getSheet?.() || window.fortunesheet?.[0] || null
}

export const getSelectionFromWorkbookRef = workbookRef => {
  const workbook = workbookRef?.current
  const selection = workbook?.getSelection?.()
  if (Array.isArray(selection) && selection.length) {
    return selection[0]
  }

  return getSheetFromWorkbookRef(workbookRef)?.luckysheet_select_save?.[0] || null
}

export const getActiveCellFromWorkbookRef = workbookRef => {
  const selection = getSelectionFromWorkbookRef(workbookRef)
  if (!selection) return null

  const row = selection.row_focus ?? selection.row?.[0]
  const column = selection.column_focus ?? selection.column?.[0]

  if (row == null || column == null) return null

  return { row, column }
}

export const writeFormulaToActiveCell = (workbookRef, formula) => {
  const workbook = workbookRef?.current
  const cell = getActiveCellFromWorkbookRef(workbookRef)
  const normalized = String(formula || '').trim()

  if (!workbook) {
    return { ok: false, error: 'Open a sheet first' }
  }

  if (!cell) {
    return { ok: false, error: 'Select an active cell first' }
  }

  if (!normalized) {
    return { ok: false, error: 'Formula is empty' }
  }

  const nextFormula = normalized.startsWith('=') ? normalized : `=${normalized}`

  try {
    workbook.setCellValue?.(cell.row, cell.column, { f: nextFormula })
    return { ok: true, cell, formula: nextFormula }
  } catch (firstError) {
    try {
      workbook.setCellValue?.(cell.row, cell.column, {
        f: nextFormula,
        ct: { fa: 'General', t: 'n' }
      })
      return { ok: true, cell, formula: nextFormula }
    } catch (secondError) {
      return {
        ok: false,
        error: secondError?.message || firstError?.message || 'Unable to write formula'
      }
    }
  }
}
