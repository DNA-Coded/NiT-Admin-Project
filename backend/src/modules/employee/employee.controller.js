import EmployeeService from './employee.service.js';

class EmployeeController {
  /**
   * Get paginated employee list with filters & search
   * GET /api/v1/employee
   */
  static async getAllEmployee(req, res, next) {
    try {
      const result = await EmployeeService.getAllEmployee(req.query);
      return res.status(200).json({
        success: true,
        message: 'Employee list retrieved successfully.',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get employee stats/metrics for dashboard views
   * GET /api/v1/employee/stats
   */
  static async getEmployeeStats(req, res, next) {
    try {
      const stats = await EmployeeService.getEmployeeStats();
      return res.status(200).json({
        success: true,
        message: 'Employee statistics retrieved successfully.',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single employee member by ObjectId
   * GET /api/v1/employee/:id
   */
  static async getEmployeeById(req, res, next) {
    try {
      const employee = await EmployeeService.getEmployeeById(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Employee member retrieved successfully.',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get employee member by official Employee ID (e.g., NIT/0017)
   * GET /api/v1/employee/employee-id/:employeeId
   */
  static async getEmployeeByEmployeeId(req, res, next) {
    try {
      const { employeeId } = req.params;
      // Decode in case employee code contains URL-encoded slashes (e.g., NIT%2F0017)
      const decodedEmployeeId = decodeURIComponent(employeeId);
      const employee = await EmployeeService.getEmployeeByEmployeeId(decodedEmployeeId);
      return res.status(200).json({
        success: true,
        message: 'Employee member retrieved successfully.',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get employee member by 4-digit biometric PIN / attendance identity
   * GET /api/v1/employee/biometric/:attendanceIdentity
   */
  static async getEmployeeByAttendanceIdentity(req, res, next) {
    try {
      const employee = await EmployeeService.getEmployeeByAttendanceIdentity(
        req.params.attendanceIdentity
      );
      return res.status(200).json({
        success: true,
        message: 'Employee member retrieved successfully.',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get HOD of a specific department by Department Code or ObjectId
   * GET /api/v1/employee/hod/:departmentIdOrCode
   */
  static async getDepartmentHOD(req, res, next) {
    try {
      const hod = await EmployeeService.getDepartmentHOD(req.params.departmentIdOrCode);
      if (!hod) {
        return res.status(404).json({
          success: false,
          message: 'No HOD currently designated for this department.',
          data: null,
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Department HOD retrieved successfully.',
        data: hod,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new employee member
   * POST /api/v1/employee
   */
  static async createEmployee(req, res, next) {
    try {
      const newEmployee = await EmployeeService.createEmployee(req.body);
      return res.status(201).json({
        success: true,
        message: 'Employee member created successfully.',
        data: newEmployee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update employee member details
   * PUT /api/v1/employee/:id
   */
  static async updateEmployee(req, res, next) {
    try {
      const updatedEmployee = await EmployeeService.updateEmployee(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Employee details updated successfully.',
        data: updatedEmployee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete or retire employee member
   * DELETE /api/v1/employee/:id?soft=true
   */
  static async deleteEmployee(req, res, next) {
    try {
      const softDelete = req.query.soft !== 'false'; // Defaults to soft delete
      const result = await EmployeeService.deleteEmployee(req.params.id, softDelete);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Restore a soft-deleted employee record
   * PATCH /api/v1/employee/:id/restore
   */
  static async restoreEmployee(req, res, next) {
    try {
      const restoredEmployee = await EmployeeService.restoreEmployee(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Employee record restored successfully.',
        data: restoredEmployee,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default EmployeeController;