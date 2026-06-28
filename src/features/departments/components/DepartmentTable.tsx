import type { Department } from '@/types/departments';

interface DepartmentTableProps {
  departments: Department[];
  onSelectDepartment: (dept: Department) => void;
}

export function DepartmentTable({ departments, onSelectDepartment }: DepartmentTableProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low font-label-md text-label-md text-on-surface-variant">
              <th className="px-6 py-4 font-semibold">Department Name</th>
              <th className="px-6 py-4 font-semibold">Code</th>
              <th className="px-6 py-4 font-semibold">Head of Department (HOD)</th>
              <th className="px-6 py-4 font-semibold text-center">Staff Count</th>
              <th className="px-6 py-4 font-semibold text-center">Devices</th>
              <th className="px-6 py-4 font-semibold text-center">Attendance Rate</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant">
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr 
                  key={dept.id} 
                  className="hover:bg-surface-container-low/50 cursor-pointer transition-colors duration-150"
                  onClick={() => onSelectDepartment(dept)}
                >
                  <td className="px-6 py-4 font-semibold text-primary">{dept.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-primary/5 text-primary text-label-sm font-label-sm px-2.5 py-1 rounded-md border border-primary/10">
                      {dept.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{dept.hodName}</td>
                  <td className="px-6 py-4 text-center font-medium">{dept.staffCount}</td>
                  <td className="px-6 py-4 text-center font-medium">{dept.deviceCount}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`font-semibold ${dept.attendanceRate >= 92 ? 'text-green-600 dark:text-green-400' : dept.attendanceRate >= 88 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {dept.attendanceRate}%
                      </span>
                      <div className="w-12 bg-outline-variant h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full ${dept.attendanceRate >= 92 ? 'bg-green-600' : dept.attendanceRate >= 88 ? 'bg-amber-600' : 'bg-rose-600'}`} 
                          style={{ width: `${dept.attendanceRate}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => onSelectDepartment(dept)}
                      className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors inline-flex items-center gap-1 font-label-sm text-label-sm"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
