import React, { useState, useEffect, useRef } from 'react';
import type { UpdateFacultyDTO } from '../types/faculty.api.types';
import type { Employee } from '@/types/employees';

interface EditEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (id: string, data: UpdateFacultyDTO) => Promise<void>;
  departments: { id: string; name: string }[];
}

export const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({ 
  isOpen, 
  onClose, 
  employee, 
  onEdit, 
  departments 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Controlled component state for interactive dropdown inputs
  const [departmentId, setDepartmentId] = useState('');
  const [currentStatus, setCurrentStatus] = useState('ACTIVE');
  
  const formRef = useRef<HTMLFormElement>(null);

  // Sync incoming employee data model states
  useEffect(() => {
    if (employee && isOpen) {
      setError(null);
      setCurrentStatus(employee.status || 'ACTIVE');
      
      const dept = departments.find(d => d.name === employee.department);
      setDepartmentId(dept ? dept.id : '');
      
      // Small timeout ensures the DOM has painted before focusing
      setTimeout(() => {
        const firstInput = formRef.current?.querySelector('input');
        firstInput?.focus();
      }, 0);
    }
  }, [employee, departments, isOpen]);

  if (!isOpen || !employee) return null;

  // Added fallback to avoid crashes if employee.name is undefined from API
  const nameParts = (employee.name || '').trim().split(/\s+/);
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // We use formRef here just in case currentTarget is lost during the async await
    const formData = new FormData(e.currentTarget);
    
    const cleanOptionalField = (value: FormDataEntryValue | null) => {
      const str = value as string;
      return str && str.trim() !== '' ? str.trim() : undefined;
    };

    // --- 🛠️ NEW: SMART DEPARTMENT ID RESOLVER ---
    const formDepartmentValue = (formData.get('department') as string)?.trim();
    let resolvedDeptId = departmentId; // Fallback to your React state

    if (formDepartmentValue) {
      // Check if the form submitted a Name OR an ID and grab the correct ID
      const matchedDept = departments.find(
        d => d.id === formDepartmentValue || d.name === formDepartmentValue
      );
      if (matchedDept) {
        resolvedDeptId = matchedDept.id;
      }
    }

    // NEVER send an empty string. If we don't have a valid ID, send undefined 
    // so the backend ignores it rather than crashing on ObjectId validation.
    const finalDepartmentId = resolvedDeptId && resolvedDeptId !== '' 
      ? resolvedDeptId 
      : undefined;
    // ---------------------------------------------

    const data: UpdateFacultyDTO = {
      firstName: (formData.get('firstName') as string).trim(),
      lastName: (formData.get('lastName') as string).trim(),
      employeeId: (formData.get('employeeId') as string).trim(),
      attendanceIdentity: (formData.get('attendanceIdentity') as string).trim(),
      email: cleanOptionalField(formData.get('email')),
      phone: cleanOptionalField(formData.get('phone')),
      department: finalDepartmentId as any,
      designation: (formData.get('designation') as string).trim(),
      status: formData.get('status') as string,
      joiningDate: cleanOptionalField(formData.get('joiningDate')),
    };

    try {
      setIsSubmitting(true);
      setError(null);
      await onEdit(employee.id, data);
      formRef.current?.reset();
      onClose();
    } catch (err: unknown) {
      setError((err as any).response?.data?.message || (err as Error).message || 'Failed to update employee profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    formRef.current?.reset();
    onClose();
  };

  const formattedJoiningDate = employee.joiningDate && employee.joiningDate !== 'Not Available' 
    ? employee.joiningDate 
    : '';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={!isSubmitting ? handleCancel : undefined}
      />

      {/* Modal Container */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Top Title Strip Area */}
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0">
            <h3 id="edit-modal-title" className="font-headline-md text-headline-md text-on-background">
              Edit Employee Profile
            </h3>
            <button
              aria-label="Close dialog"
              className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all disabled:opacity-50"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Form Content Scrolling Wrapper Context */}
          <form 
            ref={formRef}
            className="flex-1 overflow-y-auto no-scrollbar flex flex-col" 
            onSubmit={handleSubmit}
          >
            <div className="p-6 flex flex-col gap-4 flex-1">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-2" role="alert">
                  {error}
                </div>
              )}

              {/* Name Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="firstName">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    required
                    key={`${employee.id}-firstName`}
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
                    key={`${employee.id}-lastName`}
                    defaultValue={initialLastName}
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    type="text"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* System Identifiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="employeeId">
                    Employee ID *
                  </label>
                  <input
                    id="employeeId"
                    name="employeeId"
                    required
                    key={`${employee.id}-empId`}
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
                    key={`${employee.id}-attId`}
                    defaultValue={employee.attendanceIdentity}
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    type="text"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    key={`${employee.id}-email`}
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
                    key={`${employee.id}-phone`}
                    defaultValue={employee.phone}
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    type="tel"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Assignments Selection Grid */}
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
                    key={`${employee.id}-designation`}
                    defaultValue={employee.designation}
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    type="text"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Status and Calendar Processing */}
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
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
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
                    key={`${employee.id}-joiningDate`}
                    defaultValue={formattedJoiningDate}
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                    type="date"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Static Action Control Footer (Stops elements scrolling out of view bounds) */}
            <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end gap-3 shrink-0">
              <button
                type="button"
                className="px-4 py-2 border border-outline-variant hover:bg-surface-container-low font-label-md text-label-md rounded-lg text-secondary transition-colors disabled:opacity-50"
                onClick={handleCancel}
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
                    <span>Saving...</span>
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