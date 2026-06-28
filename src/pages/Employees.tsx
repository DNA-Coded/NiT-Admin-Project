import { useEffect, useState } from 'react';
import { mockEmployees } from '@/mocks';
import type { Employee, FilterState } from '@/types/employees';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { FilterBar } from '@/features/employees/components/FilterBar';
import { EmployeeTable } from '@/features/employees/components/EmployeeTable';
import { EmployeeDrawer } from '@/features/employees/components/EmployeeDrawer';
import { AddEmployeeDialog } from '@/features/employees/components/AddEmployeeDialog';

const initialFilters: FilterState = {
  search: '',
  department: '',
  designation: '',
  employmentType: '',
  status: '',
};

export default function Employees() {
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Extract unique designations dynamically from mock data for filters
  const uniqueDesignations = Array.from(
    new Set(mockEmployees.map((emp) => emp.designation))
  ).sort();

  // Simulate network loading on initial load & when filters change
  useEffect(() => {
    setViewState('loading');
    const timer = setTimeout(() => {
      setViewState('success');
    }, 450);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  // Filtering logic
  const filteredEmployees = mockEmployees.filter((emp) => {
    // Search filter
    const matchesSearch =
      filters.search === '' ||
      emp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      emp.id.toLowerCase().includes(filters.search.toLowerCase());

    // Department filter
    const matchesDept =
      filters.department === '' || emp.department === filters.department;

    // Designation filter
    const matchesDesig =
      filters.designation === '' || emp.designation === filters.designation;

    // Employment type filter
    const matchesType =
      filters.employmentType === '' || emp.employmentType === filters.employmentType;

    // Status filter
    const matchesStatus =
      filters.status === '' || emp.status === filters.status;

    return matchesSearch && matchesDept && matchesDesig && matchesType && matchesStatus;
  });

  // Determine current page state
  const currentViewState =
    viewState === 'success' && filteredEmployees.length === 0
      ? 'empty'
      : viewState;

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-120px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Employee Directory</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Manage, filter, and view all registered academic and administrative staff. ({mockEmployees.length} total)
          </p>
        </div>
        <button
          aria-label="Add new employee"
          className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm self-start md:self-auto shrink-0"
          onClick={() => setIsAddOpen(true)}
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add Employee
        </button>
      </div>

      {/* Advanced Filters */}
      <FilterBar
        filters={filters}
        designations={uniqueDesignations}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Employee Data Table */}
      <div className="flex-1">
        <EmployeeTable
          employees={filteredEmployees}
          viewState={currentViewState}
          onSelectEmployee={setSelectedEmployee}
        />
      </div>

      {/* Detailed drawer profile view */}
      <EmployeeDrawer
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

      {/* Add Employee Form Dialog */}
      <AddEmployeeDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}
