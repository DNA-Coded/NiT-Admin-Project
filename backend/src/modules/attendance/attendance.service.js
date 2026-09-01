import mongoose from 'mongoose';
import { escapeRegex } from '../../utils/sanitize.util.js';
import Attendance from './attendance.model.js';
import { buildUpdatePayload } from '../../utils/update.util.js';
import Device from '../devices/device.model.js';
import Employee from '../employee/employee.model.js';
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
  logAttendanceDuplicateRejected,
  logAttendanceInvalidRejected,
} from './attendance.logger.js';
import { activityService } from '../activity/activity.service.js';
import { ACTIVITY_MODULES, ACTIVITY_ACTIONS, ACTIVITY_STATUS, ACTIVITY_SEVERITY } from '../../constants/index.js';

const makeError = (message, status) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

const assertDeviceExists = async (deviceId) => {
const escapePdfLiteralString = (value) => {
  return String(value).replace(/[\\()]/g, (ch) => `\\${ch}`);
};

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

  const Model = Employee;
  const person = await Model.findById(personId).populate('department').lean();

  if (!person) {
    throw makeError(MESSAGES.ATTENDANCE_PERSON_NOT_FOUND, 404);
  }

  if (!person.isActive) {
    throw makeError(MESSAGES.ATTENDANCE_PERSON_NOT_FOUND, 422);
  }

  if (person.department && !person.department.isActive) {
    throw makeError('The assigned department for this person is inactive.', 422);
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
    const filter = { person, attendanceType, timestamp: new Date(timestamp) };
    if (excludeId) filter._id = { $ne: excludeId };
    const existing = await Attendance.findOne(filter).select('_id').lean();
    if (existing) {
      throw makeError(MESSAGES.ATTENDANCE_DUPLICATE_ENTRY, 409);
    }
  }
};

const assertChronologicalValidity = async (person, attendanceType, timestamp, excludeId = null, requestMeta = {}) => {
  if (!person || !attendanceType || !timestamp) return;

  const punchTime = new Date(timestamp);
  const now = new Date();
  
  if (punchTime.getTime() > now.getTime() + 5 * 60 * 1000) {
    logAttendanceInvalidRejected(person, timestamp, 'future_timestamp', requestMeta);
    throw makeError('Attendance timestamp cannot be in the future.', 422);
  }

  const filter = { person, isActive: true, timestamp: { $lte: punchTime } };
  if (excludeId) filter._id = { $ne: excludeId };

  const lastRecord = await Attendance.findOne(filter)
    .sort({ timestamp: -1, createdAt: -1 })
    .select('attendanceType timestamp')
    .lean();

  if (lastRecord && lastRecord.attendanceType === attendanceType) {
    logAttendanceDuplicateRejected(person, attendanceType, timestamp, requestMeta);
    throw makeError(`Cannot record a ${attendanceType} immediately following another ${attendanceType} without an intervening record.`, 422);
  }
};

/**
 * List raw attendance punch records
 */
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
    const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [
      { attendanceCode: searchRegex },
      { attendanceIdentity: searchRegex },
      { remarks: searchRegex },
    ];
  }

  if (department && mongoose.Types.ObjectId.isValid(department)) {
    const deptId = new mongoose.Types.ObjectId(department);
    const faculties = await Employee.find({ department: deptId }).select('_id').lean();
    const personIds = faculties.map(f => f._id);
    
    if (personIds.length === 0) {
      return {
        attendance: [],
        pagination: { total: 0, page: 1, limit: parseInt(limit, 10), totalPages: 0, hasNextPage: false, hasPrevPage: false }
      };
    }
    
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
        select: 'firstName lastName fullName empId employeeId department designation rawDesignation',
        populate: { path: 'department', select: 'name code' }
      })
      .populate('device', 'deviceCode deviceName deviceCategory')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  logAttendanceListFetched({ total, page: pageNum }, requestMeta);

  const attendance = docs.map((doc) => {
    const p = doc.person;
    let personField = p ?? null;
    
    if (p && typeof p === 'object' && p._id) {
      const computedFullName = p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Unknown User';
      personField = {
        id:          p._id,
        firstName:  p.firstName,
        lastName:   p.lastName,
        fullName:   computedFullName,
        employeeId: p.empId || p.employeeId || doc.attendanceIdentity,
        designation: p.rawDesignation || p.designation || 'Staff',
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
        ? { id: d._id, deviceCode: d.deviceCode, deviceName: d.deviceName, deviceCategory: d.deviceCategory }
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

/**
 * Daily Consolidated Attendance Records
 */
export const getDailyAttendanceRecords = async (query = {}, requestMeta = {}) => {
  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    date,
    search = '',
    department = null,
    status = null,
  } = query;

  const matchStage = { isActive: true };

  if (date && date.trim()) {
    matchStage.attendanceDate = date.trim();
  } else if (startDate || endDate) {
    matchStage.attendanceDate = {};
    if (startDate) matchStage.attendanceDate.$gte = startDate.trim();
    if (endDate) matchStage.attendanceDate.$lte = endDate.trim();
  }

  if (status && status.trim() && status !== 'ALL') {
    matchStage.status = status.trim().toUpperCase();
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: {
          person: '$person',
          date: '$attendanceDate',
        },
        personId: { $first: '$person' },
        attendanceDate: { $first: '$attendanceDate' },
        attendanceIdentity: { $first: '$attendanceIdentity' },
        firstInTime: {
          $min: {
            $cond: [{ $eq: ['$attendanceType', 'CHECK_IN'] }, '$attendanceTime', null],
          },
        },
        firstInTimestamp: {
          $min: {
            $cond: [{ $eq: ['$attendanceType', 'CHECK_IN'] }, '$timestamp', null],
          },
        },
        lastOutTime: {
          $max: {
            $cond: [{ $eq: ['$attendanceType', 'CHECK_OUT'] }, '$attendanceTime', null],
          },
        },
        lastOutTimestamp: {
          $max: {
            $cond: [{ $eq: ['$attendanceType', 'CHECK_OUT'] }, '$timestamp', null],
          },
        },
        statuses: { $addToSet: '$status' },
      },
    },
    {
      $lookup: {
        from: 'employees',
        localField: 'personId',
        foreignField: '_id',
        as: 'employeeDetails',
      },
    },
    {
      $unwind: {
        path: '$employeeDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'departments',
        localField: 'employeeDetails.department',
        foreignField: '_id',
        as: 'departmentDetails',
      },
    },
    {
      $unwind: {
        path: '$departmentDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (department && mongoose.Types.ObjectId.isValid(department)) {
    pipeline.push({
      $match: {
        'employeeDetails.department': new mongoose.Types.ObjectId(department),
      },
    });
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    pipeline.push({
      $match: {
        $or: [
          { 'employeeDetails.firstName': searchRegex },
          { 'employeeDetails.lastName': searchRegex },
          { 'employeeDetails.empId': searchRegex },
          { 'employeeDetails.employeeId': searchRegex },
          { attendanceIdentity: searchRegex },
        ],
      },
    });
  }

  pipeline.push({ $sort: { attendanceDate: -1, 'employeeDetails.firstName': 1 } });

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(5000, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [results, countResult] = await Promise.all([
    Attendance.aggregate([...pipeline, { $skip: skip }, { $limit: limitNum }]),
    Attendance.aggregate([...pipeline, { $count: 'total' }]),
  ]);

  const total = countResult[0]?.total || 0;
  const totalPages = Math.ceil(total / limitNum);

  const format12h = (timeStr) => {
    if (!timeStr) return '--';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    const hour = parseInt(parts[0], 10);
    const min = parts[1];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${String(formattedHour).padStart(2, '0')}:${min} ${ampm}`;
  };

  const records = results.map((row) => {
    const emp = row.employeeDetails;
    const dept = row.departmentDetails;

    let fullName = 'Unknown User';
    let employeeId = row.attendanceIdentity || 'N/A';
    let departmentName = dept?.name || dept?.code || emp?.deptCode || 'General';
    let designationName = emp?.rawDesignation || emp?.designation || 'Staff';
    
    // Multi-tier date extraction fallback
    let recordDate = row.attendanceDate || row._id?.date;
    if (!recordDate || recordDate === 'N/A' || recordDate === 'undefined') {
      if (row.firstInTimestamp) {
        recordDate = new Date(row.firstInTimestamp).toISOString().split('T')[0];
      } else {
        recordDate = 'N/A';
      }
    }

    if (emp) {
      fullName = emp.fullName || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unknown User';
      employeeId = emp.empId || emp.employeeId || row.attendanceIdentity;
    }

    let totalHoursStr = '--';
    if (row.firstInTimestamp && row.lastOutTimestamp) {
      const diffMs = new Date(row.lastOutTimestamp) - new Date(row.firstInTimestamp);
      if (diffMs > 0) {
        const totalMins = Math.floor(diffMs / (1000 * 60));
        const hrs = Math.floor(totalMins / 60);
        const mins = totalMins % 60;
        totalHoursStr = `${hrs}h ${mins}m`;
      }
    }

    return {
      id: `${row.personId}_${recordDate}`,
      employee: {
        id: row.personId,
        fullName,
        employeeId,
        department: departmentName,
        designation: designationName,
      },
      attendanceDate: recordDate,
      firstIn: format12h(row.firstInTime),
      lastOut: format12h(row.lastOutTime),
      totalHours: totalHoursStr,
      status: row.statuses?.includes('LATE') ? 'Late' : 'Present',
    };
  });

  return {
    records,
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

/**
 * Attendance Summary Dashboard Cards Data
 */
export const getAttendanceSummary = async (dateStr) => {
  let targetDate = dateStr;

  if (!targetDate) {
    const latestRecord = await Attendance.findOne({ isActive: true })
      .sort({ attendanceDate: -1 })
      .select('attendanceDate')
      .lean();
      
    targetDate = latestRecord?.attendanceDate || new Date().toISOString().split('T')[0];
  }

  const totalEmployees = await Employee.countDocuments({ isActive: true });

  const todayRecords = await Attendance.find({
    attendanceDate: targetDate,
    isActive: true,
  }).lean();

  const presentPersonIds = new Set(todayRecords.map((r) => r.person.toString()));
  const presentToday = presentPersonIds.size;
  const absentToday = Math.max(0, totalEmployees - presentToday);

  const lateArrivals = todayRecords.filter((r) => r.status === 'LATE').length;
  const earlyDepartures = todayRecords.filter((r) => r.status === 'EARLY_EXIT').length;

  const personPunches = Object.create(null);
  todayRecords.forEach((r) => {
    const pid = r.person.toString();
    if (!personPunches[pid]) personPunches[pid] = { minIn: null, maxOut: null };

    if (r.attendanceType === 'CHECK_IN') {
      if (!personPunches[pid].minIn || new Date(r.timestamp) < new Date(personPunches[pid].minIn)) {
        personPunches[pid].minIn = r.timestamp;
      }
    } else if (r.attendanceType === 'CHECK_OUT') {
      if (!personPunches[pid].maxOut || new Date(r.timestamp) > new Date(personPunches[pid].maxOut)) {
        personPunches[pid].maxOut = r.timestamp;
      }
    }
  });

  let totalMinutes = 0;
  let completedCount = 0;

  Object.values(personPunches).forEach((p) => {
    if (p.minIn && p.maxOut) {
      const diffMs = new Date(p.maxOut) - new Date(p.minIn);
      if (diffMs > 0) {
        totalMinutes += Math.floor(diffMs / (1000 * 60));
        completedCount += 1;
      }
    }
  });

  const avgMinutes = completedCount ? Math.floor(totalMinutes / completedCount) : 0;
  const avgHoursStr = avgMinutes > 0 ? `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m` : '--';

  return {
    presentToday,
    absentToday,
    lateArrivals,
    earlyDepartures,
    avgWorkingHours: avgHoursStr,
  };
};

/**
 * Helper to generate valid Excel XML SpreadsheetML format
 */
function generateExcelXML(headers, rows, sheetName = 'Attendance') {
  const sanitize = (val) => String(val || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/^"|"$/g, '');

  const headerXml = headers.map((h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${sanitize(h)}</Data></Cell>`).join('');
  const rowsXml = rows
    .map((row) => {
      const cells = row.map((cell) => `<Cell><Data ss:Type="String">${sanitize(cell)}</Data></Cell>`).join('');
      return `<Row>${cells}</Row>`;
    })
    .join('');

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1"/>
   <Interior ss:Color="#E0E0E0" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${sheetName}">
  <Table>
   <Row>${headerXml}</Row>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;
}

/**
 * Helper to generate valid multi-page A4 Landscape PDF Buffer
 */
function generateLandscapePDFBuffer(headers, rows, title = 'Attendance Summary Report') {
  const colWidths = [12, 22, 25, 20, 12, 10, 10, 8, 10];

  const pad = (val, width) => {
    const s = String(val || '').replace(/[()\\"]/g, '').slice(0, width);
    return s.padEnd(width, ' ');
  };

  const headerLine = headers.map((h, i) => pad(h, colWidths[i])).join(' | ');
  const sepLine = '-'.repeat(headerLine.length);

  const formattedRows = rows.map((r) => r.map((cell, i) => pad(cell, colWidths[i])).join(' | '));

  const linesPerPage = 26;
  const chunks = [];
  for (let i = 0; i < formattedRows.length; i += linesPerPage) {
    chunks.push(formattedRows.slice(i, i + linesPerPage));
  }
  if (chunks.length === 0) chunks.push([]);

  const numPages = chunks.length;
  const fontObjId = 3 + numPages * 2;
  const pageObjIds = Array.from({ length: numPages }, (_, idx) => 3 + idx * 2);
  const contentObjIds = Array.from({ length: numPages }, (_, idx) => 4 + idx * 2);

  const objects = [];

  objects.push(Buffer.from('1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n'));

  const pagesKids = pageObjIds.map((pid) => `${pid} 0 R`).join(' ');
  objects.push(Buffer.from(`2 0 obj\n<</Type /Pages /Kids [${pagesKids}] /Count ${numPages}>>\nendobj\n`));

  const todayStr = new Date().toISOString().split('T')[0];

  chunks.forEach((chunk, idx) => {
    const pId = pageObjIds[idx];
    const cId = contentObjIds[idx];

    objects.push(Buffer.from(`${pId} 0 obj\n<</Type /Page /Parent 2 0 R /Resources <</Font <</F1 ${fontObjId} 0 R>>>> /MediaBox [0 0 842 595] /Contents ${cId} 0 R>>\nendobj\n`));

    const streamLines = [
      `${title} (Page ${idx + 1} of ${numPages})`,
      `Generated on: ${todayStr}`,
      '='.repeat(headerLine.length),
      headerLine,
      sepLine,
      ...chunk,
    ];

    const textOps = streamLines.map((line, lineIdx) => {
      const yPos = 550 - lineIdx * 17;
      const cleanLine = line.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      return `1 0 0 1 30 ${yPos} Tm (${cleanLine}) Tj`;
    });

    const streamBody = `BT /F1 7.5 Tf\n${textOps.join('\n')}\nET`;
    const streamBytes = Buffer.from(streamBody, 'utf-8');

    const contentObj = Buffer.concat([
      Buffer.from(`${cId} 0 obj\n<</Length ${streamBytes.length}>> stream\n`),
      streamBytes,
      Buffer.from('\nendstream\nendobj\n'),
    ]);
    objects.push(contentObj);
      const cleanLine = escapePdfLiteralString(line);

  objects.push(Buffer.from(`${fontObjId} 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Courier>>\nendobj\n`));

  const header = Buffer.from('%PDF-1.4\n');
  const offsets = [];
  let currentOffset = header.length;
  const pdfParts = [header];

  for (const obj of objects) {
    offsets.push(currentOffset);
    pdfParts.push(obj);
    currentOffset += obj.length;
  }

  const xrefOffset = currentOffset;
  const totalObjs = objects.length + 1;

  let xrefStr = `xref\n0 ${totalObjs}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    xrefStr += `${String(off).padStart(10, '0')} 00000 n \n`;
  }

  const xrefBytes = Buffer.from(xrefStr, 'utf-8');
  pdfParts.push(xrefBytes);

  const trailerStr = `trailer\n<</Size ${totalObjs} /Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  pdfParts.push(Buffer.from(trailerStr, 'utf-8'));

  return Buffer.concat(pdfParts);
}

/**
 * Export Daily Consolidated Attendance Records (CSV, XLSX, PDF)
 */
export const exportAttendanceCSV = async (query = {}) => {
  const { format = 'CSV' } = query;

  const { records } = await getDailyAttendanceRecords({
    ...query,
    limit: 5000,
  });

  const headers = ['Employee ID', 'Employee Name', 'Department', 'Designation', 'Date', 'First In', 'Last Out', 'Total Hours', 'Status'];

  const rows = records.map((r) => {
    let dateStr = r.attendanceDate;
    if (!dateStr || dateStr === 'N/A' || dateStr === 'undefined') {
      if (r.id && r.id.includes('_')) {
        const parts = r.id.split('_');
        if (parts[1] && parts[1] !== 'N/A') dateStr = parts[1];
      }
    }
    if (!dateStr || dateStr === 'N/A' || dateStr === 'undefined') {
      dateStr = new Date().toISOString().split('T')[0];
    }

    return [
      r.employee?.employeeId || 'N/A',
      r.employee?.fullName || 'Unknown User',
      r.employee?.department || 'General',
      r.employee?.designation || 'Staff',
      dateStr,
      r.firstIn || '--',
      r.lastOut || '--',
      r.totalHours || '--',
      r.status || 'Present',
    ];
  });

  const reqFormat = format.toUpperCase();

  // 1. Excel Export (.xls SpreadsheetML)
  if (reqFormat === 'XLSX' || reqFormat === 'EXCEL') {
    return {
      content: Buffer.from(generateExcelXML(headers, rows), 'utf-8'),
      contentType: 'application/vnd.ms-excel',
      extension: 'xls',
    };
  }

  // 2. PDF Export (A4 Landscape PDF Buffer)
  if (reqFormat === 'PDF') {
    return {
      content: generateLandscapePDFBuffer(headers, rows),
      contentType: 'application/pdf',
      extension: 'pdf',
    };
  }

  // 3. CSV Export (UTF-8 BOM CSV Buffer)
  const csvHeaders = headers.map((h) => `"${h}"`).join(',');
  const csvRows = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','));
  const csvText = '\uFEFF' + [csvHeaders, ...csvRows].join('\n');

  return {
    content: Buffer.from(csvText, 'utf-8'),
    contentType: 'text/csv; charset=utf-8;',
    extension: 'csv',
  };
};

export const getAttendanceById = async (id, requestMeta = {}) => {
  const record = await Attendance.findById(String(id))
    .populate({
      path: 'person',
      select: 'firstName lastName fullName empId employeeId department',
      populate: { path: 'department', select: 'name code' }
    })
    .populate('device', 'deviceCode deviceName deviceCategory');

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
  await assertChronologicalValidity(person, attendanceType, timestamp, null, requestMeta);

  const record = await Attendance.create({
    attendanceCode, personType, person, device, attendanceIdentity,
    verificationMethod, attendanceType, timestamp, attendanceDate, attendanceTime,
    status, remarks,
    createdBy: adminEmail,
  });

  await record.populate({
    path: 'person',
    select: 'firstName lastName fullName empId employeeId department',
    populate: { path: 'department', select: 'name code' }
  });
  await record.populate('device', 'deviceCode deviceName deviceCategory');

  logAttendanceCreated(
    { id: record._id, attendanceCode: record.attendanceCode, personId: record.person._id, deviceId: record.device._id },
    adminEmail,
    requestMeta
  );

  activityService.recordActivity({
    module: ACTIVITY_MODULES.ATTENDANCE,
    action: ACTIVITY_ACTIONS.CREATE,
    entityType: 'Attendance',
    entityId: record._id,
    description: `Created attendance record ${record.attendanceCode} for ${record.person.fullName || record.person.firstName}`,
    metadata: { adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.LOW
  }).catch(() => {});

  return record.toPublicJSON();
};

export const updateAttendance = async (id, data, adminEmail, requestMeta = {}) => {
  const allowedFields = [
    'attendanceCode', 'personType', 'person', 'device', 'attendanceIdentity',
    'verificationMethod', 'attendanceType', 'timestamp', 'attendanceDate', 'attendanceTime',
    'status', 'remarks',
  ];

  const updates = buildUpdatePayload(data, allowedFields);

  if (Object.keys(updates).length === 0) {
    throw makeError(MESSAGES.ATTENDANCE_NO_CHANGES, 400);
  }

  const record = await Attendance.findById(String(id));
  if (!record) {
    logAttendanceNotFound(id, requestMeta);
    throw makeError(MESSAGES.ATTENDANCE_NOT_FOUND, 404);
  }

  if (updates.device !== undefined) {
    await assertDeviceExists(updates.device);
  }

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

  const newType = updates.attendanceType ?? record.attendanceType;
  const newTimestamp = updates.timestamp ?? record.timestamp;
  if (updates.attendanceType !== undefined || updates.timestamp !== undefined) {
    await assertChronologicalValidity(updates.person ?? record.person, newType, newTimestamp, id, requestMeta);
  }

  if (updates.status && updates.status !== record.status) {
    logAttendanceCorrected(
      { id: record._id, attendanceCode: record.attendanceCode, oldStatus: record.status, newStatus: updates.status },
      adminEmail,
      requestMeta
    );
  }

  record.set(updates);
  record.updatedBy = adminEmail;
  await record.save();

  await record.populate({
    path: 'person',
    select: 'firstName lastName fullName empId employeeId department',
    populate: { path: 'department', select: 'name code' }
  });
  await record.populate('device', 'deviceCode deviceName deviceCategory');

  logAttendanceUpdated(
    { id: record._id, attendanceCode: record.attendanceCode },
    adminEmail,
    requestMeta
  );

  return record.toPublicJSON();
};

export const softDeleteAttendance = async (id, adminEmail, requestMeta = {}) => {
  const record = await Attendance.findById(String(id));

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

  activityService.recordActivity({
    module: ACTIVITY_MODULES.ATTENDANCE,
    action: ACTIVITY_ACTIONS.DELETE,
    entityType: 'Attendance',
    entityId: record._id,
    description: `Soft-deleted attendance record ${record.attendanceCode}`,
    metadata: { adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.MEDIUM
  }).catch(() => {});
};

export const restoreAttendance = async (id, adminEmail, requestMeta = {}) => {
  const record = await Attendance.findById(String(id));

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
    select: 'firstName lastName fullName empId employeeId department',
    populate: { path: 'department', select: 'name code' }
  });
  await record.populate('device', 'deviceCode deviceName deviceCategory');

  logAttendanceRestored(
    { id: record._id, attendanceCode: record.attendanceCode },
    adminEmail,
    requestMeta
  );

  activityService.recordActivity({
    module: ACTIVITY_MODULES.ATTENDANCE,
    action: ACTIVITY_ACTIONS.RESTORE,
    entityType: 'Attendance',
    entityId: record._id,
    description: `Restored attendance record ${record.attendanceCode}`,
    metadata: { adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.LOW
  }).catch(() => {});

  return record.toPublicJSON();
};

export const correctAttendance = async (id, data, adminEmail, requestMeta = {}) => {
  const { status, attendanceType, remarks, correctionReason } = data;

  const record = await Attendance.findById(String(id));
  if (!record) {
    logAttendanceNotFound(id, requestMeta);
    throw makeError(MESSAGES.ATTENDANCE_NOT_FOUND, 404);
  }

  if (!record.isActive) {
    throw makeError(MESSAGES.ATTENDANCE_ALREADY_INACTIVE, 400);
  }

  let isModified = false;
  const originalStatus = record.status;
  const originalAttendanceType = record.attendanceType;
  const originalRemarks = record.remarks;

  if (status && status !== record.status) {
    record.status = status;
    isModified = true;
  }

  if (attendanceType && attendanceType !== record.attendanceType) {
    record.attendanceType = attendanceType;
    isModified = true;
  }

  if (remarks !== undefined && remarks !== record.remarks) {
    record.remarks = remarks;
    isModified = true;
  }

  if (!isModified) {
    throw makeError(MESSAGES.ATTENDANCE_NO_CHANGES, 400);
  }

  if (record.isModified('attendanceType')) {
    await assertChronologicalValidity(record.person, record.attendanceType, record.timestamp, id, requestMeta);
  }

  record.correctionHistory.push({
    correctionReason,
    correctedAt: new Date(),
    correctedBy: adminEmail,
    originalStatus,
    originalAttendanceType,
    originalRemarks
  });

  record.updatedBy = adminEmail;
  await record.save();

  await record.populate({
    path: 'person',
    select: 'firstName lastName fullName empId employeeId department',
    populate: { path: 'department', select: 'name code' }
  });
  await record.populate('device', 'deviceCode deviceName deviceCategory');

  logAttendanceCorrected(
    { id: record._id, attendanceCode: record.attendanceCode, oldStatus: originalStatus, newStatus: record.status, reason: correctionReason },
    adminEmail,
    requestMeta
  );

  activityService.recordActivity({
    module: ACTIVITY_MODULES.ATTENDANCE,
    action: ACTIVITY_ACTIONS.CORRECTION,
    entityType: 'Attendance',
    entityId: record._id,
    description: `Corrected attendance record ${record.attendanceCode}`,
    metadata: { oldStatus: originalStatus, newStatus: record.status, reason: correctionReason, adminEmail, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.MEDIUM
  }).catch(() => {});

  return record.toPublicJSON();
};