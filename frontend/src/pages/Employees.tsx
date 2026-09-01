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
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);

  // Fetch departments for dropdown usage safely
  useEffect(() => {
    let isMounted = true;
    departmentsService.getDepartments({ limit: 100, isActive: 'true' })
      .then((res) => {
        if (isMounted) {
          setDepartments((res.departments || []).map((d) => ({ id: d.id, name: d.name })));
        }
      })
      .catch((err) => {
        console.error('Failed to load departments drop list context:', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Synchronize drawer reference states if items update via background polling/mutations
  useEffect(() => {
    if (selectedEmployee) {
      const updated = employees.find((e) => e.id === selectedEmployee.id);
      if (updated) {
        setSelectedEmployee(updated);
      }
    }
  }, [employees, selectedEmployee]);

  // Extract designations based on active dataset safely
  const uniqueDesignations = useMemo(() => {
    return Array.from(new Set(employees.map((emp) => emp.designation))).filter(Boolean).sort();
  }, [employees]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Crucial: Reset to page 1 on filter modifications to avoid empty-page locks
  };

  const handleReset = () => {
    setFilters({
      search: '',
      department: '',
      designation: '',
      employmentType: '',
      status: '',
      isActive: '',
      isHOD: '',
    });
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeEmployee(id);
      // Close side panel view elegantly if the active record was deleted
      if (selectedEmployee?.id === id) {
        setSelectedEmployee(null);
      }
    } catch (err) {
      console.error('Failed to eliminate employee reference record:', err);
    }
  };

  const handleRestore = async (id: string) => {
    await recoverEmployee(id);
  };

  const handleActionEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditOpen(true);
  };

  const handleToggleStatus = async (employee: Employee) => {
    const nextStatus = employee.status === 'ACTIVE' ? 'LEAVE' : 'ACTIVE';
    try {
      await updateEmployee(employee.id, { status: nextStatus });
    } catch (err) {
      console.error('Failed to quick-toggle employee operational status', err);
    }
  };

  const handleEditDialogClose = () => {
    setIsEditOpen(false);
    // Only clear selection target if the profile details drawer isn't keeping it open
    if (!employees.some(e => e.id === selectedEmployee?.id)) {
      setSelectedEmployee(null);
    }
  };

  // Compute view state matrix securely
  let currentViewState: ViewState = 'success';
  if (loading && employees.length === 0) currentViewState = 'loading';
  else if (error) currentViewState = 'error';
  else if (employees.length === 0) currentViewState = 'empty';

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-120px)] animate-fade-in">
      {/* Page Header Layout block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-headline-lg font-bold text-on-surface">Employee Directory</h2>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Manage, filter, and view all registered academic and administrative staff. {meta?.totalCount ? `(${meta.totalCount} total)` : ''}
          </p>
        </div>
        <div className="flex gap-3 self-start md:self-auto shrink-0">
          <ExportMenu 
            onExport={(format) => exportData('EMPLOYEE', format, filters)} 
            isExporting={isExporting} 
          />
          <button
            aria-label="Add new employee profile"
            className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
            onClick={() => setIsAddOpen(true)}
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add Employee
          </button>
        </div>
      </div>

      {exportError && (
        <div className="mb-4 p-4 bg-error-container border border-outline-variant text-on-error-container rounded-lg text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          Failed to process file export compilation: {exportError.message}
        </div>
      )}

      <FilterBar
        filters={filters}
        designations={uniqueDesignations}
        departments={departments}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <div className="flex-1 mt-4">
        <EmployeeTable
          employees={employees}
          viewState={currentViewState}
          onSelectEmployee={setSelectedEmployee}
          currentPage={page}
          totalPages={meta?.totalPages || 1}
          totalEntries={meta?.totalCount || 0}
          onPageChange={setPage}
          loading={loading}
          onEditEmployee={handleActionEdit}
          onDeleteEmployee={(emp) => handleDelete(emp.id)}
          onToggleEmployeeStatus={handleToggleStatus}
        />
      </div>

      <EmployeeDrawer
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onEditClick={() => setIsEditOpen(true)}
        onDelete={handleDelete}
        onRestore={handleRestore}
        isMutating={isMutating}
      />

      <AddEmployeeDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={createEmployee}
        departments={departments}
      />

      <EditEmployeeDialog
        isOpen={isEditOpen}
        onClose={handleEditDialogClose}
        employee={selectedEmployee}
        onEdit={updateEmployee}
        departments={departments}
      />
    </div>
  );
}