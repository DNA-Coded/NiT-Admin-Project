import React, { useState, useRef, useEffect } from 'react';
import type { ExportFormat } from '@/features/exports/services/export.service';

interface ExportMenuProps {
  onExport: (format: ExportFormat) => void;
  isExporting?: boolean;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ onExport, isExporting = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleExport = (format: ExportFormat) => {
    if (!isExporting) {
      onExport(format);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Export options"
        className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-label-md font-label-md text-on-surface hover:bg-surface-container transition-colors shadow-sm disabled:opacity-60"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
      >
        {isExporting ? (
          <div className="w-[18px] h-[18px] border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <span className="material-symbols-outlined text-[18px]">download</span>
        )}
        {isExporting ? 'Exporting...' : 'Export'}
      </button>

      {isOpen && !isExporting && (
        <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-50 py-1 overflow-hidden">
          <button
            className="w-full text-left px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors"
            onClick={() => handleExport('CSV')}
          >
            <span className="material-symbols-outlined text-[18px] text-gray-600">csv</span>
            Export CSV
          </button>
          <button
            className="w-full text-left px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors"
            onClick={() => handleExport('XLSX')}
          >
            <span className="material-symbols-outlined text-[18px] text-[#16a34a]">description</span>
            Export Excel
          </button>
          <button
            className="w-full text-left px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors"
            onClick={() => handleExport('PDF')}
          >
            <span className="material-symbols-outlined text-[18px] text-[#dc2626]">picture_as_pdf</span>
            Export PDF
          </button>
        </div>
      )}
    </div>
  );
};
