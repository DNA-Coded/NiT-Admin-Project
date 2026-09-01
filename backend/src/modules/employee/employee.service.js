import { Department } from '../departments/departments.model.js';
import Employee from './employee.model.js';

class EmployeeService {
  /**
   * Get paginated list of employee with full search, filtering, and sorting
   * @param {Object} options - Query parameters
   * @returns {Promise<Object>} Paginated result set with metadata
   */
  static async getAllEmployee(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = '',
      designation = '',
      status = '',
      isHOD = undefined,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    // Fuzzy text search across name, employee ID, identity, and email
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { employeeId: searchRegex },
        { attendanceIdentity: searchRegex },
        { email: searchRegex },
      ];
    }

    // Filter by department (supports ObjectId or Department Code string)
    if (department && department.trim()) {
      const trimmedDept = department.trim();
      if (trimmedDept.match(/^[0-9a-fA-F]{24}$/)) {
        filter.department = trimmedDept;
      } else {
        const deptDoc = await Department.findOne({ code: trimmedDept.toUpperCase() });
        filter.department = deptDoc ? deptDoc._id : null; // Prevent returning incorrect matches if code not found
      }
    }

    // Filter by exact designation
    if (designation && designation.trim()) {
      filter.designation = designation.trim();
    }

    // Filter by active/inactive status
    if (status && status.trim()) {
      filter.status = status.trim().toUpperCase();
    }

    // Filter by HOD flag
    if (isHOD !== undefined && isHOD !== '') {
      filter.isHOD = isHOD === 'true' || isHOD === true;
    }

    const sortOptions = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const [employeeList, totalCount] = await Promise.all([
      Employee.find(filter)
        .populate('department', 'name code')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Employee.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return {
      data: employeeList,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  }

  /**
   * Get single employee record by MongoDB ObjectId
   * @param {string} id - Employee ObjectId
   */
  static async getEmployeeById(id) {
    const employee = await Employee.findById(id).populate('department', 'name code').lean();
    if (!employee) {
      throw new Error(`Employee member not found with ID: ${id}`);
    }
    return employee;
  }

  /**
   * Get single employee record by official Employee Code (e.g., "NIT/0017")
   * @param {string} employeeId - Employee ID string
   */
  static async getEmployeeByEmployeeId(employeeId) {
    const employee = await Employee.findOne({ employeeId })
      .populate('department', 'name code')
      .lean();

    if (!employee) {
      throw new Error(`Employee member not found with Employee ID: ${employeeId}`);
    }
    return employee;
  }

  /**
   * Lookup employee member by 4-digit attendance/biometric identity (e.g., "0017")
   * Used directly by biometric device events and attendance processing pipelines
   * @param {string|number} attendanceIdentity - 4-digit biometric PIN
   */
  static async getEmployeeByAttendanceIdentity(attendanceIdentity) {
    const formattedIdentity = String(attendanceIdentity).padStart(4, '0');
    const employee = await Employee.findOne({ attendanceIdentity: formattedIdentity })
      .populate('department', 'name code')
      .lean();

    if (!employee) {
      throw new Error(`Employee member not found with attendance identity: ${formattedIdentity}`);
    }
    return employee;
  }

  /**
   * Get HOD associated with a given department Code or ID
   * @param {string} departmentIdOrCode - Department ID or Department Code (e.g., "CSE")
   */
  static async getDepartmentHOD(departmentIdOrCode) {
    let deptId = departmentIdOrCode;

    if (!departmentIdOrCode.match(/^[0-9a-fA-F]{24}$/)) {
      const deptDoc = await Department.findOne({ code: departmentIdOrCode.toUpperCase() });
      if (!deptDoc) {
        throw new Error(`Department not found with code: ${departmentIdOrCode}`);
      }
      deptId = deptDoc._id;
    }

    const hod = await Employee.findOne({ department: deptId, isHOD: true })
      .populate('department', 'name code')
      .lean();

    return hod;
  }

  /**
   * Create a new Employee record
   * @param {Object} employeeData - Employee object payload
   */
  static async createEmployee(employeeData) {
    if (employeeData.attendanceIdentity) {
      employeeData.attendanceIdentity = String(employeeData.attendanceIdentity).padStart(4, '0');
    }

    // Verify unique fields to prevent Mongoose duplicate key errors
    const conflicts = await Employee.findOne({
      $or: [
        { employeeId: employeeData.employeeId },
        { email: employeeData.email },
        { attendanceIdentity: employeeData.attendanceIdentity },
      ],
    });

    if (conflicts) {
      throw new Error('Employee with this Employee ID, Email, or Attendance Identity already exists.');
    }

    const newEmployee = new Employee(employeeData);
    await newEmployee.save();

    return await Employee.findById(newEmployee._id).populate('department', 'name code').lean();
  }

  /**
   * Update existing Employee member details
   * @param {string} id - Employee ObjectId
   * @param {Object} updateData - Fields to update
   */
  static async updateEmployee(id, updateData) {
    if (updateData.attendanceIdentity) {
      updateData.attendanceIdentity = String(updateData.attendanceIdentity).padStart(4, '0');
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('department', 'name code')
      .lean();

    if (!updatedEmployee) {
      throw new Error(`Employee member not found with ID: ${id}`);
    }

    return updatedEmployee;
  }

  /**
   * Soft-delete (set to RETIRED) or permanently remove a employee member
   * @param {string} id - Employee ObjectId
   * @param {boolean} softDelete - Defaults to true
   */
  static async deleteEmployee(id, softDelete = true) {
    if (softDelete) {
      const employee = await Employee.findByIdAndUpdate(
        id,
        { status: 'RETIRED' },
        { new: true }
      );
      if (!employee) throw new Error(`Employee member not found with ID: ${id}`);
      return { message: 'Employee status successfully updated to RETIRED', employee };
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) throw new Error(`Employee member not found with ID: ${id}`);
    return { message: 'Employee permanently removed', id };
  }

  /**
   * Aggregated metrics for dashboard statistics
   */
  static async getEmployeeStats() {
    const stats = await Employee.aggregate([
      {
        $facet: {
          totalByStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          totalByDepartment: [
            { $group: { _id: '$department', count: { $sum: 1 } } },
            {
              $lookup: {
                from: 'departments',
                localField: '_id',
                foreignField: '_id',
                as: 'departmentInfo',
              },
            },
            { $unwind: '$departmentInfo' },
            {
              $project: {
                _id: 1,
                count: 1,
                departmentCode: '$departmentInfo.code',
                departmentName: '$departmentInfo.name',
              },
            },
          ],
          totalHODs: [{ $match: { isHOD: true } }, { $count: 'count' }],
        },
      },
    ]);

    return stats[0];
  }

  /**
   * Restore a soft-deleted employee record
   * @param {string} id - Employee ObjectId
   */
  static async restoreEmployee(id) {
    const employee = await Employee.findById(id);
    if (!employee) throw new Error(`Employee member not found with ID: ${id}`);
    if (employee.isActive) throw new Error('Employee record is already active.');

    employee.isActive = true;
    employee.deletedAt = null;
    employee.deletedBy = null;
    employee.status = 'ACTIVE';
    await employee.save();

    return employee.toPublicJSON();
  }
}

export default EmployeeService;