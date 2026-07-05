import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';
import {
  DEVICE_CATEGORIES_VALUES,
  VERIFICATION_METHODS_VALUES,
  DEVICE_STATUS_VALUES,
  DEVICE_CONNECTION_MODES_VALUES,
  DEVICE_SORT_FIELDS,
  DEVICE_SORT_ORDERS,
  DEVICE_PAGINATION,
} from '../../constants/index.js';

const validateStringField = (value, fieldName, min, max) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return `${fieldName} must be a non-empty string.`;
  }
  if (value.trim().length < min) return `${fieldName} must be at least ${min} characters.`;
  if (value.trim().length > max) return `${fieldName} cannot exceed ${max} characters.`;
  return null;
};

const validateCreateDeviceFields = (req, res, next) => {
  const errors = [];
  const {
    deviceCode, deviceName, deviceCategory, supportedVerificationMethods, manufacturer, model, serialNumber,
    ipAddress, macAddress, port, campus, building, floor, room,
    locationDescription, firmwareVersion, status,
    assignedDepartment, connectionMode, heartbeatInterval,
    isAttendanceEnabled, isDefaultDevice,
  } = req.body ?? {};

  // Required Fields
  const codeErr = validateStringField(deviceCode, 'Device code', 1, 50);
  if (codeErr) errors.push({ field: 'deviceCode', message: codeErr });

  const nameErr = validateStringField(deviceName, 'Device name', 2, 100);
  if (nameErr) errors.push({ field: 'deviceName', message: nameErr });

  const mfgErr = validateStringField(manufacturer, 'Manufacturer', 1, 100);
  if (mfgErr) errors.push({ field: 'manufacturer', message: mfgErr });

  const modelErr = validateStringField(model, 'Model', 1, 100);
  if (modelErr) errors.push({ field: 'model', message: modelErr });

  const serialErr = validateStringField(serialNumber, 'Serial number', 1, 100);
  if (serialErr) errors.push({ field: 'serialNumber', message: serialErr });

  if (campus !== undefined && campus !== null && campus !== '') {
    const campusErr = validateStringField(campus, 'Campus', 1, 100);
    if (campusErr) errors.push({ field: 'campus', message: campusErr });
  }

  const bldgErr = validateStringField(building, 'Building', 1, 100);
  if (bldgErr) errors.push({ field: 'building', message: bldgErr });

  const floorErr = validateStringField(floor, 'Floor', 1, 100);
  if (floorErr) errors.push({ field: 'floor', message: floorErr });

  const roomErr = validateStringField(room, 'Room', 1, 100);
  if (roomErr) errors.push({ field: 'room', message: roomErr });

  if (deviceCategory === undefined || deviceCategory === null) {
    errors.push({ field: 'deviceCategory', message: 'Device category is required.' });
  } else if (!DEVICE_CATEGORIES_VALUES.includes(deviceCategory)) {
    errors.push({ field: 'deviceCategory', message: `Invalid device category. Allowed values: ${DEVICE_CATEGORIES_VALUES.join(', ')}.` });
  }

  if (supportedVerificationMethods === undefined || supportedVerificationMethods === null) {
    errors.push({ field: 'supportedVerificationMethods', message: 'At least one supported verification method is required.' });
  } else if (!Array.isArray(supportedVerificationMethods) || supportedVerificationMethods.length === 0) {
    errors.push({ field: 'supportedVerificationMethods', message: 'Supported verification methods must be a non-empty array.' });
  } else {
    const invalidMethods = supportedVerificationMethods.filter(m => !VERIFICATION_METHODS_VALUES.includes(m));
    if (invalidMethods.length > 0) {
      errors.push({ field: 'supportedVerificationMethods', message: `Invalid verification methods. Allowed values: ${VERIFICATION_METHODS_VALUES.join(', ')}.` });
    }
  }

  // Network Config Validators
  if (!ipAddress || typeof ipAddress !== 'string' || !/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress.trim())) {
    errors.push({ field: 'ipAddress', message: 'Please provide a valid IPv4 address.' });
  }

  if (port === undefined || port === null) {
    errors.push({ field: 'port', message: 'Port is required.' });
  } else if (isNaN(parseInt(port, 10)) || port < 1 || port > 65535) {
    errors.push({ field: 'port', message: 'Port must be a number between 1 and 65535.' });
  }

  // Optional Fields
  if (macAddress !== undefined && macAddress !== null && macAddress !== '') {
    if (typeof macAddress !== 'string' || !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(macAddress.trim())) {
      errors.push({ field: 'macAddress', message: 'Please provide a valid MAC address (e.g., 00:1A:2B:3C:4D:5E).' });
    }
  }

  if (locationDescription !== undefined && locationDescription !== null && locationDescription !== '') {
    const locErr = validateStringField(locationDescription, 'Location description', 1, 500);
    if (locErr) errors.push({ field: 'locationDescription', message: locErr });
  }

  if (firmwareVersion !== undefined && firmwareVersion !== null && firmwareVersion !== '') {
    const fwErr = validateStringField(firmwareVersion, 'Firmware version', 1, 100);
    if (fwErr) errors.push({ field: 'firmwareVersion', message: fwErr });
  }

  if (status !== undefined && status !== null) {
    if (!DEVICE_STATUS_VALUES.includes(status)) {
      errors.push({ field: 'status', message: `Invalid status. Allowed values: ${DEVICE_STATUS_VALUES.join(', ')}.` });
    }
  }

  if (assignedDepartment !== undefined && assignedDepartment !== null && assignedDepartment !== '') {
    if (!mongoose.Types.ObjectId.isValid(assignedDepartment)) {
      errors.push({ field: 'assignedDepartment', message: 'Must be a valid department ID.' });
    }
  }

  if (connectionMode !== undefined && connectionMode !== null) {
    if (!DEVICE_CONNECTION_MODES_VALUES.includes(connectionMode)) {
      errors.push({ field: 'connectionMode', message: `Invalid connection mode. Allowed values: ${DEVICE_CONNECTION_MODES_VALUES.join(', ')}.` });
    }
  }

  if (heartbeatInterval !== undefined && heartbeatInterval !== null) {
    const hb = parseInt(heartbeatInterval, 10);
    if (isNaN(hb) || hb < 1 || hb > 1440) {
      errors.push({ field: 'heartbeatInterval', message: 'Heartbeat interval must be a number between 1 and 1440 minutes.' });
    }
  }

  if (isAttendanceEnabled !== undefined && typeof isAttendanceEnabled !== 'boolean') {
    errors.push({ field: 'isAttendanceEnabled', message: 'Must be a boolean.' });
  }

  if (isDefaultDevice !== undefined && typeof isDefaultDevice !== 'boolean') {
    errors.push({ field: 'isDefaultDevice', message: 'Must be a boolean.' });
  }

  req.validationErrors = errors;
  next();
};

export const validateCreateDevice = [
  validateCreateDeviceFields,
  handleValidationErrors,
];

const validateUpdateDeviceFields = (req, res, next) => {
  const errors = [];
  const {
    deviceCode, deviceName, deviceCategory, supportedVerificationMethods, manufacturer, model, serialNumber,
    ipAddress, macAddress, port, campus, building, floor, room,
    locationDescription, firmwareVersion, status,
    assignedDepartment, connectionMode, heartbeatInterval,
    isAttendanceEnabled, isDefaultDevice,
  } = req.body ?? {};

  const knownFields = [
    'deviceCode', 'deviceName', 'deviceCategory', 'supportedVerificationMethods', 'manufacturer', 'model', 'serialNumber',
    'ipAddress', 'macAddress', 'port', 'campus', 'building', 'floor', 'room',
    'locationDescription', 'firmwareVersion', 'status',
    'assignedDepartment', 'connectionMode', 'heartbeatInterval',
    'isAttendanceEnabled', 'isDefaultDevice',
  ];
  
  const provided = knownFields.filter(
    (f) => Object.prototype.hasOwnProperty.call(req.body ?? {}, f)
  );

  if (provided.length === 0) {
    errors.push({ field: 'body', message: 'At least one field must be provided to update.' });
    req.validationErrors = errors;
    return next();
  }

  if (deviceCode !== undefined) {
    const err = validateStringField(deviceCode, 'Device code', 1, 50);
    if (err) errors.push({ field: 'deviceCode', message: err });
  }

  if (deviceName !== undefined) {
    const err = validateStringField(deviceName, 'Device name', 2, 100);
    if (err) errors.push({ field: 'deviceName', message: err });
  }

  if (manufacturer !== undefined) {
    const err = validateStringField(manufacturer, 'Manufacturer', 1, 100);
    if (err) errors.push({ field: 'manufacturer', message: err });
  }

  if (model !== undefined) {
    const err = validateStringField(model, 'Model', 1, 100);
    if (err) errors.push({ field: 'model', message: err });
  }

  if (serialNumber !== undefined) {
    const err = validateStringField(serialNumber, 'Serial number', 1, 100);
    if (err) errors.push({ field: 'serialNumber', message: err });
  }

  if (campus !== undefined && campus !== null && campus !== '') {
    const err = validateStringField(campus, 'Campus', 1, 100);
    if (err) errors.push({ field: 'campus', message: err });
  }

  if (building !== undefined) {
    const err = validateStringField(building, 'Building', 1, 100);
    if (err) errors.push({ field: 'building', message: err });
  }

  if (floor !== undefined) {
    const err = validateStringField(floor, 'Floor', 1, 100);
    if (err) errors.push({ field: 'floor', message: err });
  }

  if (room !== undefined) {
    const err = validateStringField(room, 'Room', 1, 100);
    if (err) errors.push({ field: 'room', message: err });
  }

  if (deviceCategory !== undefined) {
    if (!DEVICE_CATEGORIES_VALUES.includes(deviceCategory)) {
      errors.push({ field: 'deviceCategory', message: `Invalid device category. Allowed values: ${DEVICE_CATEGORIES_VALUES.join(', ')}.` });
    }
  }

  if (supportedVerificationMethods !== undefined) {
    if (!Array.isArray(supportedVerificationMethods) || supportedVerificationMethods.length === 0) {
      errors.push({ field: 'supportedVerificationMethods', message: 'Supported verification methods must be a non-empty array.' });
    } else {
      const invalidMethods = supportedVerificationMethods.filter(m => !VERIFICATION_METHODS_VALUES.includes(m));
      if (invalidMethods.length > 0) {
        errors.push({ field: 'supportedVerificationMethods', message: `Invalid verification methods. Allowed values: ${VERIFICATION_METHODS_VALUES.join(', ')}.` });
      }
    }
  }

  if (ipAddress !== undefined) {
    if (typeof ipAddress !== 'string' || !/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress.trim())) {
      errors.push({ field: 'ipAddress', message: 'Please provide a valid IPv4 address.' });
    }
  }

  if (port !== undefined) {
    if (isNaN(parseInt(port, 10)) || port < 1 || port > 65535) {
      errors.push({ field: 'port', message: 'Port must be a number between 1 and 65535.' });
    }
  }

  if (macAddress !== undefined && macAddress !== null && macAddress !== '') {
    if (typeof macAddress !== 'string' || !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(macAddress.trim())) {
      errors.push({ field: 'macAddress', message: 'Please provide a valid MAC address.' });
    }
  }

  if (locationDescription !== undefined && locationDescription !== null && locationDescription !== '') {
    const locErr = validateStringField(locationDescription, 'Location description', 1, 500);
    if (locErr) errors.push({ field: 'locationDescription', message: locErr });
  }

  if (firmwareVersion !== undefined && firmwareVersion !== null && firmwareVersion !== '') {
    const fwErr = validateStringField(firmwareVersion, 'Firmware version', 1, 100);
    if (fwErr) errors.push({ field: 'firmwareVersion', message: fwErr });
  }

  if (status !== undefined && status !== null) {
    if (!DEVICE_STATUS_VALUES.includes(status)) {
      errors.push({ field: 'status', message: `Invalid status. Allowed values: ${DEVICE_STATUS_VALUES.join(', ')}.` });
    }
  }

  req.validationErrors = errors;
  next();
};

export const validateUpdateDevice = [
  validateUpdateDeviceFields,
  handleValidationErrors,
];

const validateUpdateStatusFields = (req, res, next) => {
  const errors = [];
  const { status } = req.body ?? {};

  if (!status || !DEVICE_STATUS_VALUES.includes(status)) {
    errors.push({ field: 'status', message: `status is required and must be one of: ${DEVICE_STATUS_VALUES.join(', ')}.` });
  }

  req.validationErrors = errors;
  next();
};

export const validateUpdateStatus = [
  validateUpdateStatusFields,
  handleValidationErrors,
];

const validateListQueryFields = (req, res, next) => {
  const errors = [];
  const {
    page, limit, search,
    deviceCategory, status, building, floor, isActive,
    assignedDepartment, connectionMode, isAttendanceEnabled, isDefaultDevice,
    sortBy, sortOrder,
  } = req.query ?? {};

  if (page !== undefined) {
    const p = parseInt(page, 10);
    if (isNaN(p) || p < 1) {
      errors.push({ field: 'page', message: 'page must be a positive integer.' });
    }
  }

  if (limit !== undefined) {
    const l = parseInt(limit, 10);
    if (isNaN(l) || l < 1) {
      errors.push({ field: 'limit', message: 'limit must be a positive integer.' });
    } else if (l > DEVICE_PAGINATION.MAX_LIMIT) {
      errors.push({
        field:   'limit',
        message: `limit cannot exceed ${DEVICE_PAGINATION.MAX_LIMIT}.`,
      });
    }
  }

  if (search !== undefined && search.trim().length > 100) {
    errors.push({ field: 'search', message: 'search term cannot exceed 100 characters.' });
  }

  if (deviceCategory !== undefined && !DEVICE_CATEGORIES_VALUES.includes(deviceCategory)) {
    errors.push({ field: 'deviceCategory', message: `deviceCategory filter must be one of: ${DEVICE_CATEGORIES_VALUES.join(', ')}.` });
  }

  if (status !== undefined && !DEVICE_STATUS_VALUES.includes(status)) {
    errors.push({ field: 'status', message: `status filter must be one of: ${DEVICE_STATUS_VALUES.join(', ')}.` });
  }

  if (building !== undefined && building.trim().length > 100) {
    errors.push({ field: 'building', message: 'building filter cannot exceed 100 characters.' });
  }

  if (floor !== undefined && floor.trim().length > 100) {
    errors.push({ field: 'floor', message: 'floor filter cannot exceed 100 characters.' });
  }

  if (assignedDepartment !== undefined && !mongoose.Types.ObjectId.isValid(assignedDepartment)) {
    errors.push({ field: 'assignedDepartment', message: 'Must be a valid department ID.' });
  }

  if (connectionMode !== undefined && !DEVICE_CONNECTION_MODES_VALUES.includes(connectionMode)) {
    errors.push({ field: 'connectionMode', message: `connectionMode filter must be one of: ${DEVICE_CONNECTION_MODES_VALUES.join(', ')}.` });
  }

  if (isAttendanceEnabled !== undefined && !['true', 'false', 'all'].includes(isAttendanceEnabled)) {
    errors.push({ field: 'isAttendanceEnabled', message: "isAttendanceEnabled must be 'true', 'false', or 'all'." });
  }

  if (isDefaultDevice !== undefined && !['true', 'false', 'all'].includes(isDefaultDevice)) {
    errors.push({ field: 'isDefaultDevice', message: "isDefaultDevice must be 'true', 'false', or 'all'." });
  }

  if (isActive !== undefined && !['true', 'false', 'all'].includes(isActive)) {
    errors.push({ field: 'isActive', message: "isActive must be 'true', 'false', or 'all'." });
  }

  if (sortBy !== undefined && !DEVICE_SORT_FIELDS.includes(sortBy)) {
    errors.push({
      field:   'sortBy',
      message: `sortBy must be one of: ${DEVICE_SORT_FIELDS.join(', ')}.`,
    });
  }

  if (sortOrder !== undefined && !DEVICE_SORT_ORDERS.includes(sortOrder)) {
    errors.push({ field: 'sortOrder', message: "sortOrder must be 'asc' or 'desc'." });
  }

  req.validationErrors = errors;
  next();
};

export const validateListQuery = [
  validateListQueryFields,
  handleValidationErrors,
];

const validateObjectIdParam = (req, res, next) => {
  const errors = [];
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    errors.push({ field: 'id', message: 'The provided ID is not a valid resource identifier.' });
  }
  req.validationErrors = errors;
  next();
};

export const validateObjectId = [
  validateObjectIdParam,
  handleValidationErrors,
];
