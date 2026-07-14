import { useEffect, useState, useMemo } from 'react';
import type { Employee } from '@/types/employees';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { FilterBar } from '@/features/employees/components/FilterBar';
import { EmployeeTable } from '@/features/employees/components/EmployeeTable';
import { EmployeeDrawer } from '@/features/employees/components/EmployeeDrawer';
import { AddEmployeeDialog } from '@/features/employees/components/AddEmployeeDialog';
import { EditEmployeeDialog } from '@/features/employees/components/EditEmployeeDialog';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { departmentsService } from '@/features/departments/services/departments.service';
import { ExportMenu } from '@/components/shared/ExportMenu';
import { useExport } from '@/features/exports/hooks/useExport';

export default function Employees() {
  const {
    employees,
    meta,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    isMutating,
    createEmployee,
    updateEmployee,
    removeEmployee,
    recoverEmployee,
  } = useEmployees();

  const { exportData, isExporting, error: exportError } = useExport();

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Departments for dropdowns
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Fetch departments for dropdowns
    departmentsService.getDepartments({ limit: 100, isActive: 'true' })
      .then((res) => {
        setDepartments(res.data.map(d => ({ id: d.id, name: d.name })));
      })
      .catch(() => {
        console.error('Failed to load departments');
      });
  }, []);

  useEffect(() => {
    // Refresh selected employee data if mutated
    if (selectedEmployee) {
      const updated = employees.find((e) => e.id === selectedEmployee.id);
      if (updated) setSelectedEmployee(updated);
    }
  }, [employees, selectedEmployee]);

  // Extract unique designations (in a real app, this might come from a separate API)
  const uniqueDesignations = useMemo(() => {
    return Array.from(new Set(employees.map((emp) => emp.designation))).sort();
  }, [employees]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      department: '',
      designation: '',
      employmentType: '',
      status: '',
      isActive: '',
    });
  };

  const handleDelete = async (id: string) => {
    await removeEmployee(id);
  };

  const handleRestore = async (id: string) => {
    await recoverEmployee(id);
  };

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  // Determine current page state
  let currentViewState: ViewState = 'success';
  if (loading && employees.length === 0) currentViewState = 'loading';
  else if (error) currentViewState = 'error';
  else if (employees.length === 0) currentViewState = 'empty';

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-120px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Employee Directory</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Manage, filter, and view all registered academic and administrative staff. {meta?.total ? `(${meta.total} total)` : ''}
          </p>
        </div>
        <div className="flex gap-3 self-start md:self-auto shrink-0">
          <ExportMenu 
            onExport={(format) => exportData('FACULTY', format, filters)} 
            isExporting={isExporting} 
          />
          <button
            aria-label="Add new employee"
            className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm"
            onClick={() => setIsAddOpen(true)}
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add Employee
          </button>
        </div>
      </div>

      {exportError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
          Failed to export: {exportError.message}
        </div>
      )}

      {/* Advanced Filters */}
      <FilterBar
        filters={filters}
        designations={uniqueDesignations}
        departments={departments}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Employee Data Table */}
      <div className="flex-1">
        <EmployeeTable
          employees={employees}
          viewState={currentViewState}
          onSelectEmployee={setSelectedEmployee}
          currentPage={page}
          totalPages={meta?.totalPages || 1}
          totalEntries={meta?.total || 0}
          onPageChange={setPage}
          loading={loading}
        />
      </div>

      {/* Detailed drawer profile view */}
      <EmployeeDrawer
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onEditClick={handleEditClick}
        onDelete={handleDelete}
        onRestore={handleRestore}
        isMutating={isMutating}
      />

      {/* Add Employee Form Dialog */}
      <AddEmployeeDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={createEmployee}
        departments={departments}
      />

      {/* Edit Employee Form Dialog */}
      <EditEmployeeDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        employee={selectedEmployee}
        onEdit={updateEmployee}
        departments={departments}
      />
    </div>
  );
}
