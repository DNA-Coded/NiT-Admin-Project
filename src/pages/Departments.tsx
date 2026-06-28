import { useState } from 'react';
import type { Department } from '@/types/departments';
import { mockDepartments } from '@/mocks/departments';
import { DepartmentSummaryCards } from '@/features/departments/components/DepartmentSummaryCards';
import { DepartmentTable } from '@/features/departments/components/DepartmentTable';
import { DepartmentDrawer } from '@/features/departments/components/DepartmentDrawer';
import { AddDepartmentDialog } from '@/features/departments/components/AddDepartmentDialog';
import { StatePlaceholder } from '@/components/shared/StatePlaceholder';

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // States to satisfy mandatory UI requirements
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter departments based on search query
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.hodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = (newDept: Omit<Department, 'id' | 'staffCount' | 'deviceCount' | 'attendanceRate'>) => {
    const created: Department = {
      ...newDept,
      id: `dept-${Date.now()}`,
      staffCount: 0,
      deviceCount: 0,
      attendanceRate: 100.0,
    };
    setDepartments((prev) => [created, ...prev]);
  };

  const triggerError = () => {
    setError('Failed to fetch departments. Please try again.');
  };

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
        <StatePlaceholder
          state="error"
          errorMessage={error}
        />
        <button
          onClick={() => setError(null)}
          className="mt-2 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors font-label-md text-label-md shadow-sm"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">Departments Management</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Configure institutional sections, view staff allocations, and manage hardware rules.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={triggerError}
            className="px-4 py-2 border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md rounded transition-colors"
          >
            Simulate Error
          </button>
          <button 
            onClick={triggerLoading}
            className="px-4 py-2 border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md rounded transition-colors"
          >
            Reload Grid
          </button>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-2 px-4 rounded transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Department
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <DepartmentSummaryCards departments={departments} />

      {/* Search & Actions Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-sm">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-sm text-body-sm transition-all"
            placeholder="Search departments by name, code or HOD..."
          />
        </div>
        <div className="font-label-sm text-label-sm text-on-surface-variant font-medium">
          Showing {filteredDepartments.length} of {departments.length} departments
        </div>
      </div>

      {/* Main Table view */}
      {filteredDepartments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          <StatePlaceholder 
            state="empty"
            emptyMessage="No departments match your query. Try modifying your search."
          />
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 px-4 py-2 border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md rounded transition-colors"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <DepartmentTable 
          departments={filteredDepartments} 
          onSelectDepartment={(dept) => setSelectedDept(dept)}
        />
      )}

      {/* Detailed Side Panel */}
      <DepartmentDrawer 
        department={selectedDept}
        onClose={() => setSelectedDept(null)}
      />

      {/* Add Dialog Modal */}
      <AddDepartmentDialog 
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddDepartment}
      />
    </div>
  );
}

