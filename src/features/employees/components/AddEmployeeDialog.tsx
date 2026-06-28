import React from 'react';
import { DEPARTMENTS } from '@/constants';

interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline-md text-headline-md text-on-background">Add New Employee</h3>
            <button
              aria-label="Close dialog"
              className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all"
              onClick={onClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Form Content */}
          <form className="p-6 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Provide the personal and employment records of the new staff member below.
            </p>

            {/* Name */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="name">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                placeholder="Enter full name"
                type="text"
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="email">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. employee@nit.edu.in"
                  type="email"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="phone">
                  Contact Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. +91 98765 43210"
                  type="tel"
                />
              </div>
            </div>

            {/* Department & Designation Grid */}
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
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
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
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. Assistant Professor"
                  type="text"
                />
              </div>
            </div>

            {/* Employment Type & Joining Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="employmentType">
                  Employment Type *
                </label>
                <div className="relative">
                  <select
                    id="employmentType"
                    name="employmentType"
                    required
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Ad-hoc">Ad-hoc</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="joiningDate">
                  Joining Date *
                </label>
                <input
                  id="joiningDate"
                  name="joiningDate"
                  required
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                  type="date"
                />
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant mt-2 bg-surface-container-lowest">
              <button
                type="button"
                className="px-4 py-2 border border-outline-variant hover:bg-surface-container-low font-label-md text-label-md rounded-lg text-secondary transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-primary-container text-white font-label-md text-label-md rounded-lg transition-colors shadow-sm"
              >
                Register Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
