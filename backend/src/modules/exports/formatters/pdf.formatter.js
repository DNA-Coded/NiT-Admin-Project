import PDFDocument from 'pdfkit';

export class PDFFormatter {
  /**
   * Converts JSON data to a PDF Buffer
   * @param {Array} data - Array of objects from the Reports module
   * @returns {Promise<Buffer>} - PDF file buffer
   */
  static generate(data) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Title
        doc.fontSize(16).text('Exported Report', { align: 'center' });
        doc.moveDown(2);

        if (!data || data.length === 0) {
          doc.fontSize(12).text('No data available');
          doc.end();
          return;
        }

        const headers = Object.keys(data[0]);
        
        // Simple Table Math (just distributing evenly across page)
        const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const columnWidth = usableWidth / headers.length;
        
        // Draw Headers
        doc.font('Helvetica-Bold').fontSize(10);
        let startY = doc.y;
        
        headers.forEach((header, i) => {
          doc.text(
            header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1'), 
            doc.page.margins.left + (i * columnWidth), 
            startY, 
            { width: columnWidth, align: 'left' }
          );
        });
        
        doc.moveDown(1);
        doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
        doc.moveDown(0.5);

        // Draw Rows
        doc.font('Helvetica').fontSize(9);
        data.forEach(row => {
          if (doc.y > doc.page.height - doc.page.margins.bottom - 20) {
            doc.addPage();
            // Redraw headers on new page? (skipped for simplicity in this phase)
          }
          
          let rowY = doc.y;
          headers.forEach((header, i) => {
            const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
            doc.text(
              val, 
              doc.page.margins.left + (i * columnWidth), 
              rowY, 
              { width: columnWidth - 5, align: 'left' }
            );
          });
          
          doc.moveDown(0.5);
        });

        doc.end();
      } catch (err) {
        reject(new Error(`Failed to generate PDF: ${err.message}`));
      }
    });
  }
}
