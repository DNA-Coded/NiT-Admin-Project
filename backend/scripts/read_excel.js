import xlsx from 'xlsx';

const workbook = xlsx.readFile('D:\\Admin_project\\Employee Database.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const deps = new Set();
const desigs = new Set();

// Skip header
for (let i = 1; i < data.length; i++) {
  const row = data[i];
  if (!row[1]) continue; // no employee code
  if (row[4]) deps.add(row[4].toString().trim());
  if (row[5]) desigs.add(row[5].toString().trim());
}

console.log("Departments:");
console.log(Array.from(deps));
console.log("Designations:");
console.log(Array.from(desigs));
