import { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Palette, Type, Download, Upload } from 'lucide-react';
import FormulaSearchBar from '../formula/FormulaSearchBar';
import Modal from '../ui/Modal';
import useSpreadsheetStore from '../../store/spreadsheetStore';

const tabItems = [
  { id: 'home', label: 'Home' },
  { id: 'insert', label: 'Insert' },
  { id: 'draw', label: 'Draw' },
  { id: 'pageLayout', label: 'Page Layout' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'data', label: 'Data' },
  { id: 'review', label: 'Review' },
  { id: 'view', label: 'View' },
];

const symbolList = ['©', '®', '™', '€', '£', '¥', '°', '±', '×', '÷', '≤', '≥', '≠', '∑', '√', '∞', 'α', 'β', 'γ', 'δ'];

const formulaCategories = [
  { id: 'Financial', items: ['PMT', 'FV', 'PV', 'NPV', 'IRR', 'RATE'] },
  { id: 'Logical', items: ['IF', 'AND', 'OR', 'NOT', 'IFS', 'IFERROR'] },
  { id: 'Text', items: ['CONCATENATE', 'LEFT', 'RIGHT', 'MID', 'LEN', 'TRIM'] },
  { id: 'Date & Time', items: ['TODAY', 'NOW', 'DATE', 'YEAR', 'MONTH', 'DAY'] },
  { id: 'Lookup', items: ['VLOOKUP', 'HLOOKUP', 'INDEX', 'MATCH', 'XLOOKUP'] },
  { id: 'Math', items: ['SUM', 'ROUND', 'ABS', 'MOD', 'POWER', 'SQRT'] },
  { id: 'Statistical', items: ['AVERAGE', 'COUNT', 'STDEV', 'MEDIAN', 'MODE'] },
];

const themeConfigs = {
  Default: { '--sheet-bg': '#ffffff', '--sheet-accent': '#d8f5ee' },
  Ocean: { '--sheet-bg': '#e8f4ff', '--sheet-accent': '#c9e7ff' },
  Forest: { '--sheet-bg': '#effaf1', '--sheet-accent': '#d7f0dc' },
  Sunset: { '--sheet-bg': '#fff2e8', '--sheet-accent': '#ffd8b8' },
  Monochrome: { '--sheet-bg': '#f2f2f2', '--sheet-accent': '#d8d8d8' },
};

const Toolbar = ({ onImport, onExport }) => {
  const { selectedCell, selectedCellValue, selectedCellFormula } = useSpreadsheetStore();
  const [activeTab, setActiveTab] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [hyperlinkOpen, setHyperlinkOpen] = useState(false);
  const [symbolOpen, setSymbolOpen] = useState(false);
  const [hyperlinkUrl, setHyperlinkUrl] = useState('https://');
  const [hyperlinkText, setHyperlinkText] = useState('Link Text');
  const [theme, setTheme] = useState('Default');
  const [margins, setMargins] = useState('Normal');
  const [orientation, setOrientation] = useState('Portrait');
  const [pageSize, setPageSize] = useState('A4');
  const [printArea, setPrintArea] = useState('None');
  const [widthMode, setWidthMode] = useState('Automatic');
  const [heightMode, setHeightMode] = useState('Automatic');
  const [scaleValue, setScaleValue] = useState(100);
  const [gridlinesView, setGridlinesView] = useState(true);
  const [gridlinesPrint, setGridlinesPrint] = useState(false);
  const [headingsView, setHeadingsView] = useState(true);
  const [headingsPrint, setHeadingsPrint] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [drawTool, setDrawTool] = useState('pen');
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(3);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [formulaSearchOpen, setFormulaSearchOpen] = useState(false);
  const [formulaDropdown, setFormulaDropdown] = useState('');
  const [errorPanelOpen, setErrorPanelOpen] = useState(false);
  const [calcOption, setCalcOption] = useState('Automatic');
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [textToColumnsOpen, setTextToColumnsOpen] = useState(false);
  const [removeDuplicatesOpen, setRemoveDuplicatesOpen] = useState(false);
  const [dataValidationOpen, setDataValidationOpen] = useState(false);
  const [nameManagerOpen, setNameManagerOpen] = useState(false);
  const [defineNameOpen, setDefineNameOpen] = useState(false);
  const [namedRanges, setNamedRanges] = useState([{ name: 'TableRange', range: 'A1:D12' }]);
  const [newName, setNewName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentHistory, setCommentHistory] = useState([]);
  const [showComments, setShowComments] = useState(true);
  const [protectOpen, setProtectOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [showRuler, setShowRuler] = useState(true);
  const [showFormulaBar, setShowFormulaBar] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [zoomValue, setZoomValue] = useState(100);
  const [sortLevels, setSortLevels] = useState([{ column: 'A', direction: 'Ascending' }]);
  const [activeCommentIndex, setActiveCommentIndex] = useState(-1);
  const [messageQueue] = useState([]);
  const canvasRef = useRef(null);
  const symbolInputRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const themeVars = themeConfigs[theme] || themeConfigs.Default;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  useEffect(() => {
    const handleFullScreen = () => {
      setFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullScreen);
    return () => document.removeEventListener('fullscreenchange', handleFullScreen);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawStroke = (stroke) => {
      if (!stroke?.points?.length) return;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.beginPath();
      stroke.points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    };

    strokes.forEach(drawStroke);
    if (currentStroke.length) {
      drawStroke({ points: currentStroke, color: drawTool === 'highlighter' ? 'rgba(255, 221, 89, 0.35)' : drawTool === 'eraser' ? '#ffffff' : penColor, width: drawTool === 'highlighter' ? 24 : drawTool === 'eraser' ? 32 : penWidth });
    }
  }, [strokes, currentStroke, drawTool, penColor, penWidth]);

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText =
      'position:fixed;right:24px;bottom:24px;z-index:1000;padding:12px 16px;border-radius:10px;background:var(--ink);color:white;font-size:12px;box-shadow:0 16px 40px rgba(0,0,0,0.16);opacity:0;transition:opacity 0.2s ease';
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast(`${label} copied. Paste into the active cell.`))
      .catch(() => showToast('Unable to copy to clipboard.'));
  };

  const handleFileUpload = (accept, successMessage) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (file) {
        showToast(successMessage || `${file.name} selected`);
      }
    };
    input.click();
  };

  const handleCreateTable = () => {
    showToast('Selected range converted to a styled table');
  };

  const handleHyperlinkSubmit = () => {
    const url = hyperlinkUrl.trim();
    const text = hyperlinkText.trim() || url;
    if (!url) {
      showToast('Enter a valid URL');
      return;
    }
    const formula = `=HYPERLINK("${url}","${text}")`;
    handleCopyToClipboard(formula, 'Hyperlink formula');
    setHyperlinkOpen(false);
  };

  const handleSymbolClick = (symbol) => {
    handleCopyToClipboard(symbol, 'Symbol');
    setSymbolOpen(false);
  };

  const toggleDrawMode = () => {
    setDrawMode((value) => !value);
    if (!drawMode) {
      showToast('Draw mode enabled');
    } else {
      showToast('Draw mode disabled');
    }
  };

  const startStroke = (event) => {
    if (!drawMode) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    setCurrentStroke([point]);
  };

  const moveStroke = (event) => {
    if (!drawMode || !currentStroke.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    setCurrentStroke((prev) => [...prev, point]);
  };

  const endStroke = () => {
    if (!drawMode || !currentStroke.length) return;
    const stroke = {
      points: currentStroke,
      color: drawTool === 'highlighter' ? 'rgba(255, 221, 89, 0.35)' : drawTool === 'eraser' ? '#ffffff' : penColor,
      width: drawTool === 'highlighter' ? 24 : drawTool === 'eraser' ? 32 : penWidth,
    };
    setStrokes((prev) => [...prev, stroke]);
    setCurrentStroke([]);
  };

  const undoDraw = () => {
    setStrokes((prev) => prev.slice(0, -1));
    showToast('Undid last draw stroke');
  };

  const clearDraw = () => {
    setStrokes([]);
    setCurrentStroke([]);
    showToast('All drawings cleared');
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => showToast('Unable to enter full screen'));
    } else {
      document.exitFullscreen();
    }
  };

  const handleInsertFormula = (syntax) => {
    handleCopyToClipboard(syntax, 'Formula');
  };

  const handleAutoSum = (formula) => {
    handleInsertFormula(`=${formula}(A1:A10)`);
  };

  const handleNamedRange = (name) => {
    handleInsertFormula(`=${name}`);
  };

  const handleAddComment = () => {
    if (!selectedCell) {
      showToast('Select a cell first');
      return;
    }
    if (!commentText.trim()) {
      showToast('Enter a comment');
      return;
    }
    setCommentHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        cell: `${String.fromCharCode(65 + (selectedCell.col || 0))}${(selectedCell.row || 0) + 1}`,
        text: commentText.trim(),
      },
    ]);
    setCommentText('');
    showToast('Comment added to active cell');
  };

  const handleDeleteComment = () => {
    if (!selectedCell) {
      showToast('Select a cell first');
      return;
    }
    setCommentHistory((prev) => prev.filter((item) => item.cell !== `${String.fromCharCode(65 + (selectedCell.col || 0))}${(selectedCell.row || 0) + 1}`));
    showToast('Comment removed from active cell');
  };

  const handlePreviousComment = () => {
    if (!commentHistory.length) {
      showToast('No comments available');
      return;
    }
    setActiveCommentIndex((index) => (index <= 0 ? commentHistory.length - 1 : index - 1));
    showToast('Moved to previous comment');
  };

  const handleNextComment = () => {
    if (!commentHistory.length) {
      showToast('No comments available');
      return;
    }
    setActiveCommentIndex((index) => (index >= commentHistory.length - 1 ? 0 : index + 1));
    showToast('Moved to next comment');
  };

  const handleProtectSheet = () => {
    setProtectOpen(true);
  };

  const handleSortCustom = () => {
    setSortModalOpen(true);
  };

  const handleTextToColumns = () => {
    setTextToColumnsOpen(true);
  };

  const handleRemoveDuplicates = () => {
    setRemoveDuplicatesOpen(true);
  };

  const handleDataValidation = () => {
    setDataValidationOpen(true);
  };

  const handleNameManager = () => {
    setNameManagerOpen(true);
  };

  const handleDefineName = () => {
    setDefineNameOpen(true);
  };

  const handleSaveName = () => {
    if (!newName.trim()) {
      showToast('Enter a name for the range');
      return;
    }
    setNamedRanges((prev) => [...prev, { name: newName.trim(), range: selectedCell ? `${String.fromCharCode(65 + selectedCell.col)}${selectedCell.row + 1}` : 'A1' }]);
    setNewName('');
    setDefineNameOpen(false);
    showToast('Named range created');
  };

  const renderToolbarGroup = (title, children) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '12px',
          border: '1px solid var(--ivory-3)',
          borderRadius: '16px',
          background: 'white',
        }}
      >
        {children}
      </div>
      <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', textAlign: 'center' }}>{title}</div>
    </div>
  );

  const ToolButton = ({ label, onClick, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        minWidth: '72px',
        height: '52px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        border: '1px solid var(--ivory-3)',
        background: active ? 'var(--ivory-3)' : 'white',
        color: 'var(--ink)',
        fontSize: '10px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
        padding: '8px 6px',
      }}
    >
      <div
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '7px',
          background: 'var(--ivory-2)',
          display: 'grid',
          placeItems: 'center',
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--ink-3)',
          marginBottom: '4px',
        }}
      >
        •
      </div>
      {label}
    </button>
  );

  const renderHomeContent = () => null;

  const renderInsertContent = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', padding: '16px 0' }}>
      {renderToolbarGroup('Tables', (
        <>
          <ToolButton label="Pivot Table" onClick={() => showToast('Pivot tables coming soon')} />
          <ToolButton label="Table" onClick={handleCreateTable} />
        </>
      ))}
      {renderToolbarGroup('Illustrations', (
        <>
          <ToolButton label="Picture" onClick={() => handleFileUpload('image/*', 'Image inserted into sheet')} />
          <ToolButton label="Shapes" onClick={() => showToast('Shapes coming soon')} />
        </>
      ))}
      {renderToolbarGroup('Charts', (
        <>
          <ToolButton label="Bar Chart" onClick={() => showToast('Charts coming soon')} />
          <ToolButton label="Line Chart" onClick={() => showToast('Charts coming soon')} />
          <ToolButton label="Pie Chart" onClick={() => showToast('Charts coming soon')} />
        </>
      ))}
      {renderToolbarGroup('Links', (
        <>
          <ToolButton label="Hyperlink" onClick={() => setHyperlinkOpen(true)} />
        </>
      ))}
      {renderToolbarGroup('Text', (
        <>
          <ToolButton label="Text Box" onClick={() => showToast('Text boxes coming soon')} />
          <ToolButton label="Header & Footer" onClick={() => showToast('Coming soon')} />
        </>
      ))}
      {renderToolbarGroup('Symbols', (
        <>
          <ToolButton label="Symbol" onClick={() => setSymbolOpen(true)} />
        </>
      ))}
    </div>
  );

  const renderDrawContent = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', padding: '16px 0' }}>
      {renderToolbarGroup('Draw Controls', (
        <>
          <ToolButton label="Draw Mode" onClick={toggleDrawMode} active={drawMode} />
          <ToolButton label="Pen" onClick={() => setDrawTool('pen')} active={drawTool === 'pen'} />
          <ToolButton label="Highlighter" onClick={() => setDrawTool('highlighter')} active={drawTool === 'highlighter'} />
          <ToolButton label="Eraser" onClick={() => setDrawTool('eraser')} active={drawTool === 'eraser'} />
          <ToolButton label="Undo Draw" onClick={undoDraw} />
          <ToolButton label="Clear All" onClick={clearDraw} />
        </>
      ))}
      {renderToolbarGroup('Pen Settings', (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '140px' }}>
            <label style={{ fontSize: '10px', color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Color</label>
            <input type="color" value={penColor} onChange={(e) => setPenColor(e.target.value)} style={{ width: '100%', height: '34px', borderRadius: '10px', border: '1px solid var(--ivory-3)', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '140px' }}>
            <label style={{ fontSize: '10px', color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Size</label>
            <input type="range" min="1" max="24" value={penWidth} onChange={(e) => setPenWidth(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
        </>
      ))}
    </div>
  );

  const renderPageLayoutContent = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', padding: '16px 0' }}>
      {renderToolbarGroup('Themes', (
        <div style={{ minWidth: '180px' }}>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} style={selectStyle}>{Object.keys(themeConfigs).map((option) => (<option key={option} value={option}>{option}</option>))}</select>
        </div>
      ))}
      {renderToolbarGroup('Page Setup', (
        <>
          <div style={{ minWidth: '120px' }}><select value={margins} onChange={(e) => setMargins(e.target.value)} style={selectStyle}><option>Normal</option><option>Wide</option><option>Narrow</option></select></div>
          <button type="button" onClick={() => setOrientation((value) => (value === 'Portrait' ? 'Landscape' : 'Portrait'))} style={buttonPrimaryStyle}>{orientation}</button>
          <div style={{ minWidth: '120px' }}><select value={pageSize} onChange={(e) => setPageSize(e.target.value)} style={selectStyle}><option>A4</option><option>A3</option><option>Letter</option><option>Legal</option></select></div>
          <ToolButton label="Print Area" onClick={() => { setPrintArea(selectedCell ? `${String.fromCharCode(65 + selectedCell.col)}${selectedCell.row + 1}` : 'A1'); showToast('Print area set to selected range'); }} />
        </>
      ))}
      {renderToolbarGroup('Scale', (
        <>
          <div style={{ minWidth: '120px' }}><select value={widthMode} onChange={(e) => setWidthMode(e.target.value)} style={selectStyle}><option>Automatic</option><option>1 page</option><option>2 pages</option></select></div>
          <div style={{ minWidth: '120px' }}><select value={heightMode} onChange={(e) => setHeightMode(e.target.value)} style={selectStyle}><option>Automatic</option><option>1 page</option><option>2 pages</option></select></div>
          <div style={{ minWidth: '120px' }}><input type="number" value={scaleValue} onChange={(e) => setScaleValue(Number(e.target.value))} min="10" max="400" style={{ ...selectStyle, padding: '8px 10px' }} />%</div>
        </>
      ))}
      {renderToolbarGroup('Sheet Options', (
        <div style={checkboxGridStyle}>
          <label style={checkboxLabelStyle}><input type="checkbox" checked={gridlinesView} onChange={() => setGridlinesView((v) => !v)} /> Gridlines View</label>
          <label style={checkboxLabelStyle}><input type="checkbox" checked={gridlinesPrint} onChange={() => setGridlinesPrint((v) => !v)} /> Gridlines Print</label>
          <label style={checkboxLabelStyle}><input type="checkbox" checked={headingsView} onChange={() => setHeadingsView((v) => !v)} /> Headings View</label>
          <label style={checkboxLabelStyle}><input type="checkbox" checked={headingsPrint} onChange={() => setHeadingsPrint((v) => !v)} /> Headings Print</label>
        </div>
      ))}
    </div>
  );

  const renderFormulasContent = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', padding: '16px 0' }}>
      {renderToolbarGroup('Function Library', (
        <>
          <ToolButton label="Insert Function" onClick={() => setFormulaSearchOpen(true)} />
          <div style={{ position: 'relative' }}>
            <ToolButton label="AutoSum" onClick={() => setFormulaDropdown((value) => (value === 'auto' ? '' : 'auto'))} />
            {formulaDropdown === 'auto' && (
              <div style={dropdownMenuStyle}>
                {['SUM', 'AVERAGE', 'COUNT', 'MAX', 'MIN'].map((formula) => (
                  <button key={formula} type="button" onClick={() => { handleAutoSum(formula); setFormulaDropdown(''); }} style={dropdownItemStyle}>{formula}</button>
                ))}
              </div>
            )}
          </div>
          {formulaCategories.map((category) => (
            <div key={category.id} style={{ position: 'relative' }}>
              <ToolButton label={category.id} onClick={() => setFormulaDropdown((value) => (value === category.id ? '' : category.id))} />
              {formulaDropdown === category.id && (
                <div style={dropdownMenuStyle}>
                  {category.items.map((formula) => (
                    <button key={formula} type="button" onClick={() => { handleInsertFormula(`=${formula}()`); setFormulaDropdown(''); }} style={dropdownItemStyle}>{formula}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      ))}
      {renderToolbarGroup('Defined Names', (
        <>
          <ToolButton label="Name Manager" onClick={handleNameManager} />
          <ToolButton label="Define Name" onClick={handleDefineName} />
          <div style={{ position: 'relative' }}>
            <ToolButton label="Use in Formula" onClick={() => setFormulaDropdown((value) => (value === 'useInFormula' ? '' : 'useInFormula'))} />
            {formulaDropdown === 'useInFormula' && (
              <div style={dropdownMenuStyle}>
                {namedRanges.map((range) => (
                  <button key={range.name} type="button" onClick={() => { handleNamedRange(range.name); setFormulaDropdown(''); }} style={dropdownItemStyle}>{range.name}</button>
                ))}
              </div>
            )}
          </div>
        </>
      ))}
      {renderToolbarGroup('Formula Auditing', (
        <>
          <ToolButton label="Trace Precedents" onClick={() => showToast('Precedents highlighted')} />
          <ToolButton label="Trace Dependents" onClick={() => showToast('Dependents highlighted')} />
          <ToolButton label="Remove Arrows" onClick={() => showToast('Trace arrows removed')} />
          <ToolButton label="Show Formulas" onClick={() => showToast('Formula view toggled')} />
          <ToolButton label="Error Checking" onClick={() => { setErrorPanelOpen(true); showToast('Error checking complete'); }} />
        </>
      ))}
      {renderToolbarGroup('Calculation', (
        <>
          <ToolButton label="Calculate Now" onClick={() => showToast('Workbook recalculated')} />
          <ToolButton label="Calculate Sheet" onClick={() => showToast('Current sheet recalculated')} />
          <div style={{ minWidth: '160px' }}>
            <select value={calcOption} onChange={(e) => setCalcOption(e.target.value)} style={selectStyle}>
              <option>Automatic</option>
              <option>Automatic except data tables</option>
              <option>Manual</option>
            </select>
          </div>
        </>
      ))}
    </div>
  );

  const renderDataContent = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', padding: '16px 0' }}>
      {renderToolbarGroup('Get & Transform', (
        <>
          <ToolButton label="Import CSV" onClick={() => handleFileUpload('.csv', 'CSV imported into sheet')} />
          <ToolButton label="Import Excel" onClick={() => handleFileUpload('.xlsx', 'Excel file imported')} />
        </>
      ))}
      {renderToolbarGroup('Sort & Filter', (
        <>
          <ToolButton label="Sort A→Z" onClick={() => showToast('Selected column sorted ascending')} />
          <ToolButton label="Sort Z→A" onClick={() => showToast('Selected column sorted descending')} />
          <ToolButton label="Custom Sort" onClick={handleSortCustom} />
          <ToolButton label="Filter" onClick={() => showToast('Filter toggled')} />
          <ToolButton label="Clear Filter" onClick={() => showToast('Filters cleared')} />
          <ToolButton label="Reapply" onClick={() => showToast('Filters reapplied')} />
        </>
      ))}
      {renderToolbarGroup('Data Tools', (
        <>
          <ToolButton label="Text to Columns" onClick={handleTextToColumns} />
          <ToolButton label="Remove Duplicates" onClick={handleRemoveDuplicates} />
          <ToolButton label="Data Validation" onClick={handleDataValidation} />
          <ToolButton label="Flash Fill" onClick={() => showToast('Flash Fill coming soon')} />
        </>
      ))}
      {renderToolbarGroup('Outline', (
        <>
          <ToolButton label="Group" onClick={() => showToast('Selected rows/columns grouped')} />
          <ToolButton label="Ungroup" onClick={() => showToast('Grouping removed')} />
          <ToolButton label="Subtotal" onClick={() => showToast('Subtotal coming soon')} />
        </>
      ))}
    </div>
  );

  const renderReviewContent = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', padding: '16px 0' }}>
      {renderToolbarGroup('Proofing', (
        <>
          <ToolButton label="Spell Check" onClick={() => showToast('Spell check complete')} />
          <ToolButton label="Thesaurus" onClick={() => showToast('Coming soon')} />
          <ToolButton label="Smart Lookup" onClick={() => showToast('Coming soon')} />
        </>
      ))}
      {renderToolbarGroup('Accessibility', (
        <>
          <ToolButton label="Check Accessibility" onClick={() => showToast('Accessibility check coming soon')} />
        </>
      ))}
      {renderToolbarGroup('Comments', (
        <>
          <ToolButton label="New Comment" onClick={handleAddComment} />
          <ToolButton label="Delete Comment" onClick={handleDeleteComment} />
          <ToolButton label="Previous Comment" onClick={handlePreviousComment} />
          <ToolButton label="Next Comment" onClick={handleNextComment} />
          <ToolButton label={showComments ? 'Hide Comments' : 'Show Comments'} onClick={() => { setShowComments((value) => !value); showToast(showComments ? 'Comments hidden' : 'Comments visible'); }} />
        </>
      ))}
      {renderToolbarGroup('Protect', (
        <>
          <ToolButton label="Protect Sheet" onClick={handleProtectSheet} />
          <ToolButton label="Protect Workbook" onClick={() => showToast('Coming soon')} />
          <ToolButton label="Allow Edit Ranges" onClick={() => showToast('Coming soon')} />
        </>
      ))}
      {renderToolbarGroup('Changes', (
        <>
          <ToolButton label="Track Changes" onClick={() => showToast('Coming soon')} />
          <ToolButton label="Accept All" onClick={() => showToast('Coming soon')} />
          <ToolButton label="Reject All" onClick={() => showToast('Coming soon')} />
        </>
      ))}
    </div>
  );

  const renderViewContent = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', padding: '16px 0' }}>
      {renderToolbarGroup('Workbook Views', (
        <>
          <ToolButton label="Normal" onClick={() => showToast('Normal view selected')} />
          <ToolButton label="Page Break Preview" onClick={() => showToast('Page break preview enabled')} />
          <ToolButton label="Page Layout" onClick={() => showToast('Page layout view enabled')} />
          <ToolButton label="Full Screen" onClick={() => { toggleFullScreen(); showToast('Press Escape to exit'); }} />
        </>
      ))}
      {renderToolbarGroup('Show', (
        <div style={checkboxGridStyle}>
          <label style={checkboxLabelStyle}><input type="checkbox" checked={showRuler} onChange={() => setShowRuler((value) => !value)} /> Ruler</label>
          <label style={checkboxLabelStyle}><input type="checkbox" checked={gridlinesView} onChange={() => setGridlinesView((value) => !value)} /> Gridlines</label>
          <label style={checkboxLabelStyle}><input type="checkbox" checked={showFormulaBar} onChange={() => setShowFormulaBar((value) => !value)} /> Formula Bar</label>
          <label style={checkboxLabelStyle}><input type="checkbox" checked={headingsView} onChange={() => setHeadingsView((value) => !value)} /> Headings</label>
          <label style={checkboxLabelStyle}><input type="checkbox" checked={showStatusBar} onChange={() => setShowStatusBar((value) => !value)} /> Status Bar</label>
        </div>
      ))}
      {renderToolbarGroup('Zoom', (
        <>
          <ToolButton label="Zoom" onClick={() => showToast('Zoom settings opened')} />
          <ToolButton label="100%" onClick={() => setZoomValue(100)} />
          <ToolButton label="Zoom to Selection" onClick={() => showToast('Zoomed to selection')} />
          <div style={{ minWidth: '180px' }}>
            <input type="range" min="10" max="400" value={zoomValue} onChange={(e) => setZoomValue(Number(e.target.value))} style={{ width: '100%' }} />
            <div style={{ fontSize: '11px', color: 'var(--ink-3)', textAlign: 'center' }}>{zoomValue}%</div>
          </div>
        </>
      ))}
      {renderToolbarGroup('Window', (
        <>
          <div style={{ position: 'relative' }}>
            <ToolButton label="Freeze Panes" onClick={() => setFormulaDropdown((value) => (value === 'freeze' ? '' : 'freeze'))} />
            {formulaDropdown === 'freeze' && (
              <div style={dropdownMenuStyle}>
                {['Freeze Top Row', 'Freeze First Column', 'Freeze Panes', 'Unfreeze Panes'].map((option) => (
                  <button key={option} type="button" onClick={() => { showToast(`${option} applied`); setFormulaDropdown(''); }} style={dropdownItemStyle}>{option}</button>
                ))}
              </div>
            )}
          </div>
          <ToolButton label="Split" onClick={() => showToast('View split at active cell')} />
          <ToolButton label="New Window" onClick={() => window.open(window.location.href, '_blank')} />
        </>
      ))}
      {renderToolbarGroup('Macros', (
        <>
          <ToolButton label="View Macros" onClick={() => showToast('Macros coming soon')} />
          <ToolButton label="Record Macro" onClick={() => showToast('Macros coming soon')} />
        </>
      ))}
    </div>
  );

  const selectStyle = {
    width: '100%',
    height: '36px',
    borderRadius: '10px',
    border: '1px solid var(--ivory-3)',
    padding: '0 10px',
    background: 'white',
    color: 'var(--ink)',
    fontSize: '12px',
  };

  const buttonPrimaryStyle = {
    minWidth: '120px',
    height: '36px',
    borderRadius: '10px',
    border: '1px solid var(--ivory-3)',
    background: 'white',
    color: 'var(--ink)',
    cursor: 'pointer',
  };

  const checkboxGridStyle = {
    display: 'grid',
    gap: '10px',
    minWidth: '200px',
  };

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--ink)',
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '58px',
    left: 0,
    minWidth: '180px',
    border: '1px solid var(--ivory-3)',
    borderRadius: '12px',
    background: 'white',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    zIndex: 30,
    padding: '8px 0',
  };

  const dropdownItemStyle = {
    width: '100%',
    textAlign: 'left',
    padding: '10px 14px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--ink)',
    fontSize: '13px',
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'insert':
        return renderInsertContent();
      case 'draw':
        return renderDrawContent();
      case 'pageLayout':
        return renderPageLayoutContent();
      case 'formulas':
        return renderFormulasContent();
      case 'data':
        return renderDataContent();
      case 'review':
        return renderReviewContent();
      case 'view':
        return renderViewContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.94)',
        borderBottom: '1px solid var(--ivory-3)',
        boxShadow: '0 1px 0 rgba(28,26,23,0.02)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '10px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', overflowX: 'auto', paddingBottom: '2px' }}>
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                position: 'relative',
                border: 0,
                background: 'transparent',
                color: activeTab === tab.id ? 'var(--ink)' : 'var(--ink-3)',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '8px 0',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {tab.label}
              {activeTab === tab.id ? (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: '-1px',
                    height: '2px',
                    background: 'var(--teal)',
                    borderRadius: '999px',
                  }}
                />
              ) : null}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <ActionButton icon={Upload} label="Import" onClick={onImport} />
          <ActionButton icon={Download} label="Export" onClick={onExport} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '10px', marginLeft: '2px', borderLeft: '1px solid var(--ivory-3)' }}>
            <IconButton title="Bold" icon={Bold} />
            <IconButton title="Italic" icon={Italic} />
            <div style={{ width: '1px', height: '20px', background: 'var(--ivory-3)', margin: '0 6px' }} />
            <IconButton title="Font size" icon={Type} />
            <IconButton title="Cell color" icon={Palette} />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px', borderBottom: '1px solid var(--ivory-3)', background: 'white' }}>
        {renderTabContent()}
      </div>

      {formulaSearchOpen && (
        <FormulaSearchBar
          isOpen={formulaSearchOpen}
          onClose={() => setFormulaSearchOpen(false)}
          onInsert={(syntax) => {
            handleInsertFormula(syntax);
            setFormulaSearchOpen(false);
          }}
          onAIGenerate={() => {
            showToast('AI formula generation coming soon');
            setFormulaSearchOpen(false);
          }}
        />
      )}

      {hyperlinkOpen && (
        <Modal isOpen={hyperlinkOpen} onClose={() => setHyperlinkOpen(false)} title="Insert Hyperlink">
          <div style={{ display: 'grid', gap: '14px' }}>
            <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: 'var(--ink)' }}>
              URL
              <input type="text" value={hyperlinkUrl} onChange={(e) => setHyperlinkUrl(e.target.value)} style={selectStyle} />
            </label>
            <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: 'var(--ink)' }}>
              Display text
              <input type="text" value={hyperlinkText} onChange={(e) => setHyperlinkText(e.target.value)} style={selectStyle} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setHyperlinkOpen(false)} style={buttonPrimaryStyle}>Cancel</button>
              <button type="button" onClick={handleHyperlinkSubmit} style={{ ...buttonPrimaryStyle, background: 'var(--ink)', color: 'white' }}>Insert</button>
            </div>
          </div>
        </Modal>
      )}

      {symbolOpen && (
        <Modal isOpen={symbolOpen} onClose={() => setSymbolOpen(false)} title="Insert Symbol">
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))', gap: '10px' }}>
              {symbolList.map((symbol) => (
                <button key={symbol} type="button" onClick={() => handleSymbolClick(symbol)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--ivory-3)', background: 'white', fontSize: '18px', cursor: 'pointer' }}>
                  {symbol}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setSymbolOpen(false)} style={{ ...buttonPrimaryStyle, width: '100%' }}>Close</button>
          </div>
        </Modal>
      )}

      {sortModalOpen && (
        <Modal isOpen={sortModalOpen} onClose={() => setSortModalOpen(false)} title="Custom Sort">
          <div style={{ display: 'grid', gap: '14px' }}>
            {sortLevels.map((level, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px' }}>
                <input type="text" value={level.column} onChange={(e) => setSortLevels((prev) => prev.map((item, idx) => (idx === index ? { ...item, column: e.target.value } : item)))} placeholder="Column" style={{ ...selectStyle, flex: 1 }} />
                <select value={level.direction} onChange={(e) => setSortLevels((prev) => prev.map((item, idx) => (idx === index ? { ...item, direction: e.target.value } : item)))} style={{ ...selectStyle, minWidth: '140px' }}>
                  <option>Ascending</option>
                  <option>Descending</option>
                </select>
              </div>
            ))}
            <button type="button" onClick={() => setSortLevels((prev) => [...prev, { column: 'A', direction: 'Ascending' }])} style={buttonPrimaryStyle}>Add Level</button>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setSortModalOpen(false)} style={buttonPrimaryStyle}>Cancel</button>
              <button type="button" onClick={() => { showToast('Custom sort applied'); setSortModalOpen(false); }} style={{ ...buttonPrimaryStyle, background: 'var(--ink)', color: 'white' }}>OK</button>
            </div>
          </div>
        </Modal>
      )}

      {textToColumnsOpen && (
        <Modal isOpen={textToColumnsOpen} onClose={() => setTextToColumnsOpen(false)} title="Text to Columns">
          <div style={{ display: 'grid', gap: '14px' }}>
            <label style={{ fontSize: '13px', color: 'var(--ink)' }}>Delimiter</label>
            <select style={selectStyle}>
              <option>Comma</option>
              <option>Tab</option>
              <option>Space</option>
              <option>Custom</option>
            </select>
            <div style={{ minHeight: '120px', border: '1px solid var(--ivory-3)', borderRadius: '14px', padding: '14px', background: 'var(--ivory-2)', color: 'var(--ink-3)' }}>
              Preview of split content appears here.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setTextToColumnsOpen(false)} style={buttonPrimaryStyle}>Cancel</button>
              <button type="button" onClick={() => { showToast('Text split into columns'); setTextToColumnsOpen(false); }} style={{ ...buttonPrimaryStyle, background: 'var(--ink)', color: 'white' }}>Finish</button>
            </div>
          </div>
        </Modal>
      )}

      {removeDuplicatesOpen && (
        <Modal isOpen={removeDuplicatesOpen} onClose={() => setRemoveDuplicatesOpen(false)} title="Remove Duplicates">
          <div style={{ display: 'grid', gap: '14px' }}>
            <p style={{ margin: 0, color: 'var(--ink-3)' }}>Choose which columns to check for duplicates.</p>
            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={checkboxLabelStyle}><input type="checkbox" defaultChecked /> Column A</label>
              <label style={checkboxLabelStyle}><input type="checkbox" defaultChecked /> Column B</label>
            </div>
            <p style={{ margin: 0, color: 'var(--ink-3)' }}>0 duplicates found.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setRemoveDuplicatesOpen(false)} style={buttonPrimaryStyle}>Cancel</button>
              <button type="button" onClick={() => { showToast('Duplicate rows removed'); setRemoveDuplicatesOpen(false); }} style={{ ...buttonPrimaryStyle, background: 'var(--ink)', color: 'white' }}>Remove</button>
            </div>
          </div>
        </Modal>
      )}

      {dataValidationOpen && (
        <Modal isOpen={dataValidationOpen} onClose={() => setDataValidationOpen(false)} title="Data Validation">
          <div style={{ display: 'grid', gap: '14px' }}>
            <label style={{ fontSize: '13px', color: 'var(--ink)' }}>Allow</label>
            <select style={selectStyle}>
              <option>Any</option>
              <option>Whole number</option>
              <option>Decimal</option>
              <option>List</option>
              <option>Date</option>
              <option>Text length</option>
            </select>
            <label style={{ fontSize: '13px', color: 'var(--ink)' }}>Criteria</label>
            <select style={selectStyle}>
              <option>between</option>
              <option>not between</option>
              <option>equal to</option>
            </select>
            <label style={{ fontSize: '13px', color: 'var(--ink)' }}>Error alert</label>
            <input type="text" placeholder="Message for invalid data" style={selectStyle} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setDataValidationOpen(false)} style={buttonPrimaryStyle}>Cancel</button>
              <button type="button" onClick={() => { showToast('Data validation applied'); setDataValidationOpen(false); }} style={{ ...buttonPrimaryStyle, background: 'var(--ink)', color: 'white' }}>Apply</button>
            </div>
          </div>
        </Modal>
      )}

      {nameManagerOpen && (
        <Modal isOpen={nameManagerOpen} onClose={() => setNameManagerOpen(false)} title="Name Manager">
          <div style={{ display: 'grid', gap: '14px' }}>
            {namedRanges.map((range) => (
              <div key={range.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--ivory-3)', background: 'var(--ivory-2)' }}>
                <span>{range.name}</span>
                <span style={{ color: 'var(--ink-3)' }}>{range.range}</span>
              </div>
            ))}
            <button type="button" onClick={() => setNameManagerOpen(false)} style={{ ...buttonPrimaryStyle, width: '100%' }}>Close</button>
          </div>
        </Modal>
      )}

      {defineNameOpen && (
        <Modal isOpen={defineNameOpen} onClose={() => setDefineNameOpen(false)} title="Define Name">
          <div style={{ display: 'grid', gap: '14px' }}>
            <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: 'var(--ink)' }}>
              Name
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} style={selectStyle} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setDefineNameOpen(false)} style={buttonPrimaryStyle}>Cancel</button>
              <button type="button" onClick={handleSaveName} style={{ ...buttonPrimaryStyle, background: 'var(--ink)', color: 'white' }}>Define</button>
            </div>
          </div>
        </Modal>
      )}

      {protectOpen && (
        <Modal isOpen={protectOpen} onClose={() => setProtectOpen(false)} title="Protect Sheet">
          <div style={{ display: 'grid', gap: '14px' }}>
            <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: 'var(--ink)' }}>
              Password (optional)
              <input type="password" style={selectStyle} />
            </label>
            <div style={checkboxGridStyle}>
              {['Select locked cells', 'Select unlocked cells', 'Format cells', 'Insert rows', 'Delete rows', 'Sort', 'Filter'].map((option) => (
                <label key={option} style={checkboxLabelStyle}><input type="checkbox" defaultChecked /> {option}</label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setProtectOpen(false)} style={buttonPrimaryStyle}>Cancel</button>
              <button type="button" onClick={() => { showToast('Sheet protected'); setProtectOpen(false); }} style={{ ...buttonPrimaryStyle, background: 'var(--ink)', color: 'white' }}>Protect</button>
            </div>
          </div>
        </Modal>
      )}

      {errorPanelOpen && (
        <div style={{ position: 'fixed', top: '90px', right: '24px', width: '320px', maxHeight: '420px', overflowY: 'auto', borderRadius: '18px', background: 'white', border: '1px solid var(--ivory-3)', boxShadow: '0 24px 60px rgba(0,0,0,0.12)', zIndex: 60, padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--ink)' }}>Formula Errors</h4>
            <button type="button" onClick={() => setErrorPanelOpen(false)} style={{ border: 'none', background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer' }}>Close</button>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ padding: '12px', borderRadius: '14px', background: 'var(--ivory-2)', color: 'var(--ink-3)' }}>No error cells found in the current sheet.</div>
          </div>
        </div>
      )}

      {drawMode && (
        <div
          style={{
            position: 'fixed', inset: 0,
            zIndex: 50,
            pointerEvents: 'auto',
            cursor: 'crosshair',
            background: 'rgba(255,255,255,0.04)',
          }}
          onPointerDown={startStroke}
          onPointerMove={moveStroke}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
        >
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          <div style={{ position: 'fixed', bottom: '24px', left: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap', maxWidth: 'calc(100% - 48px)', zIndex: 60 }}>
            <button type="button" onClick={toggleDrawMode} style={buttonPrimaryStyle}>Exit Draw</button>
            <button type="button" onClick={() => setDrawTool('pen')} style={buttonPrimaryStyle}>Pen</button>
            <button type="button" onClick={() => setDrawTool('highlighter')} style={buttonPrimaryStyle}>Highlighter</button>
            <button type="button" onClick={() => setDrawTool('eraser')} style={buttonPrimaryStyle}>Eraser</button>
            <button type="button" onClick={undoDraw} style={buttonPrimaryStyle}>Undo Draw</button>
            <button type="button" onClick={clearDraw} style={buttonPrimaryStyle}>Clear All</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '9px 12px',
      borderRadius: '8px',
      fontSize: '11px',
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      color: 'var(--ink-2)',
      border: '1px solid var(--ivory-3)',
      background: 'white',
      cursor: 'pointer',
    }}
  >
    <Icon size={13} />
    {label}
  </button>
);

const IconButton = ({ icon: Icon, title }) => (
  <button
    type="button"
    title={title}
    style={{
      width: '34px',
      height: '34px',
      display: 'grid',
      placeItems: 'center',
      borderRadius: '8px',
      color: 'var(--ink-3)',
      background: 'transparent',
      border: '1px solid transparent',
      cursor: 'pointer',
    }}
  >
    <Icon size={15} />
  </button>
);

export default Toolbar;
