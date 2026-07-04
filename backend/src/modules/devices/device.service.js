import Device from './device.model.js';
import { MESSAGES } from '../../constants/index.js';
import {
  logDeviceListFetched,
  logDeviceFetched,
  logDeviceCreated,
  logDeviceUpdated,
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

const toListItem = (doc) => ({
  id:                  doc._id,
  deviceCode:          doc.deviceCode,
  deviceName:          doc.deviceName,
  deviceType:          doc.deviceType,
  manufacturer:        doc.manufacturer,
  model:               doc.model,
  serialNumber:        doc.serialNumber,
  firmwareVersion:     doc.firmwareVersion ?? null,
  ipAddress:           doc.ipAddress,
  macAddress:          doc.macAddress ?? null,
  port:                doc.port,
  building:            doc.building,
  floor:               doc.floor,
  room:                doc.room,
  locationDescription: doc.locationDescription ?? null,
  status:              doc.status,
  lastSeen:            doc.lastSeen ?? null,
  lastSync:            doc.lastSync ?? null,
  isActive:            doc.isActive,
  deletedAt:           doc.deletedAt ?? null,
  deletedBy:           doc.deletedBy ?? null,
  createdBy:           doc.createdBy,
  updatedBy:           doc.updatedBy ?? null,
  createdAt:           doc.createdAt,
  updatedAt:           doc.updatedAt,
});

export const listDevices = async (query = {}, requestMeta = {}) => {
  const {
    page = 1, limit = 10, search = '',
    deviceType = null, status = null, building = null, floor = null,
    isActive = 'all', sortBy = 'createdAt', sortOrder = 'desc',
  } = query;

  const filter = {};

  if (isActive !== 'all') {
    filter.isActive = isActive === true || isActive === 'true';
  }

  if (deviceType && deviceType.trim()) {
    filter.deviceType = deviceType.trim().toUpperCase();
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
    Device.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
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
  const device = await Device.findById(id);

  if (!device) {
    logDeviceNotFound(id, requestMeta);
    throw makeError(MESSAGES.DEVICE_NOT_FOUND, 404);
  }

  logDeviceFetched(id, requestMeta);
  return device.toPublicJSON();
};

export const createDevice = async (data, adminEmail, requestMeta = {}) => {
  const {
    deviceCode, deviceName, deviceType, manufacturer, model, serialNumber,
    ipAddress, macAddress = null, port, building, floor, room,
    locationDescription = null, firmwareVersion = null, status,
  } = data;

  await assertNoDuplicate({ deviceCode, serialNumber }, null, requestMeta);

  const device = await Device.create({
    deviceCode, deviceName, deviceType, manufacturer, model, serialNumber,
    ipAddress, macAddress, port, building, floor, room,
    locationDescription, firmwareVersion,
    ...(status && { status }),
    createdBy: adminEmail,
  });

  logDeviceCreated(
    { id: device._id, deviceCode: device.deviceCode, ipAddress: device.ipAddress },
    adminEmail,
    requestMeta
  );

  return device.toPublicJSON();
};

export const updateDevice = async (id, data, adminEmail, requestMeta = {}) => {
  const allowedFields = [
    'deviceCode', 'deviceName', 'deviceType', 'manufacturer', 'model', 'serialNumber',
    'ipAddress', 'macAddress', 'port', 'building', 'floor', 'room',
    'locationDescription', 'firmwareVersion', 'status',
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

  await assertNoDuplicate(
    {
      deviceCode:   updates.deviceCode,
      serialNumber: updates.serialNumber,
    },
    id,
    requestMeta
  );

  // If status is changing, log it specifically
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
