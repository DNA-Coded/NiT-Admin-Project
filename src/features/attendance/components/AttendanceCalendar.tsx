import React from 'react';

export const AttendanceCalendar: React.FC = () => {
  // Mock days of June 2026 (starting on a Monday)
  const daysInMonth = 30;
  const startDayOffset = 1; // Monday starts on index 1 (Sunday is 0)
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generating calendar cells
  const cells = [];
  // Empty slots for offset
  for (let i = 0; i < startDayOffset; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  // Helper to generate mock stats for each calendar day
  const getDayStats = (day: number) => {
    // Weekends (assuming Saturdays and Sundays are light or absent)
    const isWeekend = (day + startDayOffset - 1) % 7 === 0 || (day + startDayOffset - 1) % 7 === 6;
    if (isWeekend) {
      return { present: 0, late: 0, absent: 0, isWeekend: true };
    }
    // High numbers during weekdays
    return {
      present: Math.floor(Math.random() * 40) + 900,
      late: Math.floor(Math.random() * 20) + 15,
      absent: Math.floor(Math.random() * 15) + 5,
      isWeekend: false,
    };
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline-md text-headline-md text-on-background">June 2026</h3>
        <div className="flex items-center gap-4 text-xs font-medium text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning"></span>
            <span>Late</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger"></span>
            <span>Absent</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Days Header */}
        {weekDays.map((wd) => (
          <div key={wd} className="text-center font-label-md text-label-md text-on-surface-variant py-2 border-b border-outline-variant/30">
            {wd}
          </div>
        ))}

        {/* Days Cells */}
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-24 bg-surface-container-low/20 rounded border border-transparent" />;
          }

          const stats = getDayStats(day);

          return (
            <div
              key={`day-${day}`}
              className={`h-24 p-2 border border-outline-variant/40 rounded flex flex-col justify-between transition-colors hover:bg-surface-container-low/30 cursor-pointer ${
                stats.isWeekend ? 'bg-surface-container-low/10' : 'bg-surface-container-lowest'
              }`}
            >
              <span className={`font-label-sm text-label-sm font-bold ${stats.isWeekend ? 'text-on-surface-variant/50' : 'text-on-surface'}`}>
                {day}
              </span>
              
              {!stats.isWeekend ? (
                <div className="flex flex-col gap-1 text-[11px] font-medium leading-none">
                  <div className="flex justify-between text-success-text bg-success-bg/20 px-1 py-0.5 rounded">
                    <span>IN</span>
                    <span>{stats.present}</span>
                  </div>
                  <div className="flex justify-between text-warning-text bg-warning-bg/20 px-1 py-0.5 rounded">
                    <span>LATE</span>
                    <span>{stats.late}</span>
                  </div>
                  <div className="flex justify-between text-danger-text bg-danger-bg/20 px-1 py-0.5 rounded">
                    <span>OUT</span>
                    <span>{stats.absent}</span>
                  </div>
                </div>
              ) : (
                <span className="text-[10px] text-on-surface-variant/40 italic font-medium">Weekend</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
