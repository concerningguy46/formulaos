import { useState } from 'react'

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

export default function Toolbar({ workbookRef, saveStatus, onSearch, onAI }) {
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
              onChange={e => setFontFamily(e.target.value)}
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
              onChange={e => setFontSize(e.target.value)}
              style={{ ...selectStyle, width: '52px' }}
            >
              {[8,9,10,11,12,14,16,18,20,24,28,36].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            <SmallBtn onClick={() => document.execCommand('bold')}>
              <strong style={{ fontSize: '13px' }}>B</strong>
            </SmallBtn>
            <SmallBtn onClick={() => document.execCommand('italic')}>
              <em style={{ fontSize: '13px' }}>I</em>
            </SmallBtn>
            <SmallBtn onClick={() => document.execCommand('underline')}>
              <u style={{ fontSize: '13px' }}>U</u>
            </SmallBtn>
            <SmallBtn onClick={() => document.execCommand('strikeThrough')}>
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
        <Btn label="Left" icon="≡" onClick={() => document.execCommand('justifyLeft')} />
        <Btn label="Center" icon="≣" onClick={() => document.execCommand('justifyCenter')} />
        <Btn label="Right" icon="⊒" onClick={() => document.execCommand('justifyRight')} />
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
          <select style={{ ...selectStyle, width: '120px' }}>
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
        <Btn label="Insert" icon="⊕" onClick={() => showToast('Insert row/col coming soon')} />
        <Btn label="Delete" icon="⊖" onClick={() => showToast('Delete row/col coming soon')} />
        <Btn label="Format" icon="⊞" onClick={() => showToast('Format cells coming soon')} />
      </Group>

      <Group label="Editing">
        <Btn label="AutoSum" icon="∑" onClick={() => showToast('AutoSum coming soon')} />
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
        <Btn label="Insert Fn" icon="ƒ" onClick={onSearch} />
        <Btn label="AutoSum" icon="∑" onClick={() => showToast('AutoSum coming soon')} />
        <Btn label="Financial" icon="$" onClick={() => showToast('Financial formulas')} />
        <Btn label="Logical" icon="⊻" onClick={() => showToast('Logical formulas')} />
        <Btn label="Text" icon="T" onClick={() => showToast('Text formulas')} />
        <Btn label="Date" icon="▦" onClick={() => showToast('Date formulas')} />
        <Btn label="Lookup" icon="⇲" onClick={() => showToast('Lookup formulas')} />
        <Btn label="Math" icon="π" onClick={() => showToast('Math formulas')} />
      </Group>
      <Group label="Auditing">
        <Btn label="Precedents" icon="↖" onClick={() => showToast('Trace precedents coming soon')} />
        <Btn label="Dependents" icon="↘" onClick={() => showToast('Trace dependents coming soon')} />
        <Btn
          label="Show Fmlas"
          icon="="
          active={showFormulas}
          onClick={() => setShowFormulas(!showFormulas)}
        />
        <Btn label="Error Check" icon="⚠" onClick={() => showToast('Error checking coming soon')} />
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
        <Btn label="Import CSV" icon="⇩" onClick={() => showToast('Import CSV coming soon')} />
        <Btn label="Import XLS" icon="⇩" onClick={() => showToast('Import Excel coming soon')} />
      </Group>
      <Group label="Sort and Filter">
        <Btn label="A to Z" icon="↑" onClick={() => showToast('Sort A-Z coming soon')} />
        <Btn label="Z to A" icon="↓" onClick={() => showToast('Sort Z-A coming soon')} />
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
          } else {
            document.documentElement.requestFullscreen()
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
        <Btn label="Freeze Top" icon="⊤" onClick={() => showToast('Freeze top row coming soon')} />
        <Btn label="Freeze Col" icon="⊣" onClick={() => showToast('Freeze first col coming soon')} />
        <Btn label="Unfreeze" icon="⊠" onClick={() => showToast('Unfreeze coming soon')} />
      </Group>
      <Group label="Zoom">
        <Btn label="100%" icon="⊡" onClick={() => showToast('Zoom reset coming soon')} />
        <Btn label="Zoom In" icon="⊕" onClick={() => showToast('Zoom in coming soon')} />
        <Btn label="Zoom Out" icon="⊖" onClick={() => showToast('Zoom out coming soon')} />
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
