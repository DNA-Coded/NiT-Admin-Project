import type { Department } from '@/types/departments';

interface DepartmentSummaryCardsProps {
  departments: Department[];
}

export function DepartmentSummaryCards({ departments }: DepartmentSummaryCardsProps) {
  const totalDepartments = departments.length;
  const totalStaff = departments.reduce((acc, curr) => acc + curr.staffCount, 0);
  const totalDevices = departments.reduce((acc, curr) => acc + curr.deviceCount, 0);
  const avgAttendance = departments.length 
    ? (departments.reduce((acc, curr) => acc + curr.attendanceRate, 0) / departments.length).toFixed(1)
    : '0';

  const cards = [
    {
      title: 'Total Departments',
      value: totalDepartments,
      icon: 'domain',
      color: 'text-primary',
      bg: 'bg-primary/5',
    },
    {
      title: 'Total Staff Assigned',
      value: totalStaff,
      icon: 'groups',
      color: 'text-secondary-container',
      bg: 'bg-secondary-container/10',
    },
    {
      title: 'Active Biometric Devices',
      value: totalDevices,
      icon: 'router',
      color: 'text-success',
      bg: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Avg Attendance Rate',
      value: `${avgAttendance}%`,
      icon: 'trending_up',
      color: 'text-warning',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{card.title}</p>
              <h3 className="font-headline-lg text-headline-lg font-bold text-primary">{card.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined ${card.color}`}>{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
