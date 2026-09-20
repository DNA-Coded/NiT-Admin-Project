import mongoose from 'mongoose';
import xlsx from 'xlsx';
import path from 'path';

// Adjust path imports based on where the script is run
// Assuming it is run from backend folder
import { Department } from '../src/modules/departments/departments.model.js';
import Employee from '../src/modules/employee/employee.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/nit-admin';
const EXCEL_PATH = 'D:\\Admin_project\\Employee Database.xlsx';

async function importData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log('Reading Excel file...');
    const workbook = xlsx.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Clear existing departments and employees
    console.log('Clearing existing Employees and Departments...');
    await Employee.deleteMany({});
    await Department.deleteMany({});

    // Keep track of created departments to avoid duplicates
    const departmentMap = {};

    console.log('Processing rows...');
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[1]) continue; // Skip if no EMPLOYEE CODE

      const employeeId = row[1].toString().trim();
      const rawName = row[3] ? row[3].toString().trim() : '';
      const rawDept = row[4] ? row[4].toString().trim() : 'UNKNOWN';
      const rawDesignation = row[5] ? row[5].toString().trim() : 'Assistant Professor';

      // Parse Name
      let firstName = 'Unknown';
      let lastName = 'Unknown';
      if (rawName) {
        const parts = rawName.split(' ');
        if (parts.length > 1) {
          lastName = parts.pop();
          firstName = parts.join(' ');
        } else {
          firstName = parts[0];
          lastName = parts[0];
        }
      }

      // Handle HOD designation
      let designation = rawDesignation;
      let isHOD = false;
      if (designation.includes('-HOD')) {
        isHOD = true;
        designation = designation.replace('-HOD', '');
      }

      // Ensure Department exists
      if (!departmentMap[rawDept]) {
        let deptCode = rawDept.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
        const dept = await Department.create({
          name: rawDept,
          code: deptCode,
          description: `Department of ${rawDept}`
        });
        departmentMap[rawDept] = dept._id;
      }

      const departmentId = departmentMap[rawDept];

      // Create Employee
      await Employee.create({
        employeeId: employeeId,
        firstName: firstName,
        lastName: lastName,
        email: `${employeeId.toLowerCase()}@nit.ac.in`,
        designation: designation,
        department: departmentId,
        isHOD: isHOD,
        attendanceIdentity: employeeId, // Using employeeId as fallback
        status: 'ACTIVE',
        isActive: true,
        createdBy: 'system_import@nit.ac.in'
      });
    }

    console.log('Import successful!');
    process.exit(0);
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

importData();
