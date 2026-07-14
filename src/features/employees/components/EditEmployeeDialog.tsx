import React, { useState, useEffect } from 'react';
import type { UpdateFacultyDTO } from '../types/faculty.api.types';
import type { Employee } from '@/types/employees';

interface EditEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (id: string, data: UpdateFacultyDTO) => Promise<void>;
  departments: { id: string; name: string }[];
}

export const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({ isOpen, onClose, employee, onEdit, departments }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departmentId, setDepartmentId] = useState('');

  useEffect(() => {
    if (employee && isOpen) {
      // Find department ID from name since Employee object only holds name
      const dept = departments.find(d => d.name === employee.department);
      if (dept) {
        setDepartmentId(dept.id);
      }
    }
  }, [employee, departments, isOpen]);

  if (!isOpen || !employee) return null;

  // Split name for pre-population
  const nameParts = employee.name.split(' ');
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: UpdateFacultyDTO = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      employeeId: formData.get('employeeId') as string,
      attendanceIdentity: formData.get('attendanceIdentity') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      department: formData.get('department') as string,
      designation: formData.get('designation') as string,
      status: formData.get('status') as string,
      joiningDate: formData.get('joiningDate') as string || undefined,
    };

    try {
      setIsSubmitting(true);
      setError(null);
      await onEdit(employee.id, data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={!isSubmitting ? onClose : undefined}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline-md text-headline-md text-on-background">Edit Employee Profile</h3>
            <button
              aria-label="Close dialog"
              className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form className="p-6 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-2">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="firstName">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  defaultValue={initialFirstName}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="lastName">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  defaultValue={initialLastName}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="employeeId">
                  Employee ID *
                </label>
                <input
                  id="employeeId"
                  name="employeeId"
                  required
                  defaultValue={employee.employeeId}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="attendanceIdentity">
                  Attendance Identity *
                </label>
                <input
                  id="attendanceIdentity"
                  name="attendanceIdentity"
                  required
                  defaultValue={employee.attendanceIdentity}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  defaultValue={employee.email}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  type="email"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="phone">
                  Contact Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  defaultValue={employee.phone}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  type="tel"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="department">
                  Department *
                </label>
                <div className="relative">
                  <select
                    id="department"
                    name="department"
                    required
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="designation">
                  Designation *
                </label>
                <input
                  id="designation"
                  name="designation"
                  required
                  defaultValue={employee.designation}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="status">
                  Operational Status *
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    required
                    defaultValue={employee.status}
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="RETIRED">Retired</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="joiningDate">
                  Joining Date
                </label>
                <input
                  id="joiningDate"
                  name="joiningDate"
                  defaultValue={employee.joiningDate !== 'Not Available' ? employee.joiningDate : ''}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                  type="date"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant mt-2 bg-surface-container-lowest">
              <button
                type="button"
                className="px-4 py-2 border border-outline-variant hover:bg-surface-container-low font-label-md text-label-md rounded-lg text-secondary transition-colors disabled:opacity-50"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-primary-container text-white font-label-md text-label-md rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                disabled={isSubmitting}
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
    </>
  );
};
