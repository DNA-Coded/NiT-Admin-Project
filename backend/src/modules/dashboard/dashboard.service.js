import Department from '../departments/department.model.js';
import Faculty from '../faculty/faculty.model.js';
import Student from '../students/student.model.js';
import Device from '../devices/device.model.js';
import Attendance from '../attendance/attendance.model.js';
import SyncJob from '../../integrations/sync/sync.model.js';
import { DEVICE_STATUS, DEVICE_HEALTH_STATUS, ATTENDANCE_RECORD_STATUS } from '../../constants/index.js';

/**
 * Get Dashboard Overview Metrics
 * Aggregates summary from various models concurrently.
 */
export const getDashboardOverview = async () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

  // Run all independent count queries in parallel
  const [
    totalDepartments,
    totalFaculty,
    totalStudents,
    totalDevices,
    
    // Device Status Counts
    onlineDevices,
    offlineDevices,
    maintenanceDevices,
    healthyDevices,
    warningDevices,
    errorDevices,

    // Attendance Counts
    todayAttendance,
    presentAttendance,
    absentAttendance,
    correctedAttendance,
    manualAttendance,

    // Synchronization Metrics
    lastSyncJob,
    pendingSyncJobs,
    failedSyncJobs,
    syncQueueSize
  ] = await Promise.all([
    // Summary
    Department.countDocuments({ isActive: true }),
    Faculty.countDocuments({ isActive: true }),
    Student.countDocuments({ isActive: true }),
    Device.countDocuments({ isActive: true }),

    // Devices
    Device.countDocuments({ isActive: true, status: DEVICE_STATUS.ONLINE }),
    Device.countDocuments({ isActive: true, status: DEVICE_STATUS.OFFLINE }),
    Device.countDocuments({ isActive: true, status: DEVICE_STATUS.MAINTENANCE }),
    Device.countDocuments({ isActive: true, healthStatus: DEVICE_HEALTH_STATUS.HEALTHY }),
    Device.countDocuments({ isActive: true, healthStatus: DEVICE_HEALTH_STATUS.WARNING }),
    Device.countDocuments({ isActive: true, healthStatus: DEVICE_HEALTH_STATUS.ERROR }),

    // Attendance
    Attendance.countDocuments({ attendanceDate: dateStr }),
    Attendance.countDocuments({ attendanceDate: dateStr, status: ATTENDANCE_RECORD_STATUS.PRESENT }),
    Attendance.countDocuments({ attendanceDate: dateStr, status: ATTENDANCE_RECORD_STATUS.ABSENT }),
    Attendance.countDocuments({ attendanceDate: dateStr, status: ATTENDANCE_RECORD_STATUS.CORRECTED }),
    Attendance.countDocuments({ attendanceDate: dateStr, status: ATTENDANCE_RECORD_STATUS.MANUAL }),

    // Synchronization
    SyncJob.findOne().sort({ createdAt: -1 }).lean(),
    SyncJob.countDocuments({ status: 'PENDING' }),
    SyncJob.countDocuments({ status: 'FAILED' }),
    SyncJob.countDocuments({ status: 'PENDING' }) // Assuming queue size is pending jobs
  ]);

  return {
    summary: {
      totalDepartments,
      totalFaculty,
      totalStudents,
      totalDevices
    },
    devices: {
      online: onlineDevices,
      offline: offlineDevices,
      maintenance: maintenanceDevices,
      healthy: healthyDevices,
      warning: warningDevices,
      error: errorDevices
    },
    attendance: {
      today: todayAttendance,
      present: presentAttendance,
      absent: absentAttendance,
      corrected: correctedAttendance,
      manual: manualAttendance
    },
    synchronization: {
      lastSync: lastSyncJob ? lastSyncJob.createdAt : null,
      pendingJobs: pendingSyncJobs,
      failedJobs: failedSyncJobs,
      queueSize: syncQueueSize
    }
  };
};

export const getLiveAttendance = async () => {
  return await Attendance.find()
    .sort({ timestamp: -1 })
    .limit(20)
    .populate('person', 'id fullName')
    .populate('device', 'id deviceName')
    .select('timestamp verificationMethod attendanceType person device')
    .lean();
};

export const getDeviceStatus = async () => {
  return await Device.find({ isActive: true })
    .select('deviceName healthStatus status lastHeartbeat lastSeen')
    .lean();
};
