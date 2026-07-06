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

/**
 * Get Dashboard Analytics
 * Consolidates all required analytics into a single request.
 */
export const getDashboardAnalytics = async () => {
  const now = new Date();
  const todayDateStr = now.toISOString().split('T')[0];

  const startOfWeek = new Date(now);
  startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay()); // Sunday as start of week
  const startOfWeekDateStr = startOfWeek.toISOString().split('T')[0];

  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const startOfMonthDateStr = startOfMonth.toISOString().split('T')[0];

  const [
    attendanceAgg,
    departmentAgg,
    facultyAgg,
    studentAgg,
    deviceAgg,
    syncAgg
  ] = await Promise.all([
    // 1. Attendance Analytics
    Attendance.aggregate([
      { $match: { isActive: true } },
      {
        $facet: {
          daily: [
            { $match: { attendanceDate: todayDateStr } },
            { $count: 'count' }
          ],
          weekly: [
            { $match: { attendanceDate: { $gte: startOfWeekDateStr } } },
            { $count: 'count' }
          ],
          monthly: [
            { $match: { attendanceDate: { $gte: startOfMonthDateStr } } },
            { $count: 'count' }
          ]
        }
      }
    ]),

    // 2. Department Analytics
    Department.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'faculties',
          localField: '_id',
          foreignField: 'department',
          pipeline: [{ $match: { isActive: true } }, { $project: { _id: 1 } }],
          as: 'faculties'
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'department',
          pipeline: [{ $match: { isActive: true } }, { $project: { _id: 1 } }],
          as: 'students'
        }
      },
      {
        $addFields: {
          totalFaculty: { $size: '$faculties' },
          totalStudents: { $size: '$students' },
          allPersonIds: { $concatArrays: ['$faculties._id', '$students._id'] }
        }
      },
      {
        $lookup: {
          from: 'attendances',
          localField: 'allPersonIds',
          foreignField: 'person',
          pipeline: [
            {
              $match: {
                attendanceDate: todayDateStr,
                status: ATTENDANCE_RECORD_STATUS.PRESENT,
                isActive: true
              }
            },
            { $project: { _id: 1 } }
          ],
          as: 'todayAttendances'
        }
      },
      {
        $project: {
          department: '$name',
          totalFaculty: 1,
          totalStudents: 1,
          attendancePercentage: {
            $cond: [
              { $eq: [{ $add: ['$totalFaculty', '$totalStudents'] }, 0] },
              0,
              {
                $multiply: [
                  { $divide: [{ $size: '$todayAttendances' }, { $add: ['$totalFaculty', '$totalStudents'] }] },
                  100
                ]
              }
            ]
          }
        }
      }
    ]),

    // 3. Faculty Analytics
    Faculty.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [{ $match: { isActive: true } }, { $count: 'count' }],
          inactive: [{ $match: { isActive: false } }, { $count: 'count' }]
        }
      }
    ]),

    // 4. Student Analytics
    Student.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [{ $match: { isActive: true } }, { $count: 'count' }],
          inactive: [{ $match: { isActive: false } }, { $count: 'count' }]
        }
      }
    ]),

    // 5. Device Analytics
    Device.aggregate([
      { $match: { isActive: true } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          online: [{ $match: { status: DEVICE_STATUS.ONLINE } }, { $count: 'count' }],
          offline: [{ $match: { status: DEVICE_STATUS.OFFLINE } }, { $count: 'count' }],
          maintenance: [{ $match: { status: DEVICE_STATUS.MAINTENANCE } }, { $count: 'count' }],
          healthy: [{ $match: { healthStatus: DEVICE_HEALTH_STATUS.HEALTHY } }, { $count: 'count' }],
          warning: [{ $match: { healthStatus: DEVICE_HEALTH_STATUS.WARNING } }, { $count: 'count' }],
          error: [{ $match: { healthStatus: DEVICE_HEALTH_STATUS.ERROR } }, { $count: 'count' }]
        }
      }
    ]),

    // 6. Synchronization Analytics
    SyncJob.aggregate([
      { $match: { isActive: true } },
      {
        $facet: {
          totalJobs: [{ $count: 'count' }],
          successfulJobs: [{ $match: { status: 'SUCCESS' } }, { $count: 'count' }],
          failedJobs: [{ $match: { status: 'FAILED' } }, { $count: 'count' }],
          pendingJobs: [{ $match: { status: 'PENDING' } }, { $count: 'count' }],
          retryJobs: [{ $match: { retryCount: { $gt: 0 } } }, { $count: 'count' }]
        }
      }
    ])
  ]);

  // Helper function to extract count from $facet arrays
  const getCount = (facetArr) => (facetArr && facetArr.length > 0 ? facetArr[0].count : 0);

  return {
    attendance: {
      daily: getCount(attendanceAgg[0].daily),
      weekly: getCount(attendanceAgg[0].weekly),
      monthly: getCount(attendanceAgg[0].monthly)
    },
    departments: departmentAgg, // Already formatted by $project
    faculty: {
      total: getCount(facultyAgg[0].total),
      active: getCount(facultyAgg[0].active),
      inactive: getCount(facultyAgg[0].inactive)
    },
    students: {
      total: getCount(studentAgg[0].total),
      active: getCount(studentAgg[0].active),
      inactive: getCount(studentAgg[0].inactive)
    },
    devices: {
      total: getCount(deviceAgg[0].total),
      online: getCount(deviceAgg[0].online),
      offline: getCount(deviceAgg[0].offline),
      maintenance: getCount(deviceAgg[0].maintenance),
      healthy: getCount(deviceAgg[0].healthy),
      warning: getCount(deviceAgg[0].warning),
      error: getCount(deviceAgg[0].error)
    },
    synchronization: {
      totalJobs: getCount(syncAgg[0].totalJobs),
      successfulJobs: getCount(syncAgg[0].successfulJobs),
      failedJobs: getCount(syncAgg[0].failedJobs),
      pendingJobs: getCount(syncAgg[0].pendingJobs),
      retryJobs: getCount(syncAgg[0].retryJobs)
    }
  };
};
