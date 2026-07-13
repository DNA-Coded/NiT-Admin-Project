import React, { useState } from 'react';

export const ExportMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format: string) => {
    alert(`Exporting attendance records in ${format} format... (Simulated Action)`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Export options"
        className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-label-md font-label-md text-on-surface hover:bg-surface-container transition-colors shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-symbols-outlined text-[18px]">download</span>
        Export
      </button>

      {isOpen && (
        <>
          {/* Backdrop for closing */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown Card */}
          <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-50 py-1 overflow-hidden">
            <button
              className="w-full text-left px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors"
              onClick={() => handleExport('Excel')}
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
            <button
              className="w-full text-left px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors"
              onClick={() => handleExport('Printer')}
            >
              <span className="material-symbols-outlined text-[18px] text-primary">print</span>
              Print Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};
