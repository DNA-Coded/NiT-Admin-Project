import Device from './device.model.js';
import Department from '../departments/departments.model.js';
import { MESSAGES } from '../../constants/index.js';
import {
  logDeviceListFetched,
  logDeviceFetched,
  logDeviceCreated,
  logDeviceUpdated,
  logDeviceAssignmentChanged,
  logDeviceConfigUpdated,
  logDeviceHeartbeatUpdated,
  logDeviceAttendanceToggled,
  logDeviceDefaultChanged,
  logDeviceStatusChanged,
  logDeviceDeleted,
  logDeviceRestored,
  logDeviceNotFound,
  logDeviceConflict,
} from './device.logger.js';

const makeError = (message, status) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

const assertDepartmentExists = async (departmentId, requestMeta = {}) => {
  if (!departmentId) return;

  const dept = await Department.findById(departmentId).select('isActive').lean();

  if (!dept) {
    throw makeError(MESSAGES.DEPARTMENT_NOT_FOUND, 404);
  }

  if (!dept.isActive) {
    throw makeError('The referenced department is inactive and cannot be assigned.', 422);
  }
};

const assertNoDuplicate = async (fields, excludeId = null, requestMeta = {}) => {
  const { deviceCode, serialNumber } = fields;
  const checks = [];

  if (deviceCode) {
    checks.push({
      filter: { deviceCode: deviceCode.trim().toUpperCase() },
      field:  'deviceCode',
      value:  deviceCode.trim().toUpperCase(),
      msg:    MESSAGES.DEVICE_CODE_TAKEN,
    });
  }

  if (serialNumber) {
    checks.push({
      filter: { serialNumber: serialNumber.trim() },
      field:  'serialNumber',
      value:  serialNumber.trim(),
      msg:    MESSAGES.DEVICE_SERIAL_TAKEN,
    });
  }

  for (const { filter, field, value, msg } of checks) {
    if (excludeId) filter._id = { $ne: excludeId };

    // eslint-disable-next-line no-await-in-loop
    const existing = await Device.findOne(filter).select('_id').lean();
    if (existing) {
      logDeviceConflict({ field, value }, requestMeta);
      throw makeError(msg, 409);
    }
  }
};

const toListItem = (doc) => {
  const dept = doc.assignedDepartment;
  const assignedDepartmentField =
    dept && typeof dept === 'object' && dept._id
      ? { id: dept._id, name: dept.name, code: dept.code }
      : dept ?? null;

  return {
    id:                  doc._id,
    deviceCode:          doc.deviceCode,
    deviceName:          doc.deviceName,
    deviceCategory:      doc.deviceCategory,
    supportedVerificationMethods: doc.supportedVerificationMethods,
    manufacturer:        doc.manufacturer,
    model:               doc.model,
    serialNumber:        doc.serialNumber,
    firmwareVersion:     doc.firmwareVersion ?? null,
    ipAddress:           doc.ipAddress,
    macAddress:          doc.macAddress ?? null,
    port:                doc.port,
    campus:              doc.campus ?? null,
    building:            doc.building,
    floor:               doc.floor,
    room:                doc.room,
    locationDescription: doc.locationDescription ?? null,
    assignedDepartment:  assignedDepartmentField,
    connectionMode:      doc.connectionMode ?? null,
    heartbeatInterval:   doc.heartbeatInterval ?? null,
    isAttendanceEnabled: doc.isAttendanceEnabled,
    isDefaultDevice:     doc.isDefaultDevice,
    status:              doc.status,
    lastSeen:            doc.lastSeen ?? null,
    lastSync:            doc.lastSync ?? null,
    lastHeartbeat:       doc.lastHeartbeat ?? null,
    lastError:           doc.lastError ?? null,
    isActive:            doc.isActive,
    deletedAt:           doc.deletedAt ?? null,
    deletedBy:           doc.deletedBy ?? null,
    createdBy:           doc.createdBy,
    updatedBy:           doc.updatedBy ?? null,
    createdAt:           doc.createdAt,
    updatedAt:           doc.updatedAt,
  };
};

export const listDevices = async (query = {}, requestMeta = {}) => {
  const {
    page = 1, limit = 10, search = '',
    deviceCategory = null, status = null, building = null, floor = null,
    assignedDepartment = null, connectionMode = null,
    isAttendanceEnabled = 'all', isDefaultDevice = 'all',
    isActive = 'all', sortBy = 'createdAt', sortOrder = 'desc',
  } = query;

  const filter = {};

  if (isActive !== 'all') {
    filter.isActive = isActive === true || isActive === 'true';
  }

  if (isAttendanceEnabled !== 'all') {
    filter.isAttendanceEnabled = isAttendanceEnabled === true || isAttendanceEnabled === 'true';
  }

  if (isDefaultDevice !== 'all') {
    filter.isDefaultDevice = isDefaultDevice === true || isDefaultDevice === 'true';
  }

  if (assignedDepartment && mongoose.Types.ObjectId.isValid(assignedDepartment)) {
    filter.assignedDepartment = new mongoose.Types.ObjectId(assignedDepartment);
  }

  if (connectionMode && connectionMode.trim()) {
    filter.connectionMode = connectionMode.trim().toUpperCase();
  }

  if (deviceCategory && deviceCategory.trim()) {
    filter.deviceCategory = deviceCategory.trim().toUpperCase();
  }

  if (status && status.trim()) {
    filter.status = status.trim().toUpperCase();
  }

  if (building && building.trim()) {
    filter.building = new RegExp(`^${building.trim()}$`, 'i');
  }

  if (floor && floor.trim()) {
    filter.floor = new RegExp(`^${floor.trim()}$`, 'i');
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { deviceCode: searchRegex },
      { deviceName: searchRegex },
      { manufacturer: searchRegex },
      { model: searchRegex },
      { serialNumber: searchRegex },
    ];
  }

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [total, docs] = await Promise.all([
    Device.countDocuments(filter),
    Device.find(filter)
      .populate('assignedDepartment', 'name code')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  logDeviceListFetched({ total, page: pageNum }, requestMeta);

  return {
    devices: docs.map(toListItem),
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

export const getDeviceById = async (id, requestMeta = {}) => {
  const device = await Device.findById(id).populate('assignedDepartment', 'name code');

  if (!device) {
    logDeviceNotFound(id, requestMeta);
    throw makeError(MESSAGES.DEVICE_NOT_FOUND, 404);
  }

  logDeviceFetched(id, requestMeta);
  return device.toPublicJSON();
};

export const createDevice = async (data, adminEmail, requestMeta = {}) => {
  const {
    deviceCode, deviceName, deviceCategory, supportedVerificationMethods, manufacturer, model, serialNumber,
    ipAddress, macAddress = null, port, campus = null, building, floor, room,
    locationDescription = null, firmwareVersion = null, status,
    assignedDepartment = null, connectionMode = null, heartbeatInterval = null,
    isAttendanceEnabled, isDefaultDevice,
  } = data;

  await assertDepartmentExists(assignedDepartment, requestMeta);
  await assertNoDuplicate({ deviceCode, serialNumber }, null, requestMeta);

  const device = await Device.create({
    deviceCode, deviceName, deviceCategory, supportedVerificationMethods, manufacturer, model, serialNumber,
    ipAddress, macAddress, port, campus, building, floor, room,
    locationDescription, firmwareVersion,
    assignedDepartment, connectionMode, heartbeatInterval,
    ...(isAttendanceEnabled !== undefined && { isAttendanceEnabled }),
    ...(isDefaultDevice !== undefined && { isDefaultDevice }),
    ...(status && { status }),
    createdBy: adminEmail,
  });

  await device.populate('assignedDepartment', 'name code');

  logDeviceCreated(
    { id: device._id, deviceCode: device.deviceCode, ipAddress: device.ipAddress },
    adminEmail,
    requestMeta
  );

  return device.toPublicJSON();
};

export const updateDevice = async (id, data, adminEmail, requestMeta = {}) => {
  const allowedFields = [
    'deviceCode', 'deviceName', 'deviceCategory', 'supportedVerificationMethods', 'manufacturer', 'model', 'serialNumber',
    'ipAddress', 'macAddress', 'port', 'campus', 'building', 'floor', 'room',
    'locationDescription', 'firmwareVersion', 'status',
    'assignedDepartment', 'connectionMode', 'heartbeatInterval',
    'isAttendanceEnabled', 'isDefaultDevice',
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      updates[field] = data[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw makeError(MESSAGES.DEVICE_NO_CHANGES, 400);
  }

  const device = await Device.findById(id);
  if (!device) {
    logDeviceNotFound(id, requestMeta);
    throw makeError(MESSAGES.DEVICE_NOT_FOUND, 404);
  }

  if (updates.assignedDepartment !== undefined) {
    await assertDepartmentExists(updates.assignedDepartment, requestMeta);
  }

  await assertNoDuplicate(
    {
      deviceCode:   updates.deviceCode,
      serialNumber: updates.serialNumber,
    },
    id,
    requestMeta
  );

  // Compare config changes for specific logs
  const oldDept = device.assignedDepartment?.toString();
  const newDept = updates.assignedDepartment?.toString();
  if (newDept !== undefined && oldDept !== newDept) {
    logDeviceAssignmentChanged({ id: device._id, deviceCode: device.deviceCode, oldDepartment: oldDept, newDepartment: newDept }, adminEmail, requestMeta);
  }

  if ((updates.connectionMode !== undefined && updates.connectionMode !== device.connectionMode) ||
      (updates.heartbeatInterval !== undefined && updates.heartbeatInterval !== device.heartbeatInterval)) {
    logDeviceConfigUpdated({ id: device._id, deviceCode: device.deviceCode, connectionMode: updates.connectionMode ?? device.connectionMode, heartbeatInterval: updates.heartbeatInterval ?? device.heartbeatInterval }, adminEmail, requestMeta);
  }

  if (updates.isAttendanceEnabled !== undefined && updates.isAttendanceEnabled !== device.isAttendanceEnabled) {
    logDeviceAttendanceToggled({ id: device._id, deviceCode: device.deviceCode, isAttendanceEnabled: updates.isAttendanceEnabled }, adminEmail, requestMeta);
  }

  if (updates.isDefaultDevice !== undefined && updates.isDefaultDevice !== device.isDefaultDevice) {
    logDeviceDefaultChanged({ id: device._id, deviceCode: device.deviceCode, isDefaultDevice: updates.isDefaultDevice }, adminEmail, requestMeta);
  }

  if (updates.status && updates.status !== device.status) {
    logDeviceStatusChanged(
      { id: device._id, deviceCode: device.deviceCode, oldStatus: device.status, newStatus: updates.status },
      adminEmail,
      requestMeta
    );
  }

  Object.assign(device, updates);
  device.updatedBy = adminEmail;
  await device.save();

  await device.populate('assignedDepartment', 'name code');

  logDeviceUpdated(
    { id: device._id, deviceCode: device.deviceCode, ipAddress: device.ipAddress },
    adminEmail,
    requestMeta
  );

  return device.toPublicJSON();
};

export const updateDeviceStatus = async (id, status, adminEmail, requestMeta = {}) => {
  const device = await Device.findById(id);
  if (!device) {
    logDeviceNotFound(id, requestMeta);
    throw makeError(MESSAGES.DEVICE_NOT_FOUND, 404);
  }

  if (device.status === status) {
    throw makeError(MESSAGES.DEVICE_NO_CHANGES, 400);
  }

  const oldStatus = device.status;
  device.status = status;
  
  if (status === 'ONLINE') {
    device.lastSeen = new Date();
  }

  device.updatedBy = adminEmail;
  await device.save();

  logDeviceStatusChanged(
    { id: device._id, deviceCode: device.deviceCode, oldStatus, newStatus: status },
    adminEmail,
    requestMeta
  );

  return device.toPublicJSON();
};

export const softDeleteDevice = async (id, adminEmail, requestMeta = {}) => {
  const device = await Device.findById(id);

  if (!device) {
    logDeviceNotFound(id, requestMeta);
    throw makeError(MESSAGES.DEVICE_NOT_FOUND, 404);
  }

  if (!device.isActive) {
    throw makeError(MESSAGES.DEVICE_ALREADY_INACTIVE, 400);
  }

  device.isActive  = false;
  device.deletedAt = new Date();
  device.deletedBy = adminEmail;
  device.updatedBy = adminEmail;
  await device.save();

  logDeviceDeleted(
    { id: device._id, deviceCode: device.deviceCode },
    adminEmail,
    requestMeta
  );
};

export const restoreDevice = async (id, adminEmail, requestMeta = {}) => {
  const device = await Device.findById(id);

  if (!device) {
    logDeviceNotFound(id, requestMeta);
    throw makeError(MESSAGES.DEVICE_NOT_FOUND, 404);
  }

  if (device.isActive) {
    throw makeError(MESSAGES.DEVICE_ALREADY_ACTIVE, 400);
  }

  device.isActive  = true;
  device.deletedAt = null;
  device.deletedBy = null;
  device.updatedBy = adminEmail;
  await device.save();

  logDeviceRestored(
    { id: device._id, deviceCode: device.deviceCode },
    adminEmail,
    requestMeta
  );

  return device.toPublicJSON();
};
