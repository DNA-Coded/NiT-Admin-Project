import ExcelJS from 'exceljs';

export class ExcelFormatter {
  /**
   * Converts JSON data to an XLSX Buffer
   * @param {Array} data - Array of objects from the Reports module
   * @returns {Promise<Buffer>} - XLSX file buffer
   */
  static async generate(data) {
    if (!data || data.length === 0) {
      const emptyWorkbook = new ExcelJS.Workbook();
      const sheet = emptyWorkbook.addWorksheet('Export');
      sheet.addRow(['No data available']);
      return await emptyWorkbook.xlsx.writeBuffer();
    }

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'NiT Admin System';
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet('Export Data');
      
      // Extract headers from the keys of the first object
      const headers = Object.keys(data[0]);
      
      worksheet.columns = headers.map(header => ({
        header: header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1'), // Camel case to title case
        key: header,
        width: 25 // Default width
      }));

      // Make headers bold
      worksheet.getRow(1).font = { bold: true };
      
      // Freeze the top row
      worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ];

      // Add rows
      data.forEach(row => {
        worksheet.addRow(row);
      });

      return await workbook.xlsx.writeBuffer();
    } catch (err) {
      throw new Error(`Failed to generate Excel: ${err.message}`);
    }
  }
}
