import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import useSpreadsheetStore from '../../store/spreadsheetStore';

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

  useEffect(() => {
    startAutoSave();
    return () => stopAutoSave();
  }, [startAutoSave, stopAutoSave]);

  const handleChange = useCallback(
    (data) => {
      setSheetData(data);
    },
    [setSheetData]
  );

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
      style={{
        width: '100%',
        height: 'calc(100vh - 16rem)',
        minHeight: '600px',
        background: 'white',
        border: '1px solid var(--ivory-3)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(28, 26, 23, 0.06)',
      }}
    >
      <div
        className="fortune-sheet-container"
        style={{ width: '100%', height: '100%', minHeight: '600px', overflow: 'hidden' }}
      >
        <Workbook
          data={sheetSettings}
          onChange={handleChange}
          onCellSelect={handleCellSelect}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '600px',
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
    </div>
  );
};

export default SpreadsheetGrid;
