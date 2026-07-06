import Faculty from '../faculty/faculty.model.js';
import Student from '../students/student.model.js';
import Device from '../devices/device.model.js';
import Attendance from '../attendance/attendance.model.js';
import SyncJob from '../../integrations/sync/sync.model.js';
import { 
  DEVICE_STATUS, 
  DEVICE_HEALTH_STATUS, 
  ATTENDANCE_RECORD_STATUS,
  FACULTY_STATUS,
  STUDENT_STATUS
} from '../../constants/index.js';
import { REPORT_PAGINATION } from './reports.constants.js';

/**
 * Pre-resolve person IDs based on demographic filters
 */
const resolvePersonIds = async (filters) => {
  const { department, semester, section, batch, academicSession } = filters;
  const personFiltersPresent = department || semester || section || batch || academicSession;
  
  if (!personFiltersPresent) return null;

  const studentQuery = { isActive: true };
  const facultyQuery = { isActive: true };
  let checkStudent = false;
  let checkFaculty = false;

  if (department) {
    studentQuery.department = department;
    facultyQuery.department = department;
    checkStudent = true;
    checkFaculty = true;
  }
  
  if (semester || section || batch || academicSession) {
    if (semester) studentQuery.semester = semester;
    if (section) studentQuery.section = section;
    if (batch) studentQuery.batch = batch;
    if (academicSession) studentQuery.academicSession = academicSession;
    checkStudent = true;
    // If student specific filters are passed without department, we don't need to check faculty
    if (!department) checkFaculty = false;
  }

  const ids = [];
  if (checkFaculty) {
    const facs = await Faculty.find(facultyQuery).select('_id').lean();
    ids.push(...facs.map(f => f._id));
  }
  if (checkStudent) {
    const stds = await Student.find(studentQuery).select('_id').lean();
    ids.push(...stds.map(s => s._id));
  }

  return ids;
};

export const getAttendanceReport = async (filters) => {
  const page = parseInt(filters.page, 10) || REPORT_PAGINATION.DEFAULT_PAGE;
  const limit = parseInt(filters.limit, 10) || REPORT_PAGINATION.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const matchedPersonIds = await resolvePersonIds(filters);

  const query = { isActive: true };
  if (filters.from || filters.to) {
    query.timestamp = {};
    if (filters.from) query.timestamp.$gte = new Date(filters.from);
    if (filters.to) query.timestamp.$lte = new Date(filters.to);
  }
  if (filters.attendanceType) query.attendanceType = filters.attendanceType;
  if (filters.verificationMethod) query.verificationMethod = filters.verificationMethod;
  if (filters.device) query.device = filters.device;
  if (matchedPersonIds !== null) {
    query.person = { $in: matchedPersonIds };
  }

  const [totalRecords, totalPresent, totalAbsent, totalCorrections, data] = await Promise.all([
    Attendance.countDocuments(query),
    Attendance.countDocuments({ ...query, attendanceType: 'PRESENT' }),
    Attendance.countDocuments({ ...query, attendanceType: 'ABSENT' }),
    Attendance.countDocuments({ ...query, status: ATTENDANCE_RECORD_STATUS.CORRECTED }),
    Attendance.find(query)
      .sort({ [filters.sortBy || 'timestamp']: filters.sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('person', 'fullName personType')
      .populate('device', 'deviceName')
      .lean()
  ]);

  return {
    filters,
    summary: { totalRecords, totalPresent, totalAbsent, totalCorrections },
    data: data.map(doc => ({
      id: doc._id,
      personName: doc.person?.fullName || 'Unknown',
      personType: doc.person?.personType || 'Unknown',
      attendanceType: doc.attendanceType,
      verificationMethod: doc.verificationMethod,
      status: doc.status,
      timestamp: doc.timestamp,
      deviceName: doc.device?.deviceName || 'Unknown'
    })),
    pagination: { page, limit }
  };
};

export const getFacultyReport = async (filters) => {
  const page = parseInt(filters.page, 10) || REPORT_PAGINATION.DEFAULT_PAGE;
  const limit = parseInt(filters.limit, 10) || REPORT_PAGINATION.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const query = { isActive: true };
  if (filters.department) query.department = filters.department;
  if (filters.designation) query.designation = filters.designation;
  if (filters.status) query.status = filters.status;

  const [totalFaculty, active, inactive, data] = await Promise.all([
    Faculty.countDocuments(query),
    Faculty.countDocuments({ ...query, status: FACULTY_STATUS.ACTIVE }),
    Faculty.countDocuments({ ...query, status: { $ne: FACULTY_STATUS.ACTIVE } }),
    Faculty.find(query)
      .sort({ [filters.sortBy || 'createdAt']: filters.sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('department', 'name code')
      .lean()
  ]);

  return {
    filters,
    summary: { totalFaculty, active, inactive },
    data: data.map(doc => ({
      id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      department: doc.department?.name,
      designation: doc.designation,
      status: doc.status,
      joinedAt: doc.joinedAt
    })),
    pagination: { page, limit }
  };
};

export const getStudentReport = async (filters) => {
  const page = parseInt(filters.page, 10) || REPORT_PAGINATION.DEFAULT_PAGE;
  const limit = parseInt(filters.limit, 10) || REPORT_PAGINATION.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const query = { isActive: true };
  if (filters.department) query.department = filters.department;
  if (filters.semester) query.semester = filters.semester;
  if (filters.section) query.section = filters.section;
  if (filters.batch) query.batch = filters.batch;
  if (filters.academicSession) query.academicSession = filters.academicSession;
  if (filters.status) query.status = filters.status;

  const [totalStudents, active, inactive, data] = await Promise.all([
    Student.countDocuments(query),
    Student.countDocuments({ ...query, status: STUDENT_STATUS.ACTIVE }),
    Student.countDocuments({ ...query, status: { $ne: STUDENT_STATUS.ACTIVE } }),
    Student.find(query)
      .sort({ [filters.sortBy || 'createdAt']: filters.sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('department', 'name code')
      .lean()
  ]);

  return {
    filters,
    summary: { totalStudents, active, inactive },
    data: data.map(doc => ({
      id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      rollNumber: doc.rollNumber,
      department: doc.department?.name,
      semester: doc.semester,
      section: doc.section,
      batch: doc.batch,
      status: doc.status
    })),
    pagination: { page, limit }
  };
};

export const getDeviceReport = async (filters) => {
  const page = parseInt(filters.page, 10) || REPORT_PAGINATION.DEFAULT_PAGE;
  const limit = parseInt(filters.limit, 10) || REPORT_PAGINATION.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const query = { isActive: true };
  if (filters.healthStatus) query.healthStatus = filters.healthStatus;
  if (filters.connectionStatus) query.status = filters.connectionStatus;
  if (filters.deviceCategory) query.type = filters.deviceCategory;

  const [totalDevices, online, offline, maintenance, data] = await Promise.all([
    Device.countDocuments(query),
    Device.countDocuments({ ...query, status: DEVICE_STATUS.ONLINE }),
    Device.countDocuments({ ...query, status: DEVICE_STATUS.OFFLINE }),
    Device.countDocuments({ ...query, status: DEVICE_STATUS.MAINTENANCE }),
    Device.find(query)
      .sort({ [filters.sortBy || 'createdAt']: filters.sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return {
    filters,
    summary: { totalDevices, online, offline, maintenance },
    data: data.map(doc => ({
      id: doc._id,
      deviceName: doc.deviceName,
      deviceCode: doc.deviceCode,
      type: doc.type,
      healthStatus: doc.healthStatus,
      status: doc.status,
      lastHeartbeat: doc.lastHeartbeat,
      ipAddress: doc.ipAddress
    })),
    pagination: { page, limit }
  };
};

export const getSynchronizationReport = async (filters) => {
  const page = parseInt(filters.page, 10) || REPORT_PAGINATION.DEFAULT_PAGE;
  const limit = parseInt(filters.limit, 10) || REPORT_PAGINATION.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const query = { isActive: true };
  if (filters.provider) query.provider = filters.provider;
  if (filters.syncStatus) query.status = filters.syncStatus;
  if (filters.from || filters.to) {
    query.startedAt = {};
    if (filters.from) query.startedAt.$gte = new Date(filters.from);
    if (filters.to) query.startedAt.$lte = new Date(filters.to);
  }

  const [totalJobs, successful, failed, pending, data] = await Promise.all([
    SyncJob.countDocuments(query),
    SyncJob.countDocuments({ ...query, status: 'SUCCESS' }),
    SyncJob.countDocuments({ ...query, status: 'FAILED' }),
    SyncJob.countDocuments({ ...query, status: 'PENDING' }),
    SyncJob.find(query)
      .sort({ [filters.sortBy || 'startedAt']: filters.sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('device', 'deviceName')
      .lean()
  ]);

  return {
    filters,
    summary: { totalJobs, successful, failed, pending },
    data: data.map(doc => ({
      id: doc._id,
      syncId: doc.syncId,
      provider: doc.provider,
      status: doc.status,
      startedAt: doc.startedAt,
      completedAt: doc.completedAt,
      recordsProcessed: doc.recordsProcessed,
      recordsFailed: doc.recordsFailed,
      deviceName: doc.device?.deviceName || 'System'
    })),
    pagination: { page, limit }
  };
};
