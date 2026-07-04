import mongoose from 'mongoose';
import Student from './student.model.js';
import Department from '../departments/departments.model.js';
import { MESSAGES } from '../../constants/index.js';
import {
  logStudentListFetched,
  logStudentFetched,
  logStudentCreated,
  logStudentUpdated,
  logStudentDeleted,
  logStudentRestored,
  logStudentNotFound,
  logStudentConflict,
  logStudentDeptNotFound,
} from './student.logger.js';

const makeError = (message, status) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

const assertDepartmentExists = async (departmentId, requestMeta = {}) => {
  if (!departmentId) return;

  const dept = await Department.findById(departmentId).select('isActive').lean();

  if (!dept) {
    logStudentDeptNotFound(departmentId, requestMeta);
    throw makeError(MESSAGES.DEPARTMENT_NOT_FOUND, 404);
  }

  if (!dept.isActive) {
    logStudentDeptNotFound(departmentId, requestMeta);
    throw makeError('The referenced department is inactive and cannot be assigned.', 422);
  }
};

const assertNoDuplicate = async (fields, excludeId = null, requestMeta = {}) => {
  const { rollNumber, registrationNumber, email, attendanceIdentity } = fields;
  const checks = [];

  if (rollNumber) {
    checks.push({
      filter: { rollNumber: rollNumber.trim() },
      field:  'rollNumber',
      value:  rollNumber.trim(),
      msg:    MESSAGES.STUDENT_ROLL_NUMBER_TAKEN,
    });
  }

  if (registrationNumber) {
    checks.push({
      filter: { registrationNumber: registrationNumber.trim() },
      field:  'registrationNumber',
      value:  registrationNumber.trim(),
      msg:    MESSAGES.STUDENT_REG_NUMBER_TAKEN,
    });
  }

  if (email && email.trim() !== '') {
    checks.push({
      filter: { email: email.trim().toLowerCase() },
      field:  'email',
      value:  email.trim(),
      msg:    MESSAGES.STUDENT_EMAIL_TAKEN,
    });
  }

  if (attendanceIdentity) {
    checks.push({
      filter: { attendanceIdentity: attendanceIdentity.trim() },
      field:  'attendanceIdentity',
      value:  attendanceIdentity.trim(),
      msg:    MESSAGES.STUDENT_ATTENDANCE_IDENTITY_TAKEN,
    });
  }

  for (const { filter, field, value, msg } of checks) {
    if (excludeId) filter._id = { $ne: excludeId };

    // eslint-disable-next-line no-await-in-loop
    const existing = await Student.findOne(filter).select('_id').lean();
    if (existing) {
      logStudentConflict({ field, value }, requestMeta);
      throw makeError(msg, 409);
    }
  }
};

const toListItem = (doc) => {
  const dept = doc.department;
  const departmentField =
    dept && typeof dept === 'object' && dept._id
      ? { id: dept._id, name: dept.name, code: dept.code }
      : dept ?? null;

  return {
    id:                 doc._id,
    rollNumber:         doc.rollNumber,
    registrationNumber: doc.registrationNumber,
    firstName:          doc.firstName,
    lastName:           doc.lastName,
    fullName:           `${doc.firstName} ${doc.lastName}`,
    email:              doc.email ?? null,
    phone:              doc.phone ?? null,
    profileImage:       doc.profileImage ?? null,
    department:         departmentField,
    semester:           doc.semester,
    section:            doc.section ?? null,
    batch:              doc.batch,
    academicSession:    doc.academicSession,
    status:             doc.status,
    attendanceIdentity: doc.attendanceIdentity,
    isActive:           doc.isActive,
    deletedAt:          doc.deletedAt ?? null,
    deletedBy:          doc.deletedBy ?? null,
    createdBy:          doc.createdBy,
    updatedBy:          doc.updatedBy ?? null,
    createdAt:          doc.createdAt,
    updatedAt:          doc.updatedAt,
  };
};

export const listStudents = async (query = {}, requestMeta = {}) => {
  const {
    page = 1, limit = 10, search = '',
    department = null, semester = null, section = null,
    batch = null, academicSession = null, status = null,
    isActive = 'all', sortBy = 'createdAt', sortOrder = 'desc',
  } = query;

  const filter = {};

  if (isActive !== 'all') {
    filter.isActive = isActive === true || isActive === 'true';
  }

  if (department && mongoose.Types.ObjectId.isValid(department)) {
    filter.department = new mongoose.Types.ObjectId(department);
  }

  if (semester) {
    const sem = parseInt(semester, 10);
    if (!isNaN(sem)) filter.semester = sem;
  }

  if (section && section.trim()) {
    filter.section = new RegExp(`^${section.trim()}$`, 'i');
  }

  if (batch && batch.trim()) {
    filter.batch = new RegExp(`^${batch.trim()}$`, 'i');
  }

  if (academicSession && academicSession.trim()) {
    filter.academicSession = new RegExp(`^${academicSession.trim()}$`, 'i');
  }

  if (status && status.trim()) {
    filter.status = status.trim().toUpperCase();
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { rollNumber: searchRegex },
      { registrationNumber: searchRegex },
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
    ];
  }

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [total, docs] = await Promise.all([
    Student.countDocuments(filter),
    Student.find(filter)
      .populate('department', 'name code')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  logStudentListFetched({ total, page: pageNum }, requestMeta);

  return {
    students: docs.map(toListItem),
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

export const getStudentById = async (id, requestMeta = {}) => {
  const student = await Student.findById(id).populate('department', 'name code');

  if (!student) {
    logStudentNotFound(id, requestMeta);
    throw makeError(MESSAGES.STUDENT_NOT_FOUND, 404);
  }

  logStudentFetched(id, requestMeta);
  return student.toPublicJSON();
};

export const createStudent = async (data, adminEmail, requestMeta = {}) => {
  const {
    rollNumber, registrationNumber, firstName, lastName,
    email = null, phone = null, profileImage = null,
    department, semester, section = null, batch, academicSession,
    attendanceIdentity, status,
  } = data;

  await assertDepartmentExists(department, requestMeta);
  await assertNoDuplicate({ rollNumber, registrationNumber, email, attendanceIdentity }, null, requestMeta);

  const student = await Student.create({
    rollNumber, registrationNumber, firstName, lastName,
    email: email ?? null, phone: phone ?? null, profileImage: profileImage ?? null,
    department, semester, section: section ?? null, batch, academicSession,
    attendanceIdentity,
    ...(status && { status }),
    createdBy: adminEmail,
  });

  await student.populate('department', 'name code');

  logStudentCreated(
    { id: student._id, rollNumber: student.rollNumber, fullName: student.fullName },
    adminEmail,
    requestMeta
  );

  return student.toPublicJSON();
};

export const updateStudent = async (id, data, adminEmail, requestMeta = {}) => {
  const allowedFields = [
    'rollNumber', 'registrationNumber', 'firstName', 'lastName',
    'email', 'phone', 'profileImage', 'department', 'semester',
    'section', 'batch', 'academicSession', 'attendanceIdentity', 'status',
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      updates[field] = data[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw makeError(MESSAGES.STUDENT_NO_CHANGES, 400);
  }

  const student = await Student.findById(id);
  if (!student) {
    logStudentNotFound(id, requestMeta);
    throw makeError(MESSAGES.STUDENT_NOT_FOUND, 404);
  }

  if (updates.department) {
    await assertDepartmentExists(updates.department, requestMeta);
  }

  await assertNoDuplicate(
    {
      rollNumber:         updates.rollNumber,
      registrationNumber: updates.registrationNumber,
      email:              updates.email,
      attendanceIdentity: updates.attendanceIdentity,
    },
    id,
    requestMeta
  );

  Object.assign(student, updates);
  student.updatedBy = adminEmail;
  await student.save();

  await student.populate('department', 'name code');

  logStudentUpdated(
    { id: student._id, rollNumber: student.rollNumber, fullName: student.fullName },
    adminEmail,
    requestMeta
  );

  return student.toPublicJSON();
};

export const softDeleteStudent = async (id, adminEmail, requestMeta = {}) => {
  const student = await Student.findById(id);

  if (!student) {
    logStudentNotFound(id, requestMeta);
    throw makeError(MESSAGES.STUDENT_NOT_FOUND, 404);
  }

  if (!student.isActive) {
    throw makeError(MESSAGES.STUDENT_ALREADY_INACTIVE, 400);
  }

  student.isActive  = false;
  student.deletedAt = new Date();
  student.deletedBy = adminEmail;
  student.updatedBy = adminEmail;
  await student.save();

  logStudentDeleted(
    { id: student._id, rollNumber: student.rollNumber, fullName: student.fullName },
    adminEmail,
    requestMeta
  );
};

export const restoreStudent = async (id, adminEmail, requestMeta = {}) => {
  const student = await Student.findById(id);

  if (!student) {
    logStudentNotFound(id, requestMeta);
    throw makeError(MESSAGES.STUDENT_NOT_FOUND, 404);
  }

  if (student.isActive) {
    throw makeError(MESSAGES.STUDENT_ALREADY_ACTIVE, 400);
  }

  student.isActive  = true;
  student.deletedAt = null;
  student.deletedBy = null;
  student.updatedBy = adminEmail;
  await student.save();

  await student.populate('department', 'name code');

  logStudentRestored(
    { id: student._id, rollNumber: student.rollNumber, fullName: student.fullName },
    adminEmail,
    requestMeta
  );

  return student.toPublicJSON();
};
