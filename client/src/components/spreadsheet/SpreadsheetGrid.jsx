import { useEffect, useRef, useState, useCallback } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import useSpreadsheetStore from '../../store/spreadsheetStore';

/**
 * Spreadsheet grid — wraps FortuneSheet with dark theme overrides,
 * cell selection tracking, and auto-save integration.
 */
const SpreadsheetGrid = ({ onCellSelect }) => {
  const containerRef = useRef(null);
  const { setSheetData, setSelectedCell, startAutoSave, stopAutoSave } = useSpreadsheetStore();
  const [sheetSettings] = useState([
    {
      name: 'Sheet1',
      color: '',
      status: 1,
      order: 0,
      celldata: [],
      row: 50,
      column: 26,
    },
  ]);

  // Start auto-save on mount, stop on unmount
  useEffect(() => {
    startAutoSave();
    return () => stopAutoSave();
  }, [startAutoSave, stopAutoSave]);

  /**
   * Handle cell changes — mark data as dirty for auto-save.
   */
  const handleChange = useCallback(
    (data) => {
      setSheetData(data);
    },
    [setSheetData]
  );

  /**
   * Handle cell selection — track for formula bar and search icon.
   */
  const handleCellSelect = useCallback(
    (cell, position) => {
      if (cell) {
        const row = position?.row ?? 0;
        const col = position?.column ?? 0;
        const value = cell?.v ?? '';
        const formula = cell?.f ?? '';

        setSelectedCell({ row, col }, value, formula);

        if (onCellSelect) {
          onCellSelect({ row, col, value, formula, cell });
        }
      }
    },
    [setSelectedCell, onCellSelect]
  );

  return (
    <div
      ref={containerRef}
      className="w-full fortune-sheet-container"
      style={{
        width: '100%',
        height: 'calc(100vh - 13rem)',
        minHeight: '560px',
        background: 'white',
        isolation: 'isolate',
        overflow: 'hidden',
      }}
    >
      <Workbook
        data={sheetSettings}
        onChange={handleChange}
        onCellSelect={handleCellSelect}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '560px',
        }}
        options={{
          showToolbar: false,
          showFormulaBar: false,
          showSheetTabs: true,
          showinfobar: false,
          showstatisticBar: false,
          lang: 'en',
          column: 26,
          row: 50,
          toolbarItems: [],
        }}
      />
    </div>
  );
};

export default SpreadsheetGrid;
