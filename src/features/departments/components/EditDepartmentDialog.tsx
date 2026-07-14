import { useState, useEffect } from 'react';
import type { Department } from '@/types/departments';

interface EditDepartmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  onEdit: (id: string, dept: { name?: string; code?: string; description?: string }) => Promise<void>;
}

export function EditDepartmentDialog({ isOpen, onClose, department, onEdit }: EditDepartmentDialogProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [hodName, setHodName] = useState(''); // Kept for UI
  const [location, setLocation] = useState(''); // Kept for UI
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (department) {
      setName(department.name);
      setCode(department.code);
      setHodName(department.hodName || '');
      setLocation(department.officeLocation || '');
      setDescription(department.description || '');
      setError(null);
    }
  }, [department]);

  if (!isOpen || !department) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onEdit(department.id, {
        name,
        code,
        description,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Dialog Body */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl max-w-lg w-full relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Edit Department</h2>
          <button 
            type="button"
            className="p-1 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors disabled:opacity-50"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 font-medium">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required
              disabled={isSubmitting}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all disabled:opacity-50"
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
                disabled={isSubmitting}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all disabled:opacity-50"
                placeholder="e.g. CSE"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 font-medium">
                Head of Department (HOD)
              </label>
              <input 
                type="text" 
                disabled={isSubmitting}
                value={hodName}
                onChange={(e) => setHodName(e.target.value)}
                className="w-full px-3.5 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all disabled:opacity-50"
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
              disabled={isSubmitting}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all disabled:opacity-50"
              placeholder="e.g. Block A, 3rd Floor"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 font-medium">
              Description
            </label>
            <textarea 
              rows={3}
              disabled={isSubmitting}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all resize-none disabled:opacity-50"
              placeholder="Brief summary of department activities..."
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
            <button 
              type="button"
              disabled={isSubmitting}
              className="border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md py-2 px-4 rounded transition-colors disabled:opacity-50"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-2 px-4 rounded transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
