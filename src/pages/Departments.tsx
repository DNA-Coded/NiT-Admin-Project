import { useState, useEffect } from 'react';
import { useDepartments } from '@/features/departments/hooks/useDepartments';
import { DepartmentSummaryCards } from '@/features/departments/components/DepartmentSummaryCards';
import { DepartmentTable } from '@/features/departments/components/DepartmentTable';
import { DepartmentDrawer } from '@/features/departments/components/DepartmentDrawer';
import { AddDepartmentDialog } from '@/features/departments/components/AddDepartmentDialog';
import { EditDepartmentDialog } from '@/features/departments/components/EditDepartmentDialog';
import { StatePlaceholder } from '@/components/shared/StatePlaceholder';

export default function Departments() {
  const {
    departments,
    meta,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    setPage,
    isMutating,
    createDepartment,
    updateDepartment,
    removeDepartment,
    recoverDepartment,
    refetch,
  } = useDepartments();

  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Initial fetch
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedDept = departments.find(d => d.id === selectedDeptId) || null;

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
            onClick={() => refetch()}
            disabled={loading || isMutating}
            className="px-4 py-2 border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md rounded transition-colors disabled:opacity-50"
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
            placeholder="Search departments by name or code..."
          />
        </div>
        <div className="font-label-sm text-label-sm text-on-surface-variant font-medium">
          {meta ? `Showing ${departments.length} of ${meta.total} departments` : `Showing ${departments.length} departments`}
        </div>
      </div>

      {/* Main Table view */}
      {loading && departments.length === 0 ? (
        <div className="py-20 flex justify-center items-center bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : error && departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          <StatePlaceholder
            state="error"
            errorMessage={error}
            onRetry={() => refetch()}
          />
        </div>
      ) : departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          <StatePlaceholder 
            state="empty"
            emptyMessage={searchQuery ? "No departments match your query. Try modifying your search." : "No departments found."}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 px-4 py-2 border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md rounded transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <DepartmentTable 
            departments={departments} 
            onSelectDepartment={(dept) => setSelectedDeptId(dept.id)}
          />

          {/* Pagination Controls */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-between items-center bg-surface-container-lowest p-4 border border-outline-variant rounded-xl">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!meta.hasPrevPage || loading}
                className="px-4 py-2 border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md rounded transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!meta.hasNextPage || loading}
                className="px-4 py-2 border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md rounded transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detailed Side Panel */}
      <DepartmentDrawer 
        department={selectedDept}
        onClose={() => setSelectedDeptId(null)}
        onEditClick={() => setIsEditOpen(true)}
        onDelete={async (id) => {
          await removeDepartment(id);
        }}
        onRestore={async (id) => {
          await recoverDepartment(id);
        }}
        isMutating={isMutating}
      />

      {/* Add Dialog Modal */}
      <AddDepartmentDialog 
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={createDepartment}
      />

      {/* Edit Dialog Modal */}
      <EditDepartmentDialog 
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        department={selectedDept}
        onEdit={updateDepartment}
      />
    </div>
  );
}
