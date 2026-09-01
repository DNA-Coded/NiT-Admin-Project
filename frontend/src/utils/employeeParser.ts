import { Employee } from '../types/attendance';

export function parseRawEmployeeLine(line: string): Employee | null {
  const parts = line.split('|').map((p) => p.trim());
  if (parts.length < 6 || parts[0] === 'Sl. No') return null;

  const [slNo, empCode, salutation, name, department, rawDesignation] = parts;

  // Check HOD status and clean designation
  const isHOD = rawDesignation.includes('HOD');
  const cleanDesignation = rawDesignation.replace('-HOD', '').replace('HOD', '').trim();

  // Generate a clean slug for email ID
  const cleanNameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '.');
  const numCode = empCode.split('/')[1] || slNo;

  return {
    id: `emp_${numCode}`,
    employeeId: empCode,
    salutation: salutation,
    name: name,
    fullName: `${salutation} ${name}`,
    email: `${cleanNameSlug}@nit.ac.in`,
    phone: '+91 98765 43210',
    department: department,
    designation: cleanDesignation,
    isHOD: isHOD,
    employmentType: 'Full-time',
    status: 'ACTIVE',
    joiningDate: '2022-08-01',
    biometricDevice: null,
    attendanceIdentity: `BIO_${numCode}`, // Standard identifier for biometric machines
    isActive: true,
    attendanceSummary: {
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
      leaveDays: 0,
    },
  };
}

export function parseRawDataSet(rawText: string): Employee[] {
  return rawText
    .split('\n')
    .map(parseRawEmployeeLine)
    .filter((emp): emp is Employee => emp !== null);
}