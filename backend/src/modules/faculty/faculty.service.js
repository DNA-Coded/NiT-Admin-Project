import mongoose from 'mongoose';
import Faculty from './faculty.model.js';
import Department from '../departments/departments.model.js';
import { MESSAGES } from '../../constants/index.js';
import {
  logFacultyListFetched,
  logFacultyFetched,
  logFacultyCreated,
  logFacultyUpdated,
  logFacultyDeleted,
  logFacultyRestored,
  logFacultyNotFound,
  logFacultyConflict,
  logFacultyDeptNotFound,
} from './faculty.logger.js';
import { activityService } from '../activity/activity.service.js';
import { ACTIVITY_MODULES, ACTIVITY_ACTIONS, ACTIVITY_STATUS, ACTIVITY_SEVERITY } from '../../constants/index.js';

/**
 * Faculty Service
 *
 * Contains all faculty business logic and Mongoose interaction.
 * Controllers are kept thin — they call these functions and map results to HTTP.
 *
 * Error convention (matches departments.service.js):
 *   Typed errors throw an `Error` with a `.statusCode` property.
 *   Unexpected DB errors bubble up to the global errorHandler as 500s.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a typed service error to be caught by the controller.
 * @param {string} message
 * @param {number} status
 * @returns {Error}
 */
const makeError = (message, status) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

/**
 * Verify the referenced Department exists and is active.
 * Called before any create or update that sets/changes the department field.
 *
 * @param {string} departmentId  - ObjectId string
 * @param {object} [requestMeta={}]
 * @throws {Error} 404 if department not found or inactive
 */
const assertDepartmentExists = async (departmentId, requestMeta = {}) => {
  // A null/undefined departmentId means the field was not changed — skip check
  if (!departmentId) return;

  const dept = await Department.findById(departmentId).select('isActive').lean();

  if (!dept) {
    logFacultyDeptNotFound(departmentId, requestMeta);
    throw makeError(MESSAGES.DEPARTMENT_NOT_FOUND, 404);
  }

  if (!dept.isActive) {
    logFacultyDeptNotFound(departmentId, requestMeta);
    throw makeError('The referenced department is inactive and cannot be assigned.', 422);
  }
};

/**
 * Check for duplicate values on unique faculty fields.
 * Runs independent checks for each provided field so the error message is precise.
 * Excludes the current document (`excludeId`) during update operations.
 *
 * Checked fields: employeeId, email (when provided), attendanceIdentity
 *
 * @param {{ employeeId?: string, email?: string, attendanceIdentity?: string }} fields
 * @param {string|null} [excludeId=null]
 * @param {object}      [requestMeta={}]
 * @throws {Error} 409 on first conflict found
 */
const assertNoDuplicate = async (fields, excludeId = null, requestMeta = {}) => {
  const { employeeId, email, attendanceIdentity } = fields;

  // Build each check only for the fields that are actually being set
  const checks = [];

  if (employeeId) {
    checks.push({
      filter: { employeeId: employeeId.trim() },
      field:  'employeeId',
      value:  employeeId.trim(),
      msg:    MESSAGES.FACULTY_EMPLOYEE_ID_TAKEN,
    });
  }

  // Only check email uniqueness when a non-null email is being set
  if (email && email.trim() !== '') {
    checks.push({
      filter: { email: email.trim().toLowerCase() },
      field:  'email',
      value:  email.trim(),
      msg:    MESSAGES.FACULTY_EMAIL_TAKEN,
    });
  }

  if (attendanceIdentity) {
    checks.push({
      filter: { attendanceIdentity: attendanceIdentity.trim() },
      field:  'attendanceIdentity',
      value:  attendanceIdentity.trim(),
      msg:    MESSAGES.FACULTY_ATTENDANCE_IDENTITY_TAKEN,
    });
  }

  for (const { filter, field, value, msg } of checks) {
    if (excludeId) filter._id = { $ne: excludeId };

    // eslint-disable-next-line no-await-in-loop
    const existing = await Faculty.findOne(filter).select('_id').lean();
    if (existing) {
      logFacultyConflict({ field, value }, requestMeta);
      throw makeError(msg, 409);
    }
  }
};

// ─── Shared projection ────────────────────────────────────────────────────────

/**
 * Map a lean document to the standard public shape for the list endpoint.
 * Mirrors toPublicJSON() but works on plain objects returned by .lean().
 * The `department` field is already populated before .lean() is called.
 *
 * @param {object} doc - Lean Faculty document with department populated
 * @returns {object}
 */
const toListItem = (doc) => {
  const dept = doc.department;
  const departmentField =
    dept && typeof dept === 'object' && dept._id
      ? { id: dept._id, name: dept.name, code: dept.code }
      : dept ?? null;

  return {
    id:                 doc._id,
    employeeId:         doc.employeeId,
    firstName:          doc.firstName,
    lastName:           doc.lastName,
    fullName:           `${doc.firstName} ${doc.lastName}`,
    email:              doc.email ?? null,
    phone:              doc.phone ?? null,
    designation:        doc.designation,
    department:         departmentField,
    status:             doc.status,
    joiningDate:        doc.joiningDate ?? null,
    profileImage:       doc.profileImage ?? null,
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

// ─── Read Operations ──────────────────────────────────────────────────────────

/**
 * Retrieve a paginated, searchable list of faculty records.
 *
 * @param {object} query
 * @param {number}         [query.page=1]
 * @param {number}         [query.limit=10]
 * @param {string}         [query.search]          - Regex match on employeeId, firstName, lastName, email
 * @param {string}         [query.department]      - ObjectId string — filter by department
 * @param {string}         [query.designation]     - Exact match filter
 * @param {string|boolean} [query.isActive='all']  - 'true', 'false', or 'all'
 * @param {string}         [query.sortBy='createdAt']
 * @param {'asc'|'desc'}   [query.sortOrder='desc']
 * @param {object}         [requestMeta={}]
 * @returns {Promise<{ faculty: object[], pagination: object }>}
 */
export const listFaculty = async (query = {}, requestMeta = {}) => {
  const {
    page        = 1,
    limit       = 10,
    search      = '',
    department  = null,
    designation = null,
    status      = null,
    isActive    = 'all',
    sortBy      = 'createdAt',
    sortOrder   = 'desc',
  } = query;

  // ── Filter ────────────────────────────────────────────────────────────────
  const filter = {};

  if (isActive !== 'all') {
    filter.isActive = isActive === true || isActive === 'true';
  }

  if (department && mongoose.Types.ObjectId.isValid(department)) {
    filter.department = new mongoose.Types.ObjectId(department);
  }

  if (designation && designation.trim()) {
    filter.designation = new RegExp(`^${designation.trim()}$`, 'i');
  }

  if (status && status.trim()) {
    filter.status = status.trim().toUpperCase();
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { employeeId: searchRegex },
      { firstName:  searchRegex },
      { lastName:   searchRegex },
      { email:      searchRegex },
    ];
  }

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  // ── Pagination ────────────────────────────────────────────────────────────
  const pageNum  = Math.max(1, parseInt(page, 10)  || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip     = (pageNum - 1) * limitNum;

  // Run count and data queries concurrently; populate department for rich response
  const [total, docs] = await Promise.all([
    Faculty.countDocuments(filter),
    Faculty.find(filter)
      .populate('department', 'name code')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  logFacultyListFetched({ total, page: pageNum }, requestMeta);

  return {
    faculty: docs.map(toListItem),
    pagination: {
      total,
      page:        pageNum,
      limit:       limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

/**
 * Find a single faculty record by its MongoDB `_id`.
 * Department is populated for the rich response shape.
 *
 * @param {string} id
 * @param {object} [requestMeta={}]
 * @returns {Promise<object>}
 * @throws {Error} 404 if not found
 */
export const getFacultyById = async (id, requestMeta = {}) => {
  const faculty = await Faculty.findById(id).populate('department', 'name code');

  if (!faculty) {
    logFacultyNotFound(id, requestMeta);
    throw makeError(MESSAGES.FACULTY_NOT_FOUND, 404);
  }

  logFacultyFetched(id, requestMeta);
  return faculty.toPublicJSON();
};

// ─── Write Operations ─────────────────────────────────────────────────────────

/**
 * Create a new faculty record.
 *
 * @param {object} data
 * @param {string}      data.employeeId
 * @param {string}      data.firstName
 * @param {string}      data.lastName
 * @param {string|null} [data.email]
 * @param {string|null} [data.phone]
 * @param {string}      data.designation
 * @param {string}      data.department        - ObjectId string
 * @param {string}      data.attendanceIdentity
 * @param {string}      adminEmail             - Acting admin (stored as createdBy)
 * @param {object}      [requestMeta={}]
 * @returns {Promise<object>}
 * @throws {Error} 404 if department not found, 409 on uniqueness conflict
 */
export const createFaculty = async (data, adminEmail, requestMeta = {}) => {
  const {
    employeeId,
    firstName,
    lastName,
    email             = null,
    phone             = null,
    designation,
    department,
    status,
    joiningDate       = null,
    profileImage      = null,
    attendanceIdentity,
  } = data;

  // 1. Verify the department exists and is active
  await assertDepartmentExists(department, requestMeta);

  // 2. Check all unique fields before attempting insert
  await assertNoDuplicate({ employeeId, email, attendanceIdentity }, null, requestMeta);

  // 3. Create the document
  const faculty = await Faculty.create({
    employeeId,
    firstName,
    lastName,
    email:              email ?? null,
    phone:              phone ?? null,
    designation,
    department,
    ...(status      && { status }),
    joiningDate:        joiningDate ?? null,
    profileImage:       profileImage ?? null,
    attendanceIdentity,
    createdBy: adminEmail,
  });

  // Populate department for the response
  await faculty.populate('department', 'name code');

  logFacultyCreated(
    { id: faculty._id, employeeId: faculty.employeeId, fullName: faculty.fullName },
    adminEmail,
    requestMeta
  );

  activityService.recordActivity({
    module: ACTIVITY_MODULES.FACULTY,
    action: ACTIVITY_ACTIONS.CREATE,
    entityType: 'Faculty',
    entityId: faculty._id,
    description: `Created faculty ${faculty.fullName} (${faculty.employeeId})`,
    metadata: { adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.LOW
  }).catch(() => {});

  return faculty.toPublicJSON();
};

/**
 * Update an existing faculty record (partial update — only provided fields change).
 *
 * @param {string} id
 * @param {object} data   - Any subset of: employeeId, firstName, lastName, email,
 *                          phone, designation, department, attendanceIdentity
 * @param {string} adminEmail
 * @param {object} [requestMeta={}]
 * @returns {Promise<object>}
 * @throws {Error} 400 no fields, 404 not found, 409 conflict
 */
export const updateFaculty = async (id, data, adminEmail, requestMeta = {}) => {
  const allowedFields = [
    'employeeId', 'firstName', 'lastName', 'email',
    'phone', 'designation', 'department', 'attendanceIdentity',
    'status', 'joiningDate', 'profileImage',
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      updates[field] = data[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw makeError(MESSAGES.FACULTY_NO_CHANGES, 400);
  }

  // Check existence first
  const faculty = await Faculty.findById(id);
  if (!faculty) {
    logFacultyNotFound(id, requestMeta);
    throw makeError(MESSAGES.FACULTY_NOT_FOUND, 404);
  }

  // Verify department if it is being changed
  if (updates.department) {
    await assertDepartmentExists(updates.department, requestMeta);
  }

  // Uniqueness checks for the fields that are changing
  await assertNoDuplicate(
    {
      employeeId:         updates.employeeId,
      email:              updates.email,
      attendanceIdentity: updates.attendanceIdentity,
    },
    id,
    requestMeta
  );

  // Apply updates and stamp audit fields
  Object.assign(faculty, updates);
  faculty.updatedBy = adminEmail;
  await faculty.save();

  await faculty.populate('department', 'name code');

  logFacultyUpdated(
    { id: faculty._id, employeeId: faculty.employeeId, fullName: faculty.fullName },
    adminEmail,
    requestMeta
  );

  activityService.recordActivity({
    module: ACTIVITY_MODULES.FACULTY,
    action: ACTIVITY_ACTIONS.UPDATE,
    entityType: 'Faculty',
    entityId: faculty._id,
    description: `Updated faculty ${faculty.fullName} (${faculty.employeeId})`,
    metadata: { updates, adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.LOW
  }).catch(() => {});

  return faculty.toPublicJSON();
};

/**
 * Soft-delete a faculty record.
 * Sets `isActive: false`, `deletedAt: now`, `deletedBy`, and `updatedBy`.
 *
 * @param {string} id
 * @param {string} adminEmail
 * @param {object} [requestMeta={}]
 * @returns {Promise<void>}
 * @throws {Error} 404 if not found, 400 if already inactive
 */
export const softDeleteFaculty = async (id, adminEmail, requestMeta = {}) => {
  const faculty = await Faculty.findById(id);

  if (!faculty) {
    logFacultyNotFound(id, requestMeta);
    throw makeError(MESSAGES.FACULTY_NOT_FOUND, 404);
  }

  if (!faculty.isActive) {
    throw makeError(MESSAGES.FACULTY_ALREADY_INACTIVE, 400);
  }

  faculty.isActive  = false;
  faculty.deletedAt = new Date();
  faculty.deletedBy = adminEmail;
  faculty.updatedBy = adminEmail;
  await faculty.save();

  logFacultyDeleted(
    { id: faculty._id, employeeId: faculty.employeeId, fullName: faculty.fullName },
    adminEmail,
    requestMeta
  );

  activityService.recordActivity({
    module: ACTIVITY_MODULES.FACULTY,
    action: ACTIVITY_ACTIONS.DELETE,
    entityType: 'Faculty',
    entityId: faculty._id,
    description: `Soft-deleted faculty ${faculty.fullName} (${faculty.employeeId})`,
    metadata: { adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.MEDIUM
  }).catch(() => {});
};

/**
 * Restore a soft-deleted faculty record.
 * Sets `isActive: true`, clears `deletedAt` and `deletedBy`, stamps `updatedBy`.
 *
 * @param {string} id
 * @param {string} adminEmail
 * @param {object} [requestMeta={}]
 * @returns {Promise<object>}
 * @throws {Error} 404 if not found, 400 if already active
 */
export const restoreFaculty = async (id, adminEmail, requestMeta = {}) => {
  const faculty = await Faculty.findById(id);

  if (!faculty) {
    logFacultyNotFound(id, requestMeta);
    throw makeError(MESSAGES.FACULTY_NOT_FOUND, 404);
  }

  if (faculty.isActive) {
    throw makeError(MESSAGES.FACULTY_ALREADY_ACTIVE, 400);
  }

  faculty.isActive  = true;
  faculty.deletedAt = null;
  faculty.deletedBy = null;
  faculty.updatedBy = adminEmail;
  await faculty.save();

  await faculty.populate('department', 'name code');

  logFacultyRestored(
    { id: faculty._id, employeeId: faculty.employeeId, fullName: faculty.fullName },
    adminEmail,
    requestMeta
  );

  activityService.recordActivity({
    module: ACTIVITY_MODULES.FACULTY,
    action: ACTIVITY_ACTIONS.RESTORE,
    entityType: 'Faculty',
    entityId: faculty._id,
    description: `Restored faculty ${faculty.fullName} (${faculty.employeeId})`,
    metadata: { adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.LOW
  }).catch(() => {});

  return faculty.toPublicJSON();
};
