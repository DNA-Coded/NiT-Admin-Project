import Department from './departments.model.js';
import Employee from '../employee/employee.model.js';
import { escapeRegex } from '../../utils/sanitize.util.js';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class DepartmentService {
  /**
   * Get all departments with optional active filtering and employee counts
   * @param {Object} queryParams - Filters like active state and search term
   */
  static async getAllDepartments(queryParams = {}) {
    const { search = '', includeInactive = 'false' } = queryParams;

    const filter = {};

    if (includeInactive !== 'true') {
      filter.isActive = true;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [{ name: searchRegex }, { code: searchRegex }];
    }

    // Fetch departments and aggregate member count per department
    const departments = await Department.find(filter).sort({ code: 1 }).lean();

    // Attach employee counts to each department payload
    const departmentIds = departments.map((d) => d._id);
    const employeeCounts = await Employee.aggregate([
      { $match: { department: { $in: departmentIds }, status: 'ACTIVE' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(employeeCounts.map((item) => [item._id.toString(), item.count]));

    const result = departments.map((dept) => ({
      ...dept,
      activeEmployeeCount: countMap.get(dept._id.toString()) || 0,
    }));

    return result;
  }

  /**
   * Get single department by Mongo ObjectId
   * @param {string} id - Department ObjectId
   */
  static async getDepartmentById(id) {
    const department = await Department.findById(id).lean();
    if (!department) {
      throw new Error(`Department not found with ID: ${id}`);
    }

    const activeEmployeeCount = await Employee.countDocuments({
      department: id,
      status: 'ACTIVE',
    });

    return { ...department, activeEmployeeCount };
  }

  /**
   * Get department by unique Code (e.g. "CSE", "ECE")
   * @param {string} code - Department code string
   */
  static async getDepartmentByCode(code) {
    const formattedCode = code.trim().toUpperCase();
    const department = await Department.findOne({ code: formattedCode }).lean();

    if (!department) {
      throw new Error(`Department not found with code: ${formattedCode}`);
    }

    const activeEmployeeCount = await Employee.countDocuments({
      department: department._id,
      status: 'ACTIVE',
    });

    return { ...department, activeEmployeeCount };
  }

  /**
   * Create a new department
   * @param {Object} departmentData - Department data payload
   */
  static async createDepartment(departmentData) {
    const code = departmentData.code ? departmentData.code.trim().toUpperCase() : '';

    const existing = await Department.findOne({ code });
    if (existing) {
      throw new Error(`Department with code '${code}' already exists.`);
    }

    const newDepartment = new Department({
      ...departmentData,
      code,
    });

    await newDepartment.save();
    return newDepartment.toObject();
  }

  /**
   * Update department details
   * @param {string} id - Department ObjectId
   * @param {Object} updateData - Data to update
   */
  static async updateDepartment(id, updateData) {
    if (updateData.code) {
      updateData.code = updateData.code.trim().toUpperCase();

      const existing = await Department.findOne({
        code: updateData.code,
        _id: { $ne: String(id) },
      });

      if (existing) {
        throw new Error(`Another department with code '${updateData.code}' already exists.`);
      }
    }

    const updatedDepartment = await Department.findByIdAndUpdate(String(id), updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedDepartment) {
      throw new Error(`Department not found with ID: ${id}`);
    }

    return updatedDepartment;
  }

  /**
   * Soft-delete or hard-delete department
   * @param {string} id - Department ObjectId
   * @param {boolean} softDelete - Defaults to true
   */
  static async deleteDepartment(id, softDelete = true) {
    // Check if employee members are currently attached to this department
    const attachedEmployeeCount = await Employee.countDocuments({ department: id, isActive: true });
    if (attachedEmployeeCount > 0) {
      throw new Error(
        `Cannot delete department. There are ${attachedEmployeeCount} active employee members assigned to it.`
      );
    }

    if (softDelete) {
      const department = await Department.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      if (!department) throw new Error(`Department not found with ID: ${id}`);
      return { message: 'Department deactivated successfully', department };
    }

    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) throw new Error(`Department not found with ID: ${id}`);
    return { message: 'Department permanently removed', id };
  }

  /**
   * Restore a soft-deleted department
   * @param {string} id - Department ObjectId
   */
  static async restoreDepartment(id) {
    const department = await Department.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );
    if (!department) throw new Error(`Department not found with ID: ${id}`);
    return { message: 'Department restored successfully', department };
  }
}

export default DepartmentService;