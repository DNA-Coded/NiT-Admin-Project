import Department from '../departments/departments.model.js';
import Faculty from '../faculty/faculty.model.js';
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
        $addFields: {
          totalFaculty: { $size: '$faculties' },
          allPersonIds: '$faculties._id'
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
          attendancePercentage: {
            $cond: [
              { $eq: ['$totalFaculty', 0] },
              0,
              {
                $multiply: [
                  { $divide: [{ $size: '$todayAttendances' }, '$totalFaculty'] },
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

/**
 * Get Dashboard Live Monitoring
 * Provides real-time operational data for the dashboard.
 */
export const getDashboardLiveMonitoring = async () => {
  const [
    latestAttendanceDocs,
    activeDevicesDocs,
    failedDevicesDocs,
    recentCorrectionsDocs,
    activeSyncJobsDocs,
    recentSyncJobsDocs,
    recentDeviceDocs
  ] = await Promise.all([
    // latestAttendance
    Attendance.find({ isActive: true })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('person', 'fullName')
      .populate('device', 'deviceName')
      .select('timestamp verificationMethod attendanceType personType person device')
      .lean(),
    
    // activeDevices
    Device.find({ isActive: true, healthStatus: DEVICE_HEALTH_STATUS.HEALTHY })
      .select('deviceName healthStatus status lastHeartbeat')
      .lean(),
      
    // failedDevices
    Device.find({ 
      isActive: true, 
      $or: [
        { status: DEVICE_STATUS.OFFLINE }, 
        { healthStatus: { $in: [DEVICE_HEALTH_STATUS.ERROR, DEVICE_HEALTH_STATUS.WARNING] } }
      ] 
    })
      .select('deviceName healthStatus lastError failureCount lastSeen')
      .lean(),
      
    // recentCorrections
    Attendance.find({ isActive: true, status: ATTENDANCE_RECORD_STATUS.CORRECTED, 'correctionHistory.0': { $exists: true } })
      .sort({ 'correctionHistory.correctedAt': -1 })
      .limit(10)
      .populate('person', 'fullName')
      .select('person correctionHistory')
      .lean(),
      
    // activeSyncJobs
    SyncJob.find({ isActive: true, status: { $in: ['PENDING', 'RUNNING'] } })
      .select('syncId provider status startedAt')
      .lean(),

    // Extra queries for recentSystemEvents
    SyncJob.find({ isActive: true })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('provider status updatedAt')
      .lean(),
      
    Device.find({ isActive: true })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('deviceName status updatedAt')
      .lean()
  ]);

  // Format latestAttendance
  const latestAttendance = latestAttendanceDocs.map(doc => ({
    personName: doc.person?.fullName || 'Unknown',
    personType: doc.personType || 'Unknown',
    attendanceType: doc.attendanceType,
    verificationMethod: doc.verificationMethod,
    timestamp: doc.timestamp,
    deviceName: doc.device?.deviceName || 'Unknown'
  }));

  // Format activeDevices
  const activeDevices = activeDevicesDocs.map(doc => ({
    deviceName: doc.deviceName,
    healthStatus: doc.healthStatus,
    connectionStatus: doc.status,
    lastHeartbeat: doc.lastHeartbeat
  }));

  // Format failedDevices
  const failedDevices = failedDevicesDocs.map(doc => ({
    deviceName: doc.deviceName,
    healthStatus: doc.healthStatus,
    lastError: doc.lastError,
    failureCount: doc.failureCount,
    lastSeen: doc.lastSeen
  }));

  // Format recentCorrections
  const recentCorrections = recentCorrectionsDocs.map(doc => {
    // Get the latest correction
    const lastCorrection = doc.correctionHistory[doc.correctionHistory.length - 1];
    return {
      personName: doc.person?.fullName || 'Unknown',
      correctionReason: lastCorrection?.correctionReason || 'Unknown',
      correctedBy: lastCorrection?.correctedBy || 'Unknown',
      correctedAt: lastCorrection?.correctedAt || null
    };
  });

  // Format activeSyncJobs
  const activeSyncJobs = activeSyncJobsDocs.map(doc => ({
    syncId: doc.syncId,
    provider: doc.provider,
    status: doc.status,
    startedAt: doc.startedAt
  }));

  // Compile recentSystemEvents
  const systemEvents = [];
  
  recentSyncJobsDocs.forEach(job => {
    let eventName = '';
    if (job.status === 'FAILED') eventName = 'Sync Failed';
    else if (job.status === 'SUCCESS') eventName = 'Sync Completed';
    else if (job.status === 'RUNNING') eventName = 'Sync Started';
    else return;
    
    systemEvents.push({
      event: eventName,
      module: 'Synchronization',
      timestamp: job.updatedAt
    });
  });

  recentDeviceDocs.forEach(dev => {
    let eventName = '';
    if (dev.status === DEVICE_STATUS.OFFLINE) eventName = 'Device Offline';
    else if (dev.status === DEVICE_STATUS.ONLINE) eventName = 'Device Connected';
    else return;
    
    systemEvents.push({
      event: eventName,
      module: 'Devices',
      timestamp: dev.updatedAt
    });
  });

  recentCorrectionsDocs.forEach(corr => {
    const lastCorrection = corr.correctionHistory[corr.correctionHistory.length - 1];
    if (!lastCorrection) return;
    systemEvents.push({
      event: 'Attendance Corrected',
      module: 'Attendance',
      timestamp: lastCorrection.correctedAt
    });
  });

  // Sort by timestamp desc and take top 20
  systemEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recentSystemEvents = systemEvents.slice(0, 20);

  return {
    latestAttendance,
    activeDevices,
    failedDevices,
    recentCorrections,
    activeSyncJobs,
    recentSystemEvents
  };
};

/**
 * Get Filtered Dashboard Data
 * Applies dynamic filters cleanly to Attendance, Devices, and Synchronization.
 */
export const getFilteredDashboardData = async (filters, { page, limit }) => {
  const skip = (page - 1) * limit;

  // ─── 1. Pre-resolve Person Filters (if any) ──────────────────────────────
  const {
    from, to,
    department, faculty, designation, facultyStatus,
    attendanceType, verificationMethod, correctionStatus,
    device, deviceCategory, healthStatus, connectionStatus,
    syncStatus, provider
  } = filters;

  let matchedPersonIds = null;
  const personFiltersPresent = department || faculty || designation || facultyStatus;

  if (personFiltersPresent) {
    const facultyQuery = { isActive: true };
    let checkFaculty = false;

    // Faculty-specific filters
    if (faculty || designation || facultyStatus) {
      if (faculty) facultyQuery._id = faculty;
      if (designation) facultyQuery.designation = designation;
      if (facultyStatus) facultyQuery.status = facultyStatus;
      checkFaculty = true;
    }

    // Shared filters (department)
    if (department) {
      facultyQuery.department = department;
      checkFaculty = true;
    }

    const ids = [];
    if (checkFaculty) {
      const facs = await Faculty.find(facultyQuery).select('_id').lean();
      ids.push(...facs.map(f => f._id));
    }
    
    matchedPersonIds = ids;
  }

  // ─── 2. Build Module Queries ──────────────────────────────────────────────
  
  // Attendance Query Builder
  const attendanceQuery = { isActive: true };
  if (from || to) {
    attendanceQuery.timestamp = {};
    if (from) attendanceQuery.timestamp.$gte = new Date(from);
    if (to) attendanceQuery.timestamp.$lte = new Date(to);
  }
  if (attendanceType) attendanceQuery.attendanceType = attendanceType;
  if (verificationMethod) attendanceQuery.verificationMethod = verificationMethod;
  if (correctionStatus === 'CORRECTED') {
    attendanceQuery.status = ATTENDANCE_RECORD_STATUS.CORRECTED;
  } else if (correctionStatus === 'UNCORRECTED') {
    attendanceQuery.status = { $ne: ATTENDANCE_RECORD_STATUS.CORRECTED };
  }
  if (device) attendanceQuery.device = device;
  if (matchedPersonIds !== null) {
    attendanceQuery.person = { $in: matchedPersonIds };
  }

  // Device Query Builder
  const deviceQuery = { isActive: true };
  if (device) deviceQuery._id = device;
  if (deviceCategory) deviceQuery.type = deviceCategory; // Using type for category
  if (healthStatus) deviceQuery.healthStatus = healthStatus;
  if (connectionStatus) deviceQuery.status = connectionStatus;

  // Synchronization Query Builder
  const syncQuery = { isActive: true };
  if (syncStatus) syncQuery.status = syncStatus;
  if (provider) syncQuery.provider = provider;
  if (from || to) {
    syncQuery.startedAt = {};
    if (from) syncQuery.startedAt.$gte = new Date(from);
    if (to) syncQuery.startedAt.$lte = new Date(to);
  }

  // ─── 3. Execute Queries & Counts Concurrently ─────────────────────────────
  const [
    totalAttendance,
    attendanceList,
    totalDevices,
    devicesList,
    totalSyncJobs,
    syncList
  ] = await Promise.all([
    Attendance.countDocuments(attendanceQuery),
    Attendance.find(attendanceQuery)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('person', 'fullName')
      .populate('device', 'deviceName')
      .lean(),

    Device.countDocuments(deviceQuery),
    Device.find(deviceQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    SyncJob.countDocuments(syncQuery),
    SyncJob.find(syncQuery)
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  // ─── 4. Map & Return Results ──────────────────────────────────────────────
  return {
    filters,
    summary: {
      totalAttendance,
      totalDevices,
      totalSyncJobs
    },
    attendance: attendanceList.map(doc => ({
      id: doc._id,
      personName: doc.person?.fullName || 'Unknown',
      attendanceType: doc.attendanceType,
      verificationMethod: doc.verificationMethod,
      status: doc.status,
      timestamp: doc.timestamp,
      deviceName: doc.device?.deviceName || 'Unknown'
    })),
    devices: devicesList.map(doc => ({
      id: doc._id,
      deviceName: doc.deviceName,
      type: doc.type,
      healthStatus: doc.healthStatus,
      status: doc.status,
      lastHeartbeat: doc.lastHeartbeat
    })),
    synchronization: syncList.map(doc => ({
      id: doc._id,
      syncId: doc.syncId,
      provider: doc.provider,
      status: doc.status,
      startedAt: doc.startedAt,
      completedAt: doc.completedAt
    })),
    pagination: {
      page,
      limit
    }
  };
};
