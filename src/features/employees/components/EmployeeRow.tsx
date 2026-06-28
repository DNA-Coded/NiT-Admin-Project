import React from 'react';
import type { Employee } from '@/types/employees';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';

interface EmployeeRowProps {
  employee: Employee;
  onSelect: (employee: Employee) => void;
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({ employee, onSelect }) => {
  // Helper to extract initials for avatar placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <tr 
      onClick={() => onSelect(employee)}
      className="hover:bg-surface-container-lowest/50 transition-colors group cursor-pointer"
    >
      {/* Name and Email */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-md font-bold text-sm shrink-0">
            {getInitials(employee.name)}
          </div>
          <div className="overflow-hidden">
            <p className="font-body-md text-body-md font-medium text-on-surface truncate">{employee.name}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{employee.email}</p>
          </div>
        </div>
      </td>

      {/* Employee ID */}
      <td className="py-3 px-4 font-body-sm text-body-sm text-on-surface whitespace-nowrap">
        {employee.id}
      </td>

      {/* Department */}
      <td className="py-3 px-4 font-body-sm text-body-sm text-on-surface whitespace-nowrap">
        {employee.department}
      </td>

      {/* Designation */}
      <td className="py-3 px-4 font-body-sm text-body-sm text-on-surface whitespace-nowrap">
        {employee.designation}
      </td>

      {/* Employment Type */}
      <td className="py-3 px-4 font-body-sm text-body-sm text-on-surface whitespace-nowrap">
        {employee.employmentType}
      </td>

      {/* Status */}
      <td className="py-3 px-4 whitespace-nowrap">
        <EmployeeStatusBadge status={employee.status} />
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <button 
          aria-label={`View actions for ${employee.name}`}
          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      </td>
    </tr>
  );
};
