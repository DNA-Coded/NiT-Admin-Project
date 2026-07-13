import { useState } from 'react';
import type { Department } from '@/types/departments';

interface AddDepartmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (dept: Omit<Department, 'id' | 'staffCount' | 'deviceCount' | 'attendanceRate'>) => void;
}

export function AddDepartmentDialog({ isOpen, onClose, onAdd }: AddDepartmentDialogProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [hodName, setHodName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !hodName) return;

    onAdd({
      name,
      code,
      hodName,
      officeLocation: location,
      description,
    });

    // Reset Form
    setName('');
    setCode('');
    setHodName('');
    setLocation('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog Body */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl max-w-lg w-full relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Add New Department</h2>
          <button 
            className="p-1 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 font-medium">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all"
              placeholder="e.g. Computer Science & Engineering"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 font-medium">
                Department Code <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all"
                placeholder="e.g. CSE"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 font-medium">
                Head of Department (HOD) <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={hodName}
                onChange={(e) => setHodName(e.target.value)}
                className="w-full px-3.5 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all"
                placeholder="e.g. Dr. Soumen Mukherjee"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 font-medium">
              Office Location
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all"
              placeholder="e.g. Block A, 3rd Floor"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 font-medium">
              Description
            </label>
            <textarea 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all resize-none"
              placeholder="Brief summary of department activities..."
            />
          </div>

          {/* Alert */}
          <div className="bg-surface-container-high border border-outline-variant rounded p-3 text-xs text-on-surface-variant leading-relaxed">
            Note: Adding a department here creates a temporary local entry. Permanent storage will be enabled upon future backend integration.
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
            <button 
              type="button"
              className="border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md py-2 px-4 rounded transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-2 px-4 rounded transition-colors shadow-sm"
            >
              Save Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
