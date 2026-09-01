import DepartmentService from './departments.service.js';

class DepartmentController {
  /**
   * GET /api/v1/departments
   */
  static async getAllDepartments(req, res, next) {
    try {
      const departments = await DepartmentService.getAllDepartments(req.query);
      return res.status(200).json({
        success: true,
        message: 'Departments list retrieved successfully.',
        data: departments,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/departments/:id
   */
  static async getDepartmentById(req, res, next) {
    try {
      const department = await DepartmentService.getDepartmentById(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Department retrieved successfully.',
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/departments/code/:code
   */
  static async getDepartmentByCode(req, res, next) {
    try {
      const department = await DepartmentService.getDepartmentByCode(req.params.code);
      return res.status(200).json({
        success: true,
        message: 'Department retrieved successfully.',
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/departments
   */
  static async createDepartment(req, res, next) {
    try {
      const department = await DepartmentService.createDepartment(req.body);
      return res.status(201).json({
        success: true,
        message: 'Department created successfully.',
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/departments/:id
   */
  static async updateDepartment(req, res, next) {
    try {
      const updatedDepartment = await DepartmentService.updateDepartment(
        req.params.id,
        req.body
      );
      return res.status(200).json({
        success: true,
        message: 'Department updated successfully.',
        data: updatedDepartment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/departments/:id?soft=true
   */
  static async deleteDepartment(req, res, next) {
    try {
      const softDelete = req.query.soft !== 'false';
      const result = await DepartmentService.deleteDepartment(req.params.id, softDelete);
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
   * PATCH /api/v1/departments/:id/restore
   */
  static async restoreDepartment(req, res, next) {
    try {
      const result = await DepartmentService.restoreDepartment(req.params.id);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default DepartmentController;