import mongoose from 'mongoose';
import Attendance from './attendance.model.js';
import Device from '../devices/device.model.js';
import Faculty from '../faculty/faculty.model.js';
import Student from '../students/student.model.js';
import { MESSAGES } from '../../constants/index.js';
import {
  logAttendanceListFetched,
  logAttendanceFetched,
  logAttendanceCreated,
  logAttendanceUpdated,
  logAttendanceCorrected,
  logAttendanceDeleted,
  logAttendanceRestored,
  logAttendanceNotFound,
  logAttendanceConflict,
} from './attendance.logger.js';

const makeError = (message, status) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

const assertDeviceExists = async (deviceId) => {
  if (!deviceId) return;
  const device = await Device.findById(deviceId).select('isActive status').lean();
  if (!device) {
    throw makeError(MESSAGES.DEVICE_NOT_FOUND, 404);
  }
  if (!device.isActive) {
    throw makeError('The referenced device is inactive.', 422);
  }
};

const assertPersonExistsAndMatchesIdentity = async (personId, personType, attendanceIdentity) => {
  if (!personId || !personType || !attendanceIdentity) return;

  const Model = personType === 'FACULTY' ? Faculty : Student;
  const person = await Model.findById(personId).select('isActive attendanceIdentity').lean();

  if (!person) {
    throw makeError(MESSAGES.ATTENDANCE_PERSON_NOT_FOUND, 404);
  }

  if (!person.isActive) {
    throw makeError(MESSAGES.ATTENDANCE_PERSON_NOT_FOUND, 422);
  }

  if (person.attendanceIdentity !== attendanceIdentity.trim()) {
    throw makeError(MESSAGES.ATTENDANCE_IDENTITY_MISMATCH, 422);
  }
};

const assertNoDuplicate = async (fields, excludeId = null, requestMeta = {}) => {
  const { attendanceCode, person, attendanceType, timestamp } = fields;

  if (attendanceCode) {
    const filter = { attendanceCode: attendanceCode.trim().toUpperCase() };
    if (excludeId) filter._id = { $ne: excludeId };
    const existing = await Attendance.findOne(filter).select('_id').lean();
    if (existing) {
      logAttendanceConflict(attendanceCode, requestMeta);
      throw makeError(MESSAGES.ATTENDANCE_CODE_TAKEN, 409);
    }
  }

  if (person && attendanceType && timestamp) {
    // Prevent exact millisecond duplicate for same person/type
    const filter = { person, attendanceType, timestamp: new Date(timestamp) };
    if (excludeId) filter._id = { $ne: excludeId };
    const existing = await Attendance.findOne(filter).select('_id').lean();
    if (existing) {
      throw makeError(MESSAGES.ATTENDANCE_DUPLICATE_ENTRY, 409);
    }
  }
};

export const listAttendance = async (query = {}, requestMeta = {}) => {
  const {
    page = 1, limit = 20, search = '',
    personType = null, person = null, department = null,
    device = null, verificationMethod = null, attendanceType = null,
    status = null, attendanceDate = null,
    isActive = 'all', sortBy = 'timestamp', sortOrder = 'desc',
  } = query;

  const filter = {};

  if (isActive !== 'all') {
    filter.isActive = isActive === true || isActive === 'true';
  }

  if (personType && personType.trim()) {
    filter.personType = personType.trim().toUpperCase();
  }

  if (person && mongoose.Types.ObjectId.isValid(person)) {
    filter.person = new mongoose.Types.ObjectId(person);
  }

  if (device && mongoose.Types.ObjectId.isValid(device)) {
    filter.device = new mongoose.Types.ObjectId(device);
  }

  if (verificationMethod && verificationMethod.trim()) {
    filter.verificationMethod = verificationMethod.trim().toUpperCase();
  }

  if (attendanceType && attendanceType.trim()) {
    filter.attendanceType = attendanceType.trim().toUpperCase();
  }

  if (status && status.trim()) {
    filter.status = status.trim().toUpperCase();
  }

  if (attendanceDate && attendanceDate.trim()) {
    filter.attendanceDate = attendanceDate.trim();
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { attendanceCode: searchRegex },
      { attendanceIdentity: searchRegex },
      { remarks: searchRegex },
    ];
  }

  // Cross-collection filtering by department requires lookup or pre-fetching person IDs
  if (department && mongoose.Types.ObjectId.isValid(department)) {
    // Optimization: fetch matching person IDs first to avoid heavy aggregation on Attendance
    const deptId = new mongoose.Types.ObjectId(department);
    const [faculties, students] = await Promise.all([
      Faculty.find({ department: deptId }).select('_id').lean(),
      Student.find({ department: deptId }).select('_id').lean()
    ]);
    const personIds = [...faculties.map(f => f._id), ...students.map(s => s._id)];
    
    // If filtering by department and no people found, result is strictly 0
    if (personIds.length === 0) {
      return {
        attendance: [],
        pagination: { total: 0, page: 1, limit: parseInt(limit, 10), totalPages: 0, hasNextPage: false, hasPrevPage: false }
      };
    }
    
    // Intersect with existing person filter if provided
    if (filter.person) {
      if (!personIds.some(id => id.equals(filter.person))) {
        return {
          attendance: [],
          pagination: { total: 0, page: 1, limit: parseInt(limit, 10), totalPages: 0, hasNextPage: false, hasPrevPage: false }
        };
      }
    } else {
      filter.person = { $in: personIds };
    }
  }

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(500, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [total, docs] = await Promise.all([
    Attendance.countDocuments(filter),
    Attendance.find(filter)
      .populate({
        path: 'person',
        select: 'firstName lastName fullName department',
        populate: { path: 'department', select: 'name code' }
      })
      .populate('device', 'deviceCode deviceName deviceType')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  logAttendanceListFetched({ total, page: pageNum }, requestMeta);

  // Re-map to public JSON format safely
  const attendance = docs.map((doc) => {
    const p = doc.person;
    let personField = p ?? null;
    
    if (p && typeof p === 'object' && p._id) {
      personField = {
        id:        p._id,
        firstName: p.firstName,
        lastName:  p.lastName,
        fullName:  p.fullName,
        department: p.department && p.department._id ? {
          id: p.department._id,
          name: p.department.name,
          code: p.department.code
        } : p.department ?? null,
      };
    }

    const d = doc.device;
    const deviceField =
      d && typeof d === 'object' && d._id
        ? { id: d._id, deviceCode: d.deviceCode, deviceName: d.deviceName, deviceType: d.deviceType }
        : d ?? null;

    return {
      id:                 doc._id,
      attendanceCode:     doc.attendanceCode,
      personType:         doc.personType,
      person:             personField,
      device:             deviceField,
      verificationMethod: doc.verificationMethod,
      attendanceType:     doc.attendanceType,
      timestamp:          doc.timestamp,
      attendanceDate:     doc.attendanceDate,
      attendanceTime:     doc.attendanceTime,
      status:             doc.status,
      remarks:            doc.remarks ?? null,
      isActive:           doc.isActive,
      deletedAt:          doc.deletedAt ?? null,
      deletedBy:          doc.deletedBy ?? null,
      createdBy:          doc.createdBy,
      updatedBy:          doc.updatedBy ?? null,
      createdAt:          doc.createdAt,
      updatedAt:          doc.updatedAt,
    };
  });

  return {
    attendance,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

export const getAttendanceById = async (id, requestMeta = {}) => {
  const record = await Attendance.findById(id)
    .populate({
      path: 'person',
      select: 'firstName lastName fullName department',
      populate: { path: 'department', select: 'name code' }
    })
    .populate('device', 'deviceCode deviceName deviceType');

  if (!record) {
    logAttendanceNotFound(id, requestMeta);
    throw makeError(MESSAGES.ATTENDANCE_NOT_FOUND, 404);
  }

  logAttendanceFetched(id, requestMeta);
  return record.toPublicJSON();
};

export const createAttendance = async (data, adminEmail, requestMeta = {}) => {
  const {
    attendanceCode, personType, person, device, attendanceIdentity,
    verificationMethod, attendanceType, timestamp, attendanceDate, attendanceTime,
    status, remarks = null,
  } = data;

  await assertDeviceExists(device);
  await assertPersonExistsAndMatchesIdentity(person, personType, attendanceIdentity);
  await assertNoDuplicate({ attendanceCode, person, attendanceType, timestamp }, null, requestMeta);

  const record = await Attendance.create({
    attendanceCode, personType, person, device, attendanceIdentity,
    verificationMethod, attendanceType, timestamp, attendanceDate, attendanceTime,
    status, remarks,
    createdBy: adminEmail,
  });

  await record.populate({
    path: 'person',
    select: 'firstName lastName fullName department',
    populate: { path: 'department', select: 'name code' }
  });
  await record.populate('device', 'deviceCode deviceName deviceType');

  logAttendanceCreated(
    { id: record._id, attendanceCode: record.attendanceCode, personId: record.person._id, deviceId: record.device._id },
    adminEmail,
    requestMeta
  );

  return record.toPublicJSON();
};

export const updateAttendance = async (id, data, adminEmail, requestMeta = {}) => {
  const allowedFields = [
    'attendanceCode', 'personType', 'person', 'device', 'attendanceIdentity',
    'verificationMethod', 'attendanceType', 'timestamp', 'attendanceDate', 'attendanceTime',
    'status', 'remarks',
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      updates[field] = data[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw makeError(MESSAGES.ATTENDANCE_NO_CHANGES, 400);
  }

  const record = await Attendance.findById(id);
  if (!record) {
    logAttendanceNotFound(id, requestMeta);
    throw makeError(MESSAGES.ATTENDANCE_NOT_FOUND, 404);
  }

  if (updates.device !== undefined) {
    await assertDeviceExists(updates.device);
  }

  // If person or identity is updating, re-verify
  const pType = updates.personType || record.personType;
  const pId = updates.person || record.person;
  const pIdent = updates.attendanceIdentity || record.attendanceIdentity;
  
  if (updates.person !== undefined || updates.personType !== undefined || updates.attendanceIdentity !== undefined) {
    await assertPersonExistsAndMatchesIdentity(pId, pType, pIdent);
  }

  await assertNoDuplicate(
    {
      attendanceCode: updates.attendanceCode,
      person:         updates.person ?? record.person,
      attendanceType: updates.attendanceType ?? record.attendanceType,
      timestamp:      updates.timestamp ?? record.timestamp,
    },
    id,
    requestMeta
  );

  if (updates.status && updates.status !== record.status) {
    logAttendanceCorrected(
      { id: record._id, attendanceCode: record.attendanceCode, oldStatus: record.status, newStatus: updates.status },
      adminEmail,
      requestMeta
    );
  }

  Object.assign(record, updates);
  record.updatedBy = adminEmail;
  await record.save();

  await record.populate({
    path: 'person',
    select: 'firstName lastName fullName department',
    populate: { path: 'department', select: 'name code' }
  });
  await record.populate('device', 'deviceCode deviceName deviceType');

  logAttendanceUpdated(
    { id: record._id, attendanceCode: record.attendanceCode },
    adminEmail,
    requestMeta
  );

  return record.toPublicJSON();
};

export const softDeleteAttendance = async (id, adminEmail, requestMeta = {}) => {
  const record = await Attendance.findById(id);

  if (!record) {
    logAttendanceNotFound(id, requestMeta);
    throw makeError(MESSAGES.ATTENDANCE_NOT_FOUND, 404);
  }

  if (!record.isActive) {
    throw makeError(MESSAGES.ATTENDANCE_ALREADY_INACTIVE, 400);
  }

  record.isActive  = false;
  record.deletedAt = new Date();
  record.deletedBy = adminEmail;
  record.updatedBy = adminEmail;
  await record.save();

  logAttendanceDeleted(
    { id: record._id, attendanceCode: record.attendanceCode },
    adminEmail,
    requestMeta
  );
};

export const restoreAttendance = async (id, adminEmail, requestMeta = {}) => {
  const record = await Attendance.findById(id);

  if (!record) {
    logAttendanceNotFound(id, requestMeta);
    throw makeError(MESSAGES.ATTENDANCE_NOT_FOUND, 404);
  }

  if (record.isActive) {
    throw makeError(MESSAGES.ATTENDANCE_ALREADY_ACTIVE, 400);
  }

  record.isActive  = true;
  record.deletedAt = null;
  record.deletedBy = null;
  record.updatedBy = adminEmail;
  await record.save();

  await record.populate({
    path: 'person',
    select: 'firstName lastName fullName department',
    populate: { path: 'department', select: 'name code' }
  });
  await record.populate('device', 'deviceCode deviceName deviceType');

  logAttendanceRestored(
    { id: record._id, attendanceCode: record.attendanceCode },
    adminEmail,
    requestMeta
  );

  return record.toPublicJSON();
};
