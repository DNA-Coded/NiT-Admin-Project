import { VERIFICATION_METHODS } from '../../constants/attendance.constants.js';
import Employee from '../../modules/employee/employee.model.js';

export default class AttendanceMapper {
  static async mapRawToEvent(rawLog, providerName, deviceContext) {
    const rawVal = rawLog.userId || rawLog.empId || rawLog.UserId || rawLog.pin || '';
    const paddedId = /^\d+$/.test(String(rawVal)) ? String(rawVal).padStart(4, '0') : String(rawVal);
    const fullEmpId = paddedId.startsWith('NIT/') ? paddedId : `NIT/${paddedId}`;

    // 🎯 Extract attendance type dynamically ('CHECK_IN' or 'CHECK_OUT')
    const rawType = String(rawLog.attendanceType || rawLog.type || rawLog.punchType || 'CHECK_IN').toUpperCase();
    const attendanceType = (rawType === 'CHECK_OUT' || rawType === 'OUT') ? 'CHECK_OUT' : 'CHECK_IN';

    // Map verification method
    const rawMode = String(rawLog.verifyMode || rawLog.verificationMethod || '').toUpperCase();
    let verificationMethod = VERIFICATION_METHODS.FINGERPRINT;

    if (rawMode.includes('FACE')) {
      verificationMethod = VERIFICATION_METHODS.FACE_RECOGNITION;
    } else if (rawMode.includes('HYBRID')) {
      verificationMethod = VERIFICATION_METHODS.HYBRID;
    } else if (rawMode.includes('MANUAL')) {
      verificationMethod = VERIFICATION_METHODS.MANUAL;
    }

    const employee = await Employee.findOne({
      $or: [
        { attendanceIdentity: paddedId },
        { attendanceIdentity: fullEmpId },
        { empId: fullEmpId },
        { employeeId: fullEmpId }
      ],
      isActive: true
    })
      .populate('department', 'name code')
      .lean();

    return {
      eventId: rawLog.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      deviceId: deviceContext?._id || deviceContext?.id || rawLog.deviceId || 'SECUREEYE_DEVICE_01',
      provider: providerName || 'SIMULATOR',
      attendanceIdentity: paddedId,
      userId: paddedId,
      empId: fullEmpId,
      attendanceType, // 👈 Added dynamic attendance type!
      employee: employee
        ? {
            id: employee._id,
            employeeId: employee.empId || employee.employeeId,
            fullName: `${employee.firstName} ${employee.lastName}`,
            department: employee.department?.code || employee.deptCode || 'N/A',
            designation: employee.rawDesignation || employee.designation,
          }
        : null,
      timestamp: new Date(rawLog.timestamp || rawLog.time || Date.now()),
      verificationMethod,
      raw: rawLog,
    };
  }
}