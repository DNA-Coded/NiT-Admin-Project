import { Parser } from 'json2csv';

export class CSVFormatter {
  /**
   * Converts JSON data to a CSV Buffer
   * @param {Array} data - Array of objects from the Reports module
   * @returns {Buffer} - CSV file buffer
   */
  static generate(data) {
    if (!data || data.length === 0) {
      return Buffer.from('No data available\n');
    }

    try {
      // json2csv automatically detects fields from the first object
      const json2csvParser = new Parser();
      const csvString = json2csvParser.parse(data);
      return Buffer.from(csvString);
    } catch (err) {
      throw new Error(`Failed to generate CSV: ${err.message}`);
    }
  }
}
