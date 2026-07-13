import type { Department } from '@/types/departments';

interface DepartmentDrawerProps {
  department: Department | null;
  onClose: () => void;
  onEditClick: () => void;
}

export function DepartmentDrawer({ department, onClose, onEditClick }: DepartmentDrawerProps) {
  if (!department) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 flex flex-col transition-transform duration-300 animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div>
            <span className="text-label-sm font-label-sm text-primary uppercase tracking-wider">Department Details</span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary mt-1">{department.name}</h2>
          </div>
          <button 
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant">
              <span className="font-label-xs text-label-xs text-on-surface-variant">Dept Code</span>
              <p className="font-body-md text-body-md font-semibold text-primary mt-1">{department.code}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant">
              <span className="font-label-xs text-label-xs text-on-surface-variant">Office Location</span>
              <p className="font-body-md text-body-md font-semibold text-primary mt-1">{department.officeLocation || 'Main Campus'}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant">
              <span className="font-label-xs text-label-xs text-on-surface-variant">Head of Dept (HOD)</span>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface mt-1">{department.hodName}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant">
              <span className="font-label-xs text-label-xs text-on-surface-variant">Budget Code</span>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface mt-1">{department.budgetCode || 'N/A'}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-label-md text-label-md font-semibold text-primary mb-2">Description</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-lg border border-outline-variant">
              {department.description || 'No description provided for this department.'}
            </p>
          </div>

          {/* Statistics Strip */}
          <div className="bg-primary/5 rounded-xl border border-primary/10 p-5 grid grid-cols-3 text-center">
            <div>
              <span className="font-label-xs text-label-xs text-primary uppercase">Staff Assigned</span>
              <p className="font-headline-sm text-headline-sm font-bold text-primary mt-1">{department.staffCount}</p>
            </div>
            <div className="border-x border-outline-variant">
              <span className="font-label-xs text-label-xs text-primary uppercase">Devices</span>
              <p className="font-headline-sm text-headline-sm font-bold text-primary mt-1">{department.deviceCount}</p>
            </div>
            <div>
              <span className="font-label-xs text-label-xs text-primary uppercase">Attendance Rate</span>
              <p className="font-headline-sm text-headline-sm font-bold text-primary mt-1">{department.attendanceRate}%</p>
            </div>
          </div>

          {/* Biometric Integration Log */}
          <div>
            <h3 className="font-label-md text-label-md font-semibold text-primary mb-2">Hardware & Hardware Rules</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 border border-outline-variant rounded-lg bg-surface-container-lowest">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-sm">router</span>
                  <span className="font-body-sm text-body-sm font-semibold">Primary Biometric Device</span>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">
                  ONLINE
                </span>
              </div>
              <div className="flex justify-between items-center p-3 border border-outline-variant rounded-lg bg-surface-container-lowest">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-sm">schedule</span>
                  <span className="font-body-sm text-body-sm font-semibold">Shift Settings</span>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">
                  General Academic Shift
                </span>
              </div>
            </div>
          </div>

          {/* Future Backend Integration Warning */}
          <div className="bg-surface-container-high border border-outline-variant rounded-lg p-4">
            <span className="font-label-xs text-label-xs font-semibold text-on-surface flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-sm text-amber-600">info</span>
              Future API Integration
            </span>
            <p className="font-body-xs text-body-xs text-on-surface-variant leading-relaxed">
              When connected to the backend, administrators will be able to edit specific parameters, update department members directly, sync rules to hardware endpoints, and review custom attendance patterns.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3">
          <button 
            className="border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md py-2 px-4 rounded transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-2 px-4 rounded transition-colors shadow-sm"
            onClick={onEditClick}
          >
            Edit Department
          </button>
        </div>
      </div>
    </>
  );
}
