import Department from './departments.model.js';
import { buildUpdatePayload } from '../../utils/update.util.js';
import { MESSAGES } from '../../constants/index.js';
import {
  logDepartmentListFetched,
  logDepartmentFetched,
  logDepartmentCreated,
  logDepartmentUpdated,
  logDepartmentDeleted,
  logDepartmentRestored,
  logDepartmentNotFound,
  logDepartmentConflict,
} from './departments.logger.js';
import { activityService } from '../activity/activity.service.js';
import { ACTIVITY_MODULES, ACTIVITY_ACTIONS, ACTIVITY_STATUS, ACTIVITY_SEVERITY } from '../../constants/index.js';
import Admin from '../auth/auth.model.js';

/**
 * Department Service
 *
 * Contains all department business logic and Mongoose interaction.
 * Controllers are kept thin — they call these functions and map results to HTTP.
 *
 * Error convention (matches auth.service.js):
 *   Typed errors (known failures) throw an `Error` with a `.statusCode` property.
 *   Unexpected DB errors are allowed to bubble up to the global errorHandler as 500s.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a typed service error to be caught by the controller.
 * @param {string} message  - User-facing error message
 * @param {number} status   - HTTP status code
 * @returns {Error}
 */
const makeError = (message, status) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

/**
 * Check for duplicate `name` or `code` on the Department collection.
 * Excludes the document identified by `excludeId` (for update operations).
 *
 * Checks both fields independently so the error message and log entry are
 * precise about which field caused the conflict.
 *
 * @param {{ name?: string, code?: string }} fields
 * @param {string|null} [excludeId=null]
 * @param {object}      [requestMeta={}]
 * @throws {Error} 409 if a conflict is detected
 */
const assertNoDuplicate = async ({ name, code }, excludeId = null, requestMeta = {}) => {
  const orConditions = [];
  if (name) orConditions.push({ name: new RegExp(`^${name.trim()}$`, 'i') });
  if (code) orConditions.push({ code: code.trim().toUpperCase() });

  if (orConditions.length === 0) return;

  const filter = { $or: orConditions };
  if (excludeId) filter._id = { $ne: excludeId };

  const existing = await Department.findOne(filter).select('name code').lean();

  if (!existing) return;

  // Determine which field clashed so the log and message are precise
  if (name && existing.name.toLowerCase() === name.trim().toLowerCase()) {
    logDepartmentConflict({ field: 'name', value: name.trim() }, requestMeta);
    throw makeError(MESSAGES.DEPARTMENT_NAME_TAKEN, 409);
  }

  logDepartmentConflict({ field: 'code', value: code?.trim().toUpperCase() }, requestMeta);
  throw makeError(MESSAGES.DEPARTMENT_CODE_TAKEN, 409);
};

// ─── Read Operations ──────────────────────────────────────────────────────────

/**
 * Retrieve a paginated, searchable list of departments.
 *
 * @param {object} query
 * @param {number}          [query.page=1]
 * @param {number}          [query.limit=10]
 * @param {string}          [query.search]         - Case-insensitive match on name or code
 * @param {boolean|'all'}   [query.isActive='all'] - Filter by active/inactive status
 * @param {string}          [query.sortBy='createdAt']
 * @param {'asc'|'desc'}    [query.sortOrder='desc']
 * @param {object}          [requestMeta={}]
 * @returns {Promise<{ departments: object[], pagination: object }>}
 */
export const listDepartments = async (query = {}, requestMeta = {}) => {
  const {
    page      = 1,
    limit     = 10,
    search    = '',
    isActive  = 'all',
    sortBy    = 'createdAt',
    sortOrder = 'desc',
  } = query;

  // ── Filter ────────────────────────────────────────────────────────────────
  const filter = {};

  // isActive: 'all' returns everything; 'true' / 'false' restricts
  if (isActive !== 'all') {
    filter.isActive = isActive === true || isActive === 'true';
  }

  // Case-insensitive search across name and code
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { code: searchRegex }];
  }

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  // ── Pagination ────────────────────────────────────────────────────────────
  const pageNum  = Math.max(1, parseInt(page, 10)  || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip     = (pageNum - 1) * limitNum;

  // Run count and data queries concurrently for efficiency
  const [total, docs] = await Promise.all([
    Department.countDocuments(filter),
    Department.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  // Map lean docs to public shape (lean() returns plain objects — toPublicJSON unavailable)
  const departments = docs.map((doc) => ({
    id:          doc._id,
    name:        doc.name,
    code:        doc.code,
    description: doc.description ?? null,
    isActive:    doc.isActive,
    deletedAt:   doc.deletedAt ?? null,
    deletedBy:   doc.deletedBy ?? null,
    createdBy:   doc.createdBy,
    updatedBy:   doc.updatedBy ?? null,
    createdAt:   doc.createdAt,
    updatedAt:   doc.updatedAt,
  }));

  logDepartmentListFetched({ total, page: pageNum }, requestMeta);

  return {
    departments,
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
 * Find a single department by its MongoDB `_id`.
 *
 * @param {string} id           - MongoDB ObjectId string
 * @param {object} [requestMeta={}]
 * @returns {Promise<object>}   - Public department JSON
 * @throws {Error} 404 if not found
 */
export const getDepartmentById = async (id, requestMeta = {}) => {
  const dept = await Department.findById(id);

  if (!dept) {
    logDepartmentNotFound(id, requestMeta);
    throw makeError(MESSAGES.DEPARTMENT_NOT_FOUND, 404);
  }

  logDepartmentFetched(id, requestMeta);
  return dept.toPublicJSON();
};

// ─── Write Operations ─────────────────────────────────────────────────────────

/**
 * Create a new department.
 *
 * @param {object} data
 * @param {string}       data.name
 * @param {string}       data.code
 * @param {string|null}  [data.description]
 * @param {string}       adminEmail   - Acting admin email (stored as createdBy)
 * @param {object}       [requestMeta={}]
 * @returns {Promise<object>}          - Created department public JSON
 * @throws {Error} 409 if name or code already exists
 */
export const createDepartment = async (data, adminEmail, requestMeta = {}) => {
  const { name, code, description = null } = data;

  await assertNoDuplicate({ name, code }, null, requestMeta);

  const dept = await Department.create({
    name,
    code,
    description,
    createdBy: adminEmail,
  });

  logDepartmentCreated({ id: dept._id, name: dept.name, code: dept.code }, adminEmail, requestMeta);

  // We need to resolve adminEmail to an ObjectId if performedBy expects ObjectId.
  // We'll leave performedBy null if not passed an ID, or we can look it up.
  // For now, we put adminEmail in metadata.
  activityService.recordActivity({
    module: ACTIVITY_MODULES.DEPARTMENT,
    action: ACTIVITY_ACTIONS.CREATE,
    entityType: 'Department',
    entityId: dept._id,
    description: `Created department ${dept.name} (${dept.code})`,
    metadata: { adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.LOW
  }).catch(() => {});

  return dept.toPublicJSON();
};

/**
 * Update an existing department's mutable fields.
 * Only provided fields are changed — partial update semantics on the PUT route.
 *
 * @param {string} id            - Department _id
 * @param {object} data          - Fields to update: name, code, description
 * @param {string} adminEmail    - Acting admin email (stored as updatedBy)
 * @param {object} [requestMeta={}]
 * @returns {Promise<object>}     - Updated department public JSON
 * @throws {Error} 400 if no fields provided, 404 if not found, 409 on conflict
 */
export const updateDepartment = async (id, data, adminEmail, requestMeta = {}) => {
  const allowedFields = ['name', 'code', 'description'];
  const updates = buildUpdatePayload(data, allowedFields);

  if (Object.keys(updates).length === 0) {
    throw makeError(MESSAGES.DEPARTMENT_NO_CHANGES, 400);
  }

  // Check existence before uniqueness to give the most accurate error
  const dept = await Department.findById(id);
  if (!dept) {
    logDepartmentNotFound(id, requestMeta);
    throw makeError(MESSAGES.DEPARTMENT_NOT_FOUND, 404);
  }

  // Uniqueness check — exclude the current document
  if (updates.name || updates.code) {
    await assertNoDuplicate(
      { name: updates.name, code: updates.code },
      id,
      requestMeta
    );
  }

  // Apply field updates and stamp updatedBy
  dept.set(updates);
  dept.updatedBy = adminEmail;
  await dept.save();

  logDepartmentUpdated({ id: dept._id, name: dept.name, code: dept.code }, adminEmail, requestMeta);

  activityService.recordActivity({
    module: ACTIVITY_MODULES.DEPARTMENT,
    action: ACTIVITY_ACTIONS.UPDATE,
    entityType: 'Department',
    entityId: dept._id,
    description: `Updated department ${dept.name} (${dept.code})`,
    metadata: { updates, adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.LOW
  }).catch(() => {});

  return dept.toPublicJSON();
};

/**
 * Soft-delete a department.
 * Sets `isActive: false`, `deletedAt: now`, `deletedBy: adminEmail`.
 *
 * @param {string} id
 * @param {string} adminEmail
 * @param {object} [requestMeta={}]
 * @returns {Promise<void>}
 * @throws {Error} 404 if not found, 400 if already inactive
 */
export const softDeleteDepartment = async (id, adminEmail, requestMeta = {}) => {
  const dept = await Department.findById(id);

  if (!dept) {
    logDepartmentNotFound(id, requestMeta);
    throw makeError(MESSAGES.DEPARTMENT_NOT_FOUND, 404);
  }

  if (!dept.isActive) {
    throw makeError(MESSAGES.DEPARTMENT_ALREADY_INACTIVE, 400);
  }

  dept.isActive   = false;
  dept.deletedAt  = new Date();
  dept.deletedBy  = adminEmail;
  dept.updatedBy  = adminEmail;
  await dept.save();

  logDepartmentDeleted({ id: dept._id, name: dept.name, code: dept.code }, adminEmail, requestMeta);

  activityService.recordActivity({
    module: ACTIVITY_MODULES.DEPARTMENT,
    action: ACTIVITY_ACTIONS.DELETE,
    entityType: 'Department',
    entityId: dept._id,
    description: `Soft-deleted department ${dept.name} (${dept.code})`,
    metadata: { adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.MEDIUM
  }).catch(() => {});
};

/**
 * Restore a soft-deleted department.
 * Sets `isActive: true`, clears `deletedAt` and `deletedBy`.
 *
 * @param {string} id
 * @param {string} adminEmail
 * @param {object} [requestMeta={}]
 * @returns {Promise<object>}  - Restored department public JSON
 * @throws {Error} 404 if not found, 400 if already active
 */
export const restoreDepartment = async (id, adminEmail, requestMeta = {}) => {
  const dept = await Department.findById(id);

  if (!dept) {
    logDepartmentNotFound(id, requestMeta);
    throw makeError(MESSAGES.DEPARTMENT_NOT_FOUND, 404);
  }

  if (dept.isActive) {
    throw makeError(MESSAGES.DEPARTMENT_ALREADY_ACTIVE, 400);
  }

  dept.isActive  = true;
  dept.deletedAt = null;
  dept.deletedBy = null;
  dept.updatedBy = adminEmail;
  await dept.save();

  logDepartmentRestored({ id: dept._id, name: dept.name, code: dept.code }, adminEmail, requestMeta);

  activityService.recordActivity({
    module: ACTIVITY_MODULES.DEPARTMENT,
    action: ACTIVITY_ACTIONS.RESTORE,
    entityType: 'Department',
    entityId: dept._id,
    description: `Restored department ${dept.name} (${dept.code})`,
    metadata: { adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.LOW
  }).catch(() => {});

  return dept.toPublicJSON();
};
