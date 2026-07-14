import React, { useState } from 'react';
import type { AttendanceRecord } from '@/types/attendance';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { AttendanceTimeline } from './AttendanceTimeline';

interface AttendanceDrawerProps {
  record: AttendanceRecord | null;
  onClose: () => void;
  onCorrect?: (id: string, payload: { status: string; remarks: string; correctionReason: string }) => Promise<void>;
}

export const AttendanceDrawer: React.FC<AttendanceDrawerProps> = ({ record, onClose, onCorrect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    remarks: '',
    correctionReason: '',
  });

  if (!record) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleEditClick = () => {
    setEditForm({
      status: record.status,
      remarks: record.remarks || '',
      correctionReason: '',
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCorrect) return;
    try {
      await onCorrect(record.id, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to correct record', error);
      alert('Failed to correct record');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-lg z-50 flex flex-col transition-transform duration-300 transform translate-x-0 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <h3 className="font-headline-md text-headline-md text-on-background">Attendance Log Details</h3>
          <div className="flex items-center gap-2">
            {!isEditing && onCorrect && (
              <button
                className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-label-sm font-bold transition-colors border border-primary/20"
                onClick={handleEditClick}
              >
                Correct Log
              </button>
            )}
            <button
              aria-label="Close details"
              className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all"
              onClick={onClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-surface-container p-4 rounded-lg border border-outline-variant">
              <h4 className="font-label-lg text-primary font-bold border-b border-outline-variant pb-2">Manual Correction</h4>
              
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-bold text-on-surface">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}
                  className="px-3 py-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary outline-none"
                  required
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="LATE">LATE</option>
                  <option value="HALF_DAY">HALF_DAY</option>
                  <option value="ON_LEAVE">ON_LEAVE</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-bold text-on-surface">Correction Reason</label>
                <input
                  type="text"
                  value={editForm.correctionReason}
                  onChange={(e) => setEditForm(p => ({ ...p, correctionReason: e.target.value }))}
                  className="px-3 py-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary outline-none"
                  placeholder="e.g. Forgot to swipe, System error"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-bold text-on-surface">Remarks (Notes)</label>
                <textarea
                  value={editForm.remarks}
                  onChange={(e) => setEditForm(p => ({ ...p, remarks: e.target.value }))}
                  className="px-3 py-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary outline-none resize-none"
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded text-label-md font-bold"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded text-label-md font-bold shadow hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Profile Overview */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-headline-lg font-bold text-xl">
                  {getInitials(record.employeeName)}
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-on-background">{record.employeeName}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{record.employeeId}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-body-sm text-body-sm text-outline font-medium">{record.date}</span>
                    <AttendanceStatusBadge status={record.status} />
                  </div>
                </div>
              </div>

              {/* Timing details */}
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
                <h5 className="font-label-md text-label-md text-primary font-bold">Event Details</h5>
                <div className="grid grid-cols-2 gap-4 font-body-sm text-body-sm text-on-surface">
                  <div>
                    <span className="block text-on-surface-variant font-label-sm text-label-sm">Punch Event</span>
                    <span className="font-bold">{record.attendanceType || '--'}</span>
                  </div>
                  <div>
                    <span className="block text-on-surface-variant font-label-sm text-label-sm">Event Code</span>
                    {record.attendanceCode || '--'}
                  </div>
                  <div>
                    <span className="block text-on-surface-variant font-label-sm text-label-sm">Punch Time</span>
                    {record.attendanceType === 'IN' ? record.firstIn : record.lastOut || '--'}
                  </div>
                  <div>
                    <span className="block text-on-surface-variant font-label-sm text-label-sm">Assigned Dept</span>
                    {record.department || '--'}
                  </div>
                </div>
              </div>

              {/* Timeline activity log */}
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
                <AttendanceTimeline record={record} />
              </div>

              {/* Device & Hardware logging details */}
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
                <h5 className="font-label-md text-label-md text-primary font-bold">Biometric Hardware</h5>
                <div className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface">
                  {record.deviceUsed ? (
                    <>
                      <div className="flex items-center gap-2 text-success font-medium">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Synced: {record.deviceUsed}</span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant pl-6.5">
                        Records synchronized via cloud WebSocket sync service.
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-on-surface-variant italic">
                      <span className="material-symbols-outlined text-[18px] text-outline font-light">info</span>
                      <span>No biometric verification logging found for this status.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-2">
                <h5 className="font-label-md text-label-md text-primary font-bold">Administrator Remarks</h5>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                  {record.remarks || record.notes || 'No notes added for this record.'}
                </p>
              </div>

              {/* Correction History */}
              {record.correctionHistory && record.correctionHistory.length > 0 && (
                <div className="bg-surface border border-outline-variant p-4 rounded-lg flex flex-col gap-3 shadow-sm">
                  <h5 className="font-label-md text-label-md text-primary font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    Correction History
                  </h5>
                  <div className="flex flex-col gap-3 mt-1">
                    {record.correctionHistory.map((hist, idx) => (
                      <div key={idx} className="border-l-2 border-primary/30 pl-3 flex flex-col gap-1">
                        <span className="text-[11px] text-on-surface-variant font-bold">
                          {new Date(hist.correctedAt).toLocaleString()} • by {hist.correctedBy}
                        </span>
                        <p className="text-[12px] text-on-surface">
                          Reason: <span className="italic">{hist.correctionReason}</span>
                        </p>
                        <p className="text-[12px] text-on-surface-variant">
                          Changed from {hist.originalStatus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
