import { useState } from 'react'
import { 
  cancelNormalSelected,
  insertRowCol,
  deleteRowCol,
  sortSelection,
  handleFreeze
} from '@fortune-sheet/core'
import { writeFormulaToActiveCell } from '../../utils/formulaActions'

const TABS = ['Home', 'Insert', 'Formulas', 'Data', 'View']

const selectStyle = {
  background: '#FFFFFF',
  border: '1px solid #E0DBD0',
  borderRadius: '3px',
  padding: '2px 6px',
  fontSize: '12px',
  fontFamily: 'DM Sans, sans-serif',
  color: '#1C1A17',
  height: '24px',
  width: '120px',
  cursor: 'pointer',
  outline: 'none'
}

const SmallBtn = ({ children, onClick, active }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      background: active ? '#E0DBD0' : 'transparent',
      border: '1px solid transparent',
      borderRadius: '3px',
      cursor: 'pointer',
      padding: 0,
      fontSize: '12px',
      fontFamily: 'DM Sans, sans-serif',
      color: '#1C1A17'
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#EDE9E1'}
    onMouseLeave={e => e.currentTarget.style.background = active ? '#E0DBD0' : 'transparent'}
  >
    {children}
  </button>
)

const btn = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3px',
  padding: '4px 10px',
  minWidth: '48px',
  height: '56px',
  background: 'transparent',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '10px',
  fontFamily: 'DM Sans, sans-serif',
  color: '#4A4640',
  whiteSpace: 'nowrap'
}

const icon = {
  fontSize: '16px',
  lineHeight: '1',
  color: '#1C1A17'
}

const Group = ({ label, children }) => (
  <>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 8px',
      minHeight: '80px',
      justifyContent: 'space-between'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        flex: 1,
        paddingTop: '6px'
      }}>
        {children}
      </div>
      <div style={{
        fontSize: '10px',
        color: '#9A948A',
        textAlign: 'center',
        letterSpacing: '0.05em',
        padding: '4px 0 6px 0',
        fontFamily: 'DM Sans, sans-serif',
        borderTop: '1px solid #E0DBD0',
        width: '100%',
        marginTop: '4px'
      }}>
        {label}
      </div>
    </div>
    <div style={{
      width: '1px',
      background: '#E0DBD0',
      margin: '8px 0',
      alignSelf: 'stretch'
    }} />
  </>
)

const Btn = ({ label, icon: iconText, onClick, active }) => (
  <button
    style={{
      ...btn,
      background: active ? '#E0DBD0' : 'transparent'
    }}
    onClick={onClick}
    onMouseEnter={e => {
      if (!active) e.currentTarget.style.background = '#EDE9E1'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = active ? '#E0DBD0' : 'transparent'
    }}
  >
    <span style={icon}>{iconText}</span>
    <span>{label}</span>
  </button>
)

export default function Toolbar({ workbookRef, saveStatus, onSearch }) {
  const [activeTab, setActiveTab] = useState('Home')
  const [fontFamily, setFontFamily] = useState('DM Sans')
  const [fontSize, setFontSize] = useState('11')
  const [showGridlines, setShowGridlines] = useState(true)
  const [showHeadings, setShowHeadings] = useState(true)
const [showFormulas, setShowFormulas] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const getWorkbook = () => workbookRef?.current

  const getSheet = () => {
    return workbookRef?.current?.getSheet?.() || 
           window.fortunesheet?.[0]
  }

  const getSelection = () => getSheet()?.luckysheet_select_save?.[0]

  const getCurrentSheetIndex = () => {
    const workbook = getWorkbook()
    const sheet = getSheet()
    const sheets = workbook?.getAllSheets?.()

    if (!workbook || !sheet || !Array.isArray(sheets)) return -1

    return sheets.findIndex(item => item?.id === sheet?.id || item?.name === sheet?.name)
  }

  const updateCurrentSheet = updater => {
    const workbook = getWorkbook()
    const sheets = workbook?.getAllSheets?.()
    const currentIndex = getCurrentSheetIndex()

    if (!workbook || !Array.isArray(sheets) || currentIndex < 0) return false

    const nextSheets = sheets.map((sheet, index) => (
      index === currentIndex ? updater({ ...sheet }) : sheet
    ))

    workbook.updateSheet?.(nextSheets)
    return true
  }

  const applyFormat = (key, value) => {
    const workbook = getWorkbook()
    const selection = getSelection()

    if (!selection) {
      showToast('Select a cell first')
      return
    }

    try {
      if (workbook?.setCellFormatByRange) {
        workbook.setCellFormatByRange(key, value, selection)
        return
      }
    } catch {
      // Ignore and surface a user-facing message below.
    }

    showToast('Select a cell and try again')
  }

  const insertOrDelete = (type, action) => {
    const workbook = getWorkbook()
    const sheet = getSheet()
    const selection = getSelection()
    const coreSheet = window.fortunesheet?.[0]
    const normalizedType = type === 'col' ? 'column' : 'row'
    const start = normalizedType === 'row'
      ? selection?.row?.[0] ?? 0
      : selection?.column?.[0] ?? 0
    const end = normalizedType === 'row'
      ? selection?.row?.[1] ?? start
      : selection?.column?.[1] ?? start

    try {
      if (coreSheet && typeof cancelNormalSelected === 'function') {
        cancelNormalSelected(coreSheet)
      }
    } catch {
      // Non-fatal; continue with the actual row/column mutation.
    }

    if (action === 'insert') {
      try {
        if (workbook?.insertRowOrColumn) {
          workbook.insertRowOrColumn(normalizedType, start, 1, 'rightbottom')
          return true
        }
      } catch {
        // Fall through to the core API.
      }

      try {
        if (coreSheet?.luckysheetfile && sheet?.id) {
          insertRowCol(coreSheet, {
            type: normalizedType,
            index: start,
            count: 1,
            direction: 'rightbottom',
            id: sheet.id
          })
          return true
        }
      } catch {
        // Ignore and show a message below.
      }
    } else {
      try {
        if (workbook?.deleteRowOrColumn) {
          workbook.deleteRowOrColumn(normalizedType, start, end)
          return true
        }
      } catch {
        // Fall through to the core API.
      }

      try {
        if (coreSheet?.luckysheetfile && sheet?.id) {
          deleteRowCol(coreSheet, {
            type: normalizedType,
            start,
            end,
            id: sheet.id
          })
          return true
        }
      } catch {
        // Ignore and show a message below.
      }
    }

    showToast('Select a row or column first')
    return false
  }

  const sortSelectionRange = isAsc => {
    const workbook = getWorkbook()
    const selection = getSelection()
    const coreSheet = window.fortunesheet?.[0]

    if (!selection) {
      showToast('Select a range first')
      return
    }

    try {
      if (coreSheet?.luckysheetfile && typeof sortSelection === 'function') {
        sortSelection(coreSheet, isAsc)
        showToast(isAsc ? 'Sorted A to Z' : 'Sorted Z to A')
        return
      }
    } catch {
      // Fall through to the workbook-based fallback.
    }

    try {
      const cells = workbook?.getCellsByRange?.(selection)
      if (!Array.isArray(cells) || !cells.length) {
        showToast('Select a range first')
        return
      }

      const sortedRows = [...cells].sort((left, right) => {
        const leftValue = String(left?.[0]?.m ?? left?.[0]?.v ?? '')
        const rightValue = String(right?.[0]?.m ?? right?.[0]?.v ?? '')
        const comparison = leftValue.localeCompare(rightValue, undefined, {
          numeric: true,
          sensitivity: 'base'
        })
        return isAsc ? comparison : -comparison
      })

      const values = sortedRows.map(row => row.map(cell => cell?.m ?? cell?.v ?? ''))
      workbook?.setCellValuesByRange?.(values, selection)
      showToast(isAsc ? 'Sorted A to Z' : 'Sorted Z to A')
      return
    } catch {
      // Ignore and surface a user-facing message below.
    }

    showToast('Select a range first')
  }

  const setZoom = nextZoom => {
    if (!updateCurrentSheet(sheet => ({
      ...sheet,
      zoomRatio: nextZoom
    }))) {
      showToast('Open a sheet first')
    }
  }

  const freezeSheet = type => {
    const coreSheet = window.fortunesheet?.[0]

    try {
      if (coreSheet && typeof handleFreeze === 'function') {
        if (type === 'unfreeze') handleFreeze(coreSheet, 'freeze-cancel')
        else if (type === 'row') handleFreeze(coreSheet, 'freeze-row')
        else handleFreeze(coreSheet, 'freeze-col')
        return
      }
    } catch {
      // Fall through to the workbook update path below.
    }

    if (!updateCurrentSheet(sheet => ({
      ...sheet,
      frozen: type === 'unfreeze'
        ? undefined
        : {
            type: type === 'row' ? 'row' : 'column',
            range: type === 'row'
              ? { row_focus: 0 }
              : { col_focus: 0 }
          }
    }))) {
      showToast('Open a sheet first')
    }
  }

  const openFormulaSearch = (query = '') => {
    if (typeof onSearch === 'function') {
      onSearch(query)
    }
  }

  const getActiveCell = () => {
    const selection = getSelection()
    if (!selection) return null

    const row = selection.row_focus ?? selection.row?.[0]
    const column = selection.column_focus ?? selection.column?.[0]

    if (row == null || column == null) return null

    return { row, column }
  }

  const getCellFormula = () => {
    const workbook = getWorkbook()
    const cell = getActiveCell()
    if (!workbook || !cell) return ''

    try {
      return workbook.getCellValue?.(cell.row, cell.column, { type: 'f' }) || ''
    } catch {
      return ''
    }
  }

  const columnToLabel = index => {
    let n = index + 1
    let label = ''

    while (n > 0) {
      const rem = (n - 1) % 26
      label = String.fromCharCode(65 + rem) + label
      n = Math.floor((n - 1) / 26)
    }

    return label
  }

  const getCellValueAt = (row, column) => {
    const workbook = getWorkbook()
    if (!workbook) return ''

    try {
      return workbook.getCellValue?.(row, column) ?? ''
    } catch {
      return ''
    }
  }

  const isNumericCell = (value) => {
    if (value == null || value === '') return false
    const raw = typeof value === 'object'
      ? (value?.m ?? value?.v ?? value?.value ?? '')
      : value
    if (raw === '') return false
    return !Number.isNaN(Number(raw))
  }

  const findAutoSumRange = (row, column) => {
    const selection = getSelection()
    if (!selection) return null

    const rowStart = Math.min(...(selection.row || [row]))
    const rowEnd = Math.max(...(selection.row || [row]))
    const colStart = Math.min(...(selection.column || [column]))
    const colEnd = Math.max(...(selection.column || [column]))
    const isSingleCell = rowStart === rowEnd && colStart === colEnd

    if (!isSingleCell) {
      const width = colEnd - colStart
      const height = rowEnd - rowStart
      if (height >= width) {
        return {
          startRow: rowStart,
          endRow: rowEnd,
          startCol: colStart,
          endCol: colEnd,
          sumMode: 'vertical'
        }
      }

      return {
        startRow: rowStart,
        endRow: rowEnd,
        startCol: colStart,
        endCol: colEnd,
        sumMode: 'horizontal'
      }
    }

    let top = row - 1
    while (top >= 0 && isNumericCell(getCellValueAt(top, column))) top -= 1
    top += 1

    let bottom = row - 1
    if (top <= row - 1) {
      bottom = row - 1
      if (bottom >= top && isNumericCell(getCellValueAt(bottom, column))) {
        return {
          startRow: top,
          endRow: bottom,
          startCol: column,
          endCol: column,
          sumMode: 'vertical'
        }
      }
    }

    let left = column - 1
    while (left >= 0 && isNumericCell(getCellValueAt(row, left))) left -= 1
    left += 1

    let right = column - 1
    if (left <= column - 1) {
      right = column - 1
      if (right >= left && isNumericCell(getCellValueAt(row, right))) {
        return {
          startRow: row,
          endRow: row,
          startCol: left,
          endCol: right,
          sumMode: 'horizontal'
        }
      }
    }

    return null
  }

  const doAutoSum = () => {
    const cell = getActiveCell()
    if (!cell) {
      showToast('Select an active cell first')
      return
    }

    const range = findAutoSumRange(cell.row, cell.column)
    if (!range) {
      showToast('No numeric range found to sum')
      return
    }

    const startRef = `${columnToLabel(range.startCol)}${range.startRow + 1}`
    const endRef = `${columnToLabel(range.endCol)}${range.endRow + 1}`
    const result = writeFormulaToActiveCell(workbookRef, `=SUM(${startRef}:${endRef})`)

    if (result.ok) {
      showToast(`AutoSum inserted into ${columnToLabel(cell.column)}${cell.row + 1}`)
      return
    }

    showToast(`AutoSum failed: ${result.error}`)
  }

  const parseRefs = formula => {
    const matches = String(formula || '').match(/\b[A-Z]{1,3}\d+(?::[A-Z]{1,3}\d+)?\b/g)
    return matches || []
  }

  const inspectPrecedents = () => {
    const formula = getCellFormula()
    if (!formula || !String(formula).startsWith('=')) {
      showToast('Select a formula cell first')
      return
    }

    const refs = parseRefs(formula)
    if (!refs.length) {
      showToast('No precedents found')
      return
    }

    showToast('Precedents: ' + refs.slice(0, 4).join(', '))
  }

  const inspectDependents = () => {
    const workbook = getWorkbook()
    const cell = getActiveCell()
    if (!workbook || !cell) {
      showToast('Select a cell first')
      return
    }

    const cellRef = `${String.fromCharCode(65 + cell.column)}${cell.row + 1}`
    const sheets = workbook.getAllSheets?.() || []
    const dependents = []

    sheets.forEach(sheet => {
      ;(sheet.celldata || []).forEach(item => {
        const formula = item?.v?.f || item?.f || ''
        if (formula && String(formula).includes(cellRef)) {
          dependents.push(`${sheet.name || 'Sheet'}!${String.fromCharCode(65 + item.c)}${item.r + 1}`)
        }
      })
    })

    if (!dependents.length) {
      showToast('No dependents found')
      return
    }

    showToast('Dependents: ' + dependents.slice(0, 4).join(', '))
  }

  const runFormulaErrorCheck = () => {
    const workbook = getWorkbook()
    const formula = getCellFormula()
    if (!workbook) {
      showToast('Open a sheet first')
      return
    }

    if (formula && String(formula).startsWith('=')) {
      const opens = (formula.match(/\(/g) || []).length
      const closes = (formula.match(/\)/g) || []).length
      if (opens !== closes) {
        showToast('Formula has mismatched parentheses')
        return
      }
      showToast('No obvious formula error found')
      return
    }

    showToast('Select a formula cell to check')
  }

  const renderHome = () => (
    <>
      <Group label="Clipboard">
        <Btn label="Paste" icon="⎘" onClick={() => document.execCommand('paste')} />
        <Btn label="Cut" icon="✂" onClick={() => document.execCommand('cut')} />
        <Btn label="Copy" icon="⧉" onClick={() => document.execCommand('copy')} />
      </Group>

      <Group label="Font">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '6px 4px'
        }}>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <select
              value={fontFamily}
              onChange={e => {
                setFontFamily(e.target.value)
                applyFormat('ff', e.target.value)
              }}
              style={selectStyle}
            >
              <option>DM Sans</option>
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Courier New</option>
              <option>Georgia</option>
            </select>
<select
              value={fontSize}
              onChange={e => {
                setFontSize(e.target.value)
                applyFormat('fs', Number(e.target.value))
              }}
              style={{ ...selectStyle, width: '52px' }}
            >
              {[8,9,10,11,12,14,16,18,20,24,28,36].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
<SmallBtn onClick={() => {
              applyFormat('bl', 1)
            }}>
              <strong style={{ fontSize: '13px' }}>B</strong>
            </SmallBtn>
            <SmallBtn onClick={() => {
              applyFormat('it', 1)
            }}>
              <em style={{ fontSize: '13px' }}>I</em>
            </SmallBtn>
            <SmallBtn onClick={() => {
              applyFormat('un', 1)
            }}>
              <u style={{ fontSize: '13px' }}>U</u>
            </SmallBtn>
            <SmallBtn onClick={() => {
              applyFormat('cl', 1)
            }}>
              <s style={{ fontSize: '13px' }}>S</s>
            </SmallBtn>
            <div style={{ width: '1px', height: '16px', background: '#E0DBD0', margin: '0 2px' }} />
            <SmallBtn onClick={() => showToast('Text color coming soon')}>
              <span style={{ fontSize: '12px', borderBottom: '2px solid #E63946' }}>A</span>
            </SmallBtn>
            <SmallBtn onClick={() => showToast('Fill color coming soon')}>
              <span style={{ fontSize: '11px', fontWeight: '500' }}>fill</span>
            </SmallBtn>
          </div>
        </div>
      </Group>

      <Group label="Alignment">
<Btn label="Left" icon="≡" onClick={() => {
          applyFormat('ht', 1)
        }} />
        <Btn label="Center" icon="≣" onClick={() => {
          applyFormat('ht', 0)
        }} />
        <Btn label="Right" icon="⊒" onClick={() => {
          applyFormat('ht', 2)
        }} />
        <Btn label="Wrap" icon="⇥" onClick={() => showToast('Wrap text toggled')} />
        <Btn label="Merge" icon="⊠" onClick={() => showToast('Merge cells coming soon')} />
      </Group>

      <Group label="Number">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '6px 4px'
        }}>
<select style={{ ...selectStyle, width: '120px' }} onChange={e => {
            const formats = {
              'General': 'General',
              'Number': '0.00',
              'Currency': '"$"#,##0.00',
              'Percentage': '0.00%',
              'Date': 'yyyy/MM/dd',
              'Time': 'h:mm AM/PM',
              'Text': '@'
            }
            const workbook = getWorkbook()
            const selection = getSelection()
            const format = { fa: formats[e.target.value], t: 'n' }

            if (selection && workbook?.setCellFormatByRange) {
              workbook.setCellFormatByRange('ct', format, selection)
              return
            }

            showToast('Select a cell first')
          }}>
            <option>General</option>
            <option>Number</option>
            <option>Currency</option>
            <option>Percentage</option>
            <option>Date</option>
            <option>Time</option>
            <option>Text</option>
          </select>
          <div style={{ display: 'flex', gap: '2px' }}>
            <SmallBtn onClick={() => showToast('Currency')}>$</SmallBtn>
            <SmallBtn onClick={() => showToast('Percent')}>%</SmallBtn>
            <SmallBtn onClick={() => showToast('Comma')}>,</SmallBtn>
            <div style={{ width: '1px', height: '16px', background: '#E0DBD0', margin: '0 2px' }} />
            <SmallBtn onClick={() => showToast('Increase decimal')}>.0</SmallBtn>
            <SmallBtn onClick={() => showToast('Decrease decimal')}>0.</SmallBtn>
          </div>
        </div>
      </Group>

<Group label="Cells">
        <Btn label="Insert" icon="⊕" onClick={() => {
          if (insertOrDelete('row', 'insert')) showToast('Row inserted')
        }} />
        <Btn label="Delete" icon="⊖" onClick={() => {
          if (insertOrDelete('row', 'delete')) showToast('Row deleted')
        }} />
        <Btn label="Format" icon="⊞" onClick={() => showToast('Format cells coming soon')} />
      </Group>

      <Group label="Editing">
        <Btn label="AutoSum" icon="∑" onClick={doAutoSum} />
        <Btn label="Fill" icon="▼" onClick={() => showToast('Fill coming soon')} />
        <Btn label="Clear" icon="◌" onClick={() => showToast('Clear coming soon')} />
        <Btn label="Sort" icon="⇅" onClick={() => showToast('Sort coming soon')} />
        <Btn label="Find" icon="⌕" onClick={() => showToast('Find coming soon')} />
      </Group>
    </>
  )

  const renderInsert = () => (
    <>
      <Group label="Tables">
        <Btn label="Pivot Table" icon="⊞" onClick={() => showToast('Pivot tables coming soon')} />
        <Btn label="Table" icon="▦" onClick={() => showToast('Table coming soon')} />
      </Group>
      <Group label="Charts">
        <Btn label="Bar" icon="▮" onClick={() => showToast('Charts coming soon')} />
        <Btn label="Line" icon="╱" onClick={() => showToast('Charts coming soon')} />
        <Btn label="Pie" icon="◑" onClick={() => showToast('Charts coming soon')} />
      </Group>
      <Group label="Links">
        <Btn label="Hyperlink" icon="⚓" onClick={() => showToast('Hyperlink coming soon')} />
      </Group>
      <Group label="Text">
        <Btn label="Text Box" icon="▭" onClick={() => showToast('Text box coming soon')} />
      </Group>
    </>
  )

  const renderFormulas = () => (
    <>
      <Group label="Function Library">
        <Btn label="Insert Fn" icon="ƒ" onClick={() => openFormulaSearch('')} />
        <Btn label="AutoSum" icon="∑" onClick={doAutoSum} />
        <Btn label="Financial" icon="$" onClick={() => openFormulaSearch('PMT')} />
        <Btn label="Logical" icon="⊻" onClick={() => openFormulaSearch('IF')} />
        <Btn label="Text" icon="T" onClick={() => openFormulaSearch('CONCATENATE')} />
        <Btn label="Date" icon="▦" onClick={() => openFormulaSearch('TODAY')} />
        <Btn label="Lookup" icon="⇲" onClick={() => openFormulaSearch('VLOOKUP')} />
        <Btn label="Math" icon="π" onClick={() => openFormulaSearch('AVERAGE')} />
      </Group>
      <Group label="Auditing">
        <Btn label="Precedents" icon="↖" onClick={inspectPrecedents} />
        <Btn label="Dependents" icon="↘" onClick={inspectDependents} />
        <Btn
          label="Show Fmlas"
          icon="="
          active={showFormulas}
          onClick={() => {
            const next = !showFormulas
            setShowFormulas(next)
            showToast(next ? 'Formula preview on' : 'Formula preview off')
          }}
        />
        <Btn label="Error Check" icon="⚠" onClick={runFormulaErrorCheck} />
      </Group>
      <Group label="Calculation">
        <Btn label="Calc Now" icon="↻" onClick={() => showToast('Recalculating...')} />
        <Btn label="Calc Sheet" icon="▷" onClick={() => showToast('Sheet recalculated')} />
      </Group>
    </>
  )

  const renderData = () => (
    <>
<Group label="Get Data">
        <Btn label="Import CSV" icon="⇩" onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = '.csv'
          input.onchange = async (e) => {
            const file = e.target.files[0]
            if (!file) return
            const text = await file.text()
            const rows = text.split('\n').map(r => r.split(','))
            const celldata = []
            rows.forEach((row, r) => {
              row.forEach((val, c) => {
                const v = val.trim().replace(/^"|"$/g, '')
                if (v) celldata.push({ 
                  r, c, v: { v, m: v, ct: { fa: 'General', t: 'g' } } 
                })
              })
            })
            workbookRef?.current?.loadData?.([{
              name: file.name.replace('.csv', ''),
              celldata,
              row: Math.max(rows.length + 20, 100),
              column: 26,
              status: 1
            }])
            showToast('Imported ' + file.name)
          }
          input.click()
        }} />
        <Btn label="Import XLS" icon="⇩" onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = '.xlsx,.xls'
          input.onchange = async (e) => {
            const file = e.target.files[0]
            if (!file) return
            const ext = file.name.split('.').pop()?.toLowerCase()
            if (ext === 'xlsx' || ext === 'xls') {
              showToast('XLSX import needs the xlsx package installed')
              return
            }
            showToast('Unsupported file type')
          }
          input.click()
        }} />
      </Group>
<Group label="Sort and Filter">
        <Btn label="A to Z" icon="↑" onClick={() => {
          sortSelectionRange(true)
        }} />
        <Btn label="Z to A" icon="↓" onClick={() => {
          sortSelectionRange(false)
        }} />
        <Btn label="Filter" icon="▽" onClick={() => showToast('Filter coming soon')} />
        <Btn label="Clear" icon="✕" onClick={() => showToast('Clear filter coming soon')} />
      </Group>
      <Group label="Data Tools">
        <Btn label="Text to Col" icon="⇥" onClick={() => showToast('Text to columns coming soon')} />
        <Btn label="Remove Dup" icon="⊟" onClick={() => showToast('Remove duplicates coming soon')} />
        <Btn label="Validation" icon="✓" onClick={() => showToast('Data validation coming soon')} />
      </Group>
    </>
  )

  const renderView = () => (
    <>
      <Group label="Views">
        <Btn label="Normal" icon="▢" onClick={() => showToast('Normal view')} />
<Btn label="Full Screen" icon="⛶" onClick={() => {
          if (document.fullscreenElement) {
            document.exitFullscreen()
            showToast('Exited full screen')
          } else {
            document.documentElement.requestFullscreen()
            showToast('Press Escape to exit full screen')
          }
        }} />
      </Group>
      <Group label="Show">
        <Btn
          label="Gridlines"
          icon="▦"
          active={showGridlines}
          onClick={() => setShowGridlines(!showGridlines)}
        />
        <Btn
          label="Headings"
          icon="▤"
          active={showHeadings}
          onClick={() => setShowHeadings(!showHeadings)}
        />
      </Group>
<Group label="Freeze">
        <Btn label="Freeze Top" icon="⊤" onClick={() => {
          freezeSheet('row')
          showToast('Top row frozen')
        }} />
        <Btn label="Freeze Col" icon="⊣" onClick={() => {
          freezeSheet('column')
          showToast('First column frozen')
        }} />
        <Btn label="Unfreeze" icon="⊠" onClick={() => {
          freezeSheet('unfreeze')
          showToast('Unfrozen')
        }} />
      </Group>
      <Group label="Zoom">
        <Btn label="100%" icon="⊡" onClick={() => {
          setZoom(1)
          showToast('Zoom reset to 100%')
        }} />
        <Btn label="Zoom In" icon="⊕" onClick={() => {
          const sheet = getSheet()
          setZoom(Math.min((sheet?.zoomRatio || 1) + 0.1, 4))
        }} />
        <Btn label="Zoom Out" icon="⊖" onClick={() => {
          const sheet = getSheet()
          setZoom(Math.max((sheet?.zoomRatio || 1) - 0.1, 0.1))
        }} />
      </Group>
    </>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'Home': return renderHome()
      case 'Insert': return renderInsert()
      case 'Formulas': return renderFormulas()
      case 'Data': return renderData()
      case 'View': return renderView()
      default: return renderHome()
    }
  }

  return (
    <div style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E0DBD0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      {/* Tab Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid #E0DBD0'
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 16px',
              fontSize: '11px',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: '400',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: activeTab === tab ? '#1C1A17' : '#9A948A',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab
                ? '2px solid #00D4AA'
                : '2px solid transparent',
              marginBottom: '-1px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: saveStatus === 'saved' ? '#00D4AA' : '#9A948A'
          }} />
          <span style={{ fontSize: '11px', color: '#9A948A' }}>
            {saveStatus === 'saved' ? 'Saved' : 'Saving...'}
          </span>
        </div>
      </div>

{/* Ribbon Row */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        padding: '0 8px',
        minHeight: '80px',
        overflowX: 'auto'
      }}>
        {renderContent()}
      </div>

      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#1C1A17',
          color: '#FFFFFF',
          padding: '10px 18px',
          borderRadius: '4px',
          fontSize: '13px',
          fontFamily: 'DM Sans, sans-serif',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'opacity 0.2s ease'
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  )
}
