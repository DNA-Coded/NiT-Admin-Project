import React, { useState, useRef, useEffect } from 'react';
import type { CreateFacultyDTO } from '../types/faculty.api.types';

interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CreateFacultyDTO) => Promise<void>;
  departments: { id: string; name: string }[];
}

export const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({ isOpen, onClose, onAdd, departments }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDesignation, setSelectedDesignation] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  
  const formRef = useRef<HTMLFormElement>(null);

  // Focus management: Trap focus inside modal when opened
  useEffect(() => {
    if (isOpen) {
      setError(null);
      // Accessibility best practice: move focus to header or first input
      const firstInput = formRef.current?.querySelector('input');
      firstInput?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentForm = e.currentTarget;
    const formData = new FormData(currentForm);
    
    const cleanOptionalField = (value: FormDataEntryValue | null) => {
      const str = value as string;
      return str && str.trim() !== '' ? str.trim() : undefined;
    };

    const data: CreateFacultyDTO = {
      firstName: (formData.get('firstName') as string).trim(),
      lastName: (formData.get('lastName') as string).trim(),
      employeeId: (formData.get('employeeId') as string).trim(),
      attendanceIdentity: (formData.get('attendanceIdentity') as string).trim(),
      email: cleanOptionalField(formData.get('email')),
      phone: cleanOptionalField(formData.get('phone')),
      department: formData.get('department') as string,
      designation: (formData.get('designation') as string).trim(),
      joiningDate: cleanOptionalField(formData.get('joiningDate')),
      isHOD: (formData.get('designation') as string).trim() === 'Head of Department'
    };

    try {
      setIsSubmitting(true);
      setError(null);
      await onAdd(data);
      
      // Clear all text layouts explicitly on success
      currentForm.reset();
      setSelectedDesignation('');
      setSelectedDepartment('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    formRef.current?.reset();
    setSelectedDesignation('');
    setSelectedDepartment('');
    onClose();
  };

  const isHODSelected = selectedDesignation === 'Head of Department';

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
        aria-labelledby="modal-title"
      >
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header Zone */}
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0">
            <h3 id="modal-title" className="font-headline-md text-headline-md text-on-background">Add New Employee</h3>
            <button
              aria-label="Close dialog"
              className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all disabled:opacity-50"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Form Content Zone */}
          <form 
            ref={formRef}
            className="flex-1 overflow-y-auto no-scrollbar flex flex-col dynamic-form-container" 
            onSubmit={handleSubmit}
          >
            <div className="p-6 flex flex-col gap-4 flex-1">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Provide the personal and employment records of the new staff member below.
              </p>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-2" role="alert">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="firstName">
                    First Name *
                  </label>
                  <input id="firstName" name="firstName" required className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all" placeholder="First name" type="text" disabled={isSubmitting} />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="lastName">
                    Last Name *
                  </label>
                  <input id="lastName" name="lastName" required className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all" placeholder="Last name" type="text" disabled={isSubmitting} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="employeeId">
                    Employee ID *
                  </label>
                  <input id="employeeId" name="employeeId" required className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all" placeholder="e.g. NIT-EMP-1042" type="text" disabled={isSubmitting} />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="attendanceIdentity">
                    Attendance Identity *
                  </label>
                  <input id="attendanceIdentity" name="attendanceIdentity" required className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all" placeholder="Biometric/RFID ID" type="text" disabled={isSubmitting} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <input id="email" name="email" className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all" placeholder="e.g. employee@nit.edu.in" type="email" disabled={isSubmitting} />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="phone">
                    Contact Number
                  </label>
                  <input id="phone" name="phone" className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all" placeholder="e.g. +91 98765 43210" type="tel" disabled={isSubmitting} />
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
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
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
                  <div className="relative">
                    <select
                      id="designation"
                      name="designation"
                      required
                      value={selectedDesignation}
                      onChange={(e) => setSelectedDesignation(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <option value="">Select Designation</option>
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Senior Lecturer">Senior Lecturer</option>
                      <option value="Lecturer">Lecturer</option>
                      <option value="Lab Instructor">Lab Instructor</option>
                      <option value="Lab Assistant">Lab Assistant</option>
                      <option value="Teaching Assistant">Teaching Assistant</option>
                      <option value="Visiting Faculty">Visiting Faculty</option>
                      <option value="Adjunct Faculty">Adjunct Faculty</option>
                      <option value="Head of Department">Head of Department</option>
                      <option value="Dean">Dean</option>
                      <option value="Director">Director</option>
                      <option value="Other">Other</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                      arrow_drop_down
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="joiningDate">
                    Joining Date
                  </label>
                  <input id="joiningDate" name="joiningDate" className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer" type="date" disabled={isSubmitting} />
                </div>
                <div className="hidden md:block" aria-hidden="true" />
              </div>

              {/* Exclusivity Warning Alert */}
              {isHODSelected && selectedDepartment && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg text-sm text-amber-800 dark:text-amber-200 flex gap-2 items-start mt-2">
                  <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">warning</span>
                  <div>
                    <strong>Role Exclusivity Warning:</strong> Registering this employee as <strong>Head of Department</strong> will automatically replace the existing HOD for this department.
                  </div>
                </div>
              )}
            </div>

            {/* Static Action Footer Layout (Stays pinned out of scroll view) */}
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
                    <span>Registering...</span>
                  </>
                ) : (
                  'Register Employee'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};