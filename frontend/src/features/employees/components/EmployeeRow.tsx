import React, { useState, useRef, useEffect } from 'react';
import type { Employee } from '@/types/employees';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';

interface EmployeeRowProps {
  employee: Employee;
  onSelect: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onToggleStatus?: (employee: Employee) => void;
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({ 
  employee, 
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus 
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Close the menu automatically if the user clicks anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Recalculate positions dynamically relative to the active viewport
  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          // Fixed positioning requires absolute viewport coordinates directly
          top: rect.bottom + 4,
          left: rect.right - 176, // 176px matches the w-44 dropdown width boundary
        });
      }
    };

    if (menuOpen) {
      updatePosition();
      // Listen to scroll and resize events globally to prevent detached floating states
      window.addEventListener('scroll', updatePosition, { capture: true });
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, { capture: true });
      window.removeEventListener('resize', updatePosition);
    };
  }, [menuOpen]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const departmentName = 
    employee.department && typeof employee.department === 'object'
      ? employee.department.name
      : employee.department || 'N/A';

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
        {employee.employeeId}
      </td>

      {/* Department */}
      <td className="py-3 px-4 font-body-sm text-body-sm text-on-surface whitespace-nowrap">
        {departmentName}
      </td>

      {/* Designation */}
      <td className="py-3 px-4 font-body-sm text-body-sm text-on-surface whitespace-nowrap">
        {employee.designation}
      </td>

      {/* Role / HOD Badge */}
      <td className="py-3 px-4 whitespace-nowrap">
        {employee.isHOD ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-error-container text-on-error-container border border-error/20 shadow-sm">
            HOD
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant">
            Faculty
          </span>
        )}
      </td>

      {/* Employment Type */}
      <td className="py-3 px-4 font-body-sm text-body-sm text-on-surface whitespace-nowrap">
        {employee.employmentType}
      </td>

      {/* Status */}
      <td className="py-3 px-4 whitespace-nowrap">
        <EmployeeStatusBadge status={employee.status} />
      </td>

      {/* Actions Segment */}
      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <button 
          ref={triggerRef}
          aria-label={`View actions for ${employee.name}`}
          aria-expanded={menuOpen}
          className={`p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-all duration-150 ${
            menuOpen ? 'opacity-100 bg-surface-container text-primary' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>

        {/* Action Dropdown Menu Container */}
        {menuOpen && (
          <div 
            ref={menuRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="w-44 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-[9999] py-1 text-left animate-fade-in divide-y divide-outline-variant"
          >
            <div className="py-1">
              <button
                className="w-full px-4 py-2 text-body-sm font-medium text-on-surface hover:bg-surface-container flex items-center gap-2 transition-colors duration-150"
                onClick={() => { setMenuOpen(false); onEdit?.(employee); }}
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Profile
              </button>
              <button
                className="w-full px-4 py-2 text-body-sm font-medium text-on-surface hover:bg-surface-container flex items-center gap-2 transition-colors duration-150"
                onClick={() => { setMenuOpen(false); onToggleStatus?.(employee); }}
              >
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
                Toggle Status
              </button>
            </div>
            <div className="py-1">
              <button
                className="w-full px-4 py-2 text-body-sm font-medium text-error hover:bg-error-container/20 flex items-center gap-2 transition-colors duration-150"
                onClick={() => { setMenuOpen(false); onDelete?.(employee); }}
              >
                <span className="material-symbols-outlined text-sm text-error">delete</span>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};