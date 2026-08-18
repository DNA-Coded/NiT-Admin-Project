import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Adjust model import paths to match your project structure
import Employee from '../modules/employee/employee.model';
import Department from '../modules/departments/departments.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nit-admin';

// ─── 1. DEPARTMENT METADATA MAP ───────────────────────────────────────────────────
const DEPARTMENT_METADATA: Record<string, { name: string; description: string }> = {
  'Admin': { name: 'Administration', description: 'Administrative, Operations & Executive Staff' },
  'PHYSICS': { name: 'Department of Physics', description: 'Department of Basic Sciences (Physics)' },
  'MATH': { name: 'Department of Mathematics', description: 'Department of Mathematics' },
  'CA': { name: 'Department of Computer Applications', description: 'Department of Computer Applications (MCA/BCA)' },
  'ENGLISH': { name: 'Department of Humanities & English', description: 'Department of Humanities & Languages' },
  'CSE - AIML': { name: 'CSE (AI & Machine Learning)', description: 'Computer Science & Engineering (AI & ML)' },
  'CST': { name: 'Computer Science & Technology', description: 'Department of Computer Science & Technology' },
  'CSBS': { name: 'Computer Science & Business Systems', description: 'Department of Computer Science & Business Systems' },
  'CHEMISTRY': { name: 'Department of Chemistry', description: 'Department of Basic Sciences (Chemistry)' },
  'BA': { name: 'Department of Business Administration', description: 'Department of Business Administration (BBA)' },
  'CSE - DS': { name: 'CSE (Data Science)', description: 'Computer Science & Engineering (Data Science)' },
  'IT': { name: 'Department of Information Technology', description: 'Department of Information Technology' },
  'EE': { name: 'Department of Electrical Engineering', description: 'Department of Electrical Engineering' },
  'ECE': { name: 'Electronics & Communication Engineering', description: 'Department of Electronics & Communication Engineering' },
  'CIVIL': { name: 'Department of Civil Engineering', description: 'Department of Civil Engineering' },
  'CSE': { name: 'Computer Science & Engineering', description: 'Department of Computer Science & Engineering' },
  'ECS': { name: 'Electronics & Computer Science', description: 'Department of Electronics & Computer Science' },
  'ME': { name: 'Department of Mechanical Engineering', description: 'Department of Mechanical Engineering' },
};

// ─── 2. RAW OFFICIAL RECORDS ─────────────────────────────────────────────────────
const rawEmployeeRecords = [
  // Admin Staff
  { empId: 'NIT/0017', title: 'Prof. (Dr.)', firstName: 'Subhram', lastName: 'Das', deptCode: 'Admin', rawDesignation: 'Principal', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0089', title: 'Mr.', firstName: 'Ratan', lastName: 'Das', deptCode: 'Admin', rawDesignation: 'Site Supervisor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0197', title: 'Mr.', firstName: 'Souren', lastName: 'Banerjee', deptCode: 'Admin', rawDesignation: 'Assistant to Library', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0402', title: 'Mr.', firstName: 'Debasis', lastName: 'Saha', deptCode: 'Admin', rawDesignation: 'Jr. Office Assistant', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0479', title: 'Mr.', firstName: 'Subham', lastName: 'Mal', deptCode: 'Admin', rawDesignation: 'Jr. Office Assistant', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0530', title: 'Mr.', firstName: 'Kalyan', lastName: 'Sinha Roy', deptCode: 'Admin', rawDesignation: 'Library-Assistant', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0544', title: 'Dr.', firstName: 'Nidhi', lastName: 'Singh', deptCode: 'Admin', rawDesignation: 'Registrar', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0581', title: 'Mr.', firstName: 'Sukanto', lastName: 'Senapati', deptCode: 'Admin', rawDesignation: 'Store In-charge', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0694', title: 'Ms.', firstName: 'Priyanka', lastName: 'Bhattacharjee', deptCode: 'Admin', rawDesignation: 'Library-Assistant', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0706', title: 'Ms.', firstName: 'Banashree', lastName: 'Pal', deptCode: 'Admin', rawDesignation: 'Library-Assistant', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0723', title: 'Mr.', firstName: 'Subham', lastName: 'Dutta', deptCode: 'Admin', rawDesignation: 'Site Engineer', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0729', title: 'Ms.', firstName: 'Punita', lastName: 'Gaba', deptCode: 'Admin', rawDesignation: 'Executive Administration', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0735', title: 'Mr.', firstName: 'Soumitra', lastName: 'Chakraborty', deptCode: 'Admin', rawDesignation: 'Executive in Accounts Department', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0793', title: 'Mr.', firstName: 'Kushal', lastName: 'Bardhan', deptCode: 'Admin', rawDesignation: 'Office Assistant (Exam cell)', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1298', title: 'Ms.', firstName: 'Sreetama', lastName: 'Basu', deptCode: 'Admin', rawDesignation: 'Office Executive', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1303', title: 'Ms.', firstName: 'Soma', lastName: 'Goswami', deptCode: 'Admin', rawDesignation: 'Front Office Executive', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1327', title: 'Mr.', firstName: 'Debopam', lastName: 'Nandy', deptCode: 'Admin', rawDesignation: 'Office Assistant (T & P)', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1329', title: 'Mr.', firstName: 'Biswarup', lastName: 'Bhattacharjee', deptCode: 'Admin', rawDesignation: 'Training & Placement Officer', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1383', title: 'Mr.', firstName: 'Indradeep', lastName: 'Majumder', deptCode: 'Admin', rawDesignation: 'Executive- Accounts', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1388', title: 'Mr.', firstName: 'Shishir', lastName: 'Kumar Sur', deptCode: 'Admin', rawDesignation: 'Executive-Marketing & Business Development', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1401', title: 'Mr.', firstName: 'Rana', lastName: 'Ghosh', deptCode: 'Admin', rawDesignation: 'Accounts - Executive', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1510', title: 'Mr.', firstName: 'Atin', lastName: 'Swarnakar', deptCode: 'Admin', rawDesignation: 'Site Intern', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1519', title: 'Mr.', firstName: 'Debarun', lastName: 'Paul', deptCode: 'Admin', rawDesignation: 'HR Executive', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1584', title: 'Mr.', firstName: 'Anil', lastName: 'Kumar Sharma', deptCode: 'Admin', rawDesignation: 'Head - Talent Transformation', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1596', title: 'Mr.', firstName: 'Arup', lastName: 'Kumar Maity', deptCode: 'Admin', rawDesignation: 'Telecaller cum Admission Assistant', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1602', title: 'Ms.', firstName: 'Debanneeta', lastName: 'Bose', deptCode: 'Admin', rawDesignation: 'Office Executive', createdBy: process.env.SUPER_ADMIN_NAME },

  // Faculty / Academic Staff
  { empId: 'NIT/0002', title: 'Dr.', firstName: 'Indrani', lastName: '(Dey) Sarkar', deptCode: 'PHYSICS', rawDesignation: 'Associate Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0030', title: 'Dr.', firstName: 'Nikhilesh', lastName: 'Sil', deptCode: 'MATH', rawDesignation: 'Associate Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0070', title: 'Mrs.', firstName: 'Debrupa', lastName: '(Pal) Palit', deptCode: 'CA', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0087', title: 'Ms.', firstName: 'Rajasi', lastName: 'Ray', deptCode: 'ENGLISH', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0112', title: 'Dr.', firstName: 'Sagarika', lastName: 'Chowdhury', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0118', title: 'Dr.', firstName: 'Koushik', lastName: 'Karmakar', deptCode: 'CST', rawDesignation: 'Assistant Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0159', title: 'Mrs.', firstName: 'Subhasree', lastName: '(Bhattacharjee) Choudhury', deptCode: 'CA', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0168', title: 'Dr.', firstName: 'Jayanta', lastName: 'Pal', deptCode: 'CSBS', rawDesignation: 'Associate Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0170', title: 'Dr.', firstName: 'Sarbani', lastName: 'Ganguly', deptCode: 'CHEMISTRY', rawDesignation: 'Assistant Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0171', title: 'Dr.', firstName: 'Sriparna', lastName: 'Guha', deptCode: 'BA', rawDesignation: 'Assistant Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0184', title: 'Mrs.', firstName: 'Rupa', lastName: 'Saha', deptCode: 'CA', rawDesignation: 'Assistant Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0209', title: 'Dr.', firstName: 'Chandrima', lastName: 'Chakrabarti', deptCode: 'CSE - DS', rawDesignation: 'Associate Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0221', title: 'Dr.', firstName: 'Dhananjay', lastName: 'Kr. Tripathi', deptCode: 'PHYSICS', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0227', title: 'Dr.', firstName: 'Soumen', lastName: 'Ghosh', deptCode: 'IT', rawDesignation: 'Assistant Professor Dpty. (COE)', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0238', title: 'Ms.', firstName: 'Dipu', lastName: 'Mistry', deptCode: 'EE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0241', title: 'Mr.', firstName: 'Soumen', lastName: 'Pal', deptCode: 'ECE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0244', title: 'Dr.', firstName: 'Bidyut', lastName: 'Kumar Medya', deptCode: 'IT', rawDesignation: 'Professor & COE', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0247', title: 'Dr.', firstName: 'Sandhya', lastName: 'Pattanayak', deptCode: 'ECE', rawDesignation: 'Associate Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0248', title: 'Ms.', firstName: 'Sharmistha', lastName: 'Basu', deptCode: 'ENGLISH', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0250', title: 'Mr.', firstName: 'Rajkumar', lastName: 'Banerjee', deptCode: 'CIVIL', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0251', title: 'Dr.', firstName: 'Kaushik', lastName: 'Sarkar', deptCode: 'ECE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0252', title: 'Dr.', firstName: 'Susmita', lastName: 'Karan', deptCode: 'PHYSICS', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0254', title: 'Dr.', firstName: 'Pranab', lastName: 'Hazra', deptCode: 'ECE', rawDesignation: 'Assistant Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0263', title: 'Ms.', firstName: 'Sujata', lastName: 'Kundu', deptCode: 'IT', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0268', title: 'Mr.', firstName: 'Anirban', lastName: 'Bhar', deptCode: 'IT', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0276', title: 'Dr.', firstName: 'Rupa', lastName: '(Bhattacharyya) Chakrabotry', deptCode: 'CHEMISTRY', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0282', title: 'Ms.', firstName: 'Arpita', lastName: 'Barman', deptCode: 'ECE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0283', title: 'Dr.', firstName: 'Suchismita', lastName: '(Maiti) Biswas', deptCode: 'IT', rawDesignation: 'Associate Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0342', title: 'Dr.', firstName: 'Ashifuddin', lastName: 'Mondal', deptCode: 'CSE', rawDesignation: 'Associate Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0372', title: 'Dr.', firstName: 'Anukul', lastName: 'Maity', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0385', title: 'Ms.', firstName: 'Swati', lastName: '(Banerjee) Barui', deptCode: 'ECE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0410', title: 'Mr.', firstName: 'Abhijit', lastName: 'Ghosh', deptCode: 'ECE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0414', title: 'Dr.', firstName: 'Arkendu', lastName: 'Mitra', deptCode: 'EE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0415', title: 'Ms.', firstName: 'Kamalika', lastName: 'Benerjee', deptCode: 'EE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0422', title: 'Dr.', firstName: 'Bansari', lastName: 'Deb Majumder', deptCode: 'EE', rawDesignation: 'Associate Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0456', title: 'Dr.', firstName: 'Sangita', lastName: '(Roy) Biswas', deptCode: 'ECE', rawDesignation: 'Associate Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0468', title: 'Ms.', firstName: 'Debjani', lastName: 'Chakraborty', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0472', title: 'Mr.', firstName: 'Sudhangshu', lastName: 'Sarkar', deptCode: 'EE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0473', title: 'Mr.', firstName: 'Abhipriya', lastName: 'Halder', deptCode: 'CIVIL', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0497', title: 'Mr.', firstName: 'Soumya', lastName: 'Bhattacharyya', deptCode: 'IT', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0498', title: 'Dr.', firstName: 'Shubhendu', lastName: 'Banerjee', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0512', title: 'Dr.', firstName: 'Moupali', lastName: 'Roy', deptCode: 'ECE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0529', title: 'Ms.', firstName: 'Subhra', lastName: 'Mukherjee', deptCode: 'EE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0540', title: 'Ms.', firstName: 'Priyanjali', lastName: 'Mukherjee', deptCode: 'EE', rawDesignation: 'Assistant Professor Asst. COE', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0620', title: 'Dr.', firstName: 'Susmita', lastName: 'Das', deptCode: 'ECS', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0638', title: 'Mr.', firstName: 'Ankesh', lastName: 'Samanta', deptCode: 'ME', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0639', title: 'Mr.', firstName: 'Akhtarujjaman', lastName: 'Sarkar', deptCode: 'ME', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0642', title: 'Mr.', firstName: 'Arya', lastName: 'Banerjee', deptCode: 'CIVIL', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0654', title: 'Mr.', firstName: 'Arghya', lastName: 'Gupta', deptCode: 'ME', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0696', title: 'Mr.', firstName: 'Pallav', lastName: 'Dutta', deptCode: 'EE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0727', title: 'Dr.', firstName: 'Sumanta', lastName: 'Kundu', deptCode: 'EE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0730', title: 'Ms.', firstName: 'Debopriya', lastName: 'Dey', deptCode: 'MATH', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0731', title: 'Dr.', firstName: 'Sumit', lastName: 'Chabri', deptCode: 'ME', rawDesignation: 'Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0740', title: 'Dr.', firstName: 'Abhishek', lastName: 'Hazra', deptCode: 'CIVIL', rawDesignation: 'Assistant Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0744', title: 'Ms.', firstName: 'Anasuya', lastName: 'Mondal', deptCode: 'CIVIL', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0751', title: 'Dr.', firstName: 'Biswajit', lastName: 'Halder', deptCode: 'EE', rawDesignation: 'Associate Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0754', title: 'Dr.', firstName: 'Shilpi', lastName: 'Pal', deptCode: 'MATH', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0755', title: 'Ms.', firstName: 'Payel', lastName: 'Mondal', deptCode: 'MATH', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0760', title: 'Dr.', firstName: 'Bishaljit', lastName: 'Paul', deptCode: 'EE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0764', title: 'Mr.', firstName: 'Somnath', lastName: 'Chakraborty', deptCode: 'BA', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0765', title: 'Ms.', firstName: 'Sanghamitra', lastName: 'Layek', deptCode: 'ECS', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0772', title: 'Dr.', firstName: 'Shambhu', lastName: 'Nath Saha', deptCode: 'IT', rawDesignation: 'Associate Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0780', title: 'Dr.', firstName: 'Sourav', lastName: 'Saha', deptCode: 'CSE', rawDesignation: 'Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0781', title: 'Dr.', firstName: 'Jagannibas', lastName: 'Paul Choudhury', deptCode: 'CSE', rawDesignation: 'Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0791', title: 'Dr.', firstName: 'Papri', lastName: 'Ghosh', deptCode: 'CSE', rawDesignation: 'Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0792', title: 'Mr.', firstName: 'Amit', lastName: 'Nigam', deptCode: 'ECE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1296', title: 'Ms.', firstName: 'Aparajita', lastName: 'Paul', deptCode: 'ENGLISH', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1300', title: 'Mr.', firstName: 'Debanjan', lastName: 'Mitra', deptCode: 'IT', rawDesignation: 'Assistant Professor (Training)', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1302', title: 'Mr.', firstName: 'Apurba', lastName: 'Ghosh', deptCode: 'MATH', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1308', title: 'Dr.', firstName: 'Swastika', lastName: '(Chakraborty) Mukhopadhyay', deptCode: 'ECE', rawDesignation: 'Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1312', title: 'Dr.', firstName: 'Subimal', lastName: 'Roy Barman', deptCode: 'EE', rawDesignation: 'Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1313', title: 'Dr.', firstName: 'Pushpita', lastName: 'Roy', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1317', title: 'Ms.', firstName: 'Marcelline', lastName: 'Salome Gomes', deptCode: 'BA', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1321', title: 'Dr.', firstName: 'Sibapriya', lastName: 'Mukherjee', deptCode: 'CIVIL', rawDesignation: 'Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1368', title: 'Mr.', firstName: 'Subhankar', lastName: 'Dey', deptCode: 'CIVIL', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1369', title: 'Ms.', firstName: 'Debasmita', lastName: 'Sen', deptCode: 'ENGLISH', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1373', title: 'Ms.', firstName: 'Prianka', lastName: 'Dey', deptCode: 'CSBS', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1374', title: 'Dr.', firstName: 'Suman', lastName: 'Kumar Bhattachryya', deptCode: 'IT', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1379', title: 'Mr.', firstName: 'Sudip', lastName: 'Das', deptCode: 'CA', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1381', title: 'Dr.', firstName: 'Puja', lastName: 'Supakar', deptCode: 'MATH', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1385', title: 'Ms.', firstName: 'Bingshati', lastName: 'Mondal', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1397', title: 'Ms.', firstName: 'Swarnali', lastName: 'Daw', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1398', title: 'Dr.', firstName: 'Bikas', lastName: 'Mondal', deptCode: 'ECS', rawDesignation: 'Assistant Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1399', title: 'Dr.', firstName: 'Neepa', lastName: 'Biswas', deptCode: 'IT', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1418', title: 'Ms.', firstName: 'Jayita', lastName: 'Pal', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1443', title: 'Mr.', firstName: 'Avishek', lastName: 'Nath', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1445', title: 'Ms.', firstName: 'Ipsita', lastName: 'Dalui', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1450', title: 'Mr.', firstName: 'Tanmoy', lastName: 'Ghosh', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1458', title: 'Mr.', firstName: 'Mrinmoy', lastName: 'Guria', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1466', title: 'Ms.', firstName: 'Sohinee', lastName: 'Mondal', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1468', title: 'Mr.', firstName: 'Tathagata', lastName: 'Chatterjee', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1469', title: 'Ms.', firstName: 'Namrata', lastName: 'Pandey', deptCode: 'ENGLISH', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1478', title: 'Ms.', firstName: 'Ritwika', lastName: 'Mukherjee', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1479', title: 'Ms.', firstName: 'Suseta', lastName: 'Datta', deptCode: 'CA', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1484', title: 'Mr.', firstName: 'Arindam', lastName: 'Das', deptCode: 'CSE - DS', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1487', title: 'Dr.', firstName: 'Bimal', lastName: 'Datta', deptCode: 'CSE', rawDesignation: 'Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1488', title: 'Ms.', firstName: 'Pritusna', lastName: 'Banik', deptCode: 'CST', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1491', title: 'Ms.', firstName: 'Dishani', lastName: 'Roy', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1492', title: 'Ms.', firstName: 'Ritama', lastName: 'Sharma', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1493', title: 'Mr.', firstName: 'Dipayan', lastName: 'Das', deptCode: 'IT', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1499', title: 'Mr.', firstName: 'Gopal', lastName: 'Pramanik', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1502', title: 'Dr.', firstName: 'Dipankar', lastName: 'Saha', deptCode: 'ECE', rawDesignation: 'Associate Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1522', title: 'Dr.', firstName: 'Nabanita', lastName: 'Das', deptCode: 'CSE - DS', rawDesignation: 'Associate Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1523', title: 'Mr.', firstName: 'Alok', lastName: 'Nath Pal', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1529', title: 'Dr.', firstName: 'Sudakshina', lastName: 'Mandal', deptCode: 'CA', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1534', title: 'Mr.', firstName: 'Debabrata', lastName: 'Maity', deptCode: 'IT', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1551', title: 'Dr.', firstName: 'Kishalay', lastName: 'Bairagi', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1552', title: 'Dr.', firstName: 'Maitrayee', lastName: 'Chakrabarty', deptCode: 'EE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1556', title: 'Dr.', firstName: 'Soma', lastName: 'Chatterjee', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1557', title: 'Ms.', firstName: 'Karobi', lastName: 'Sarkar', deptCode: 'CST', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1558', title: 'Mr.', firstName: 'Naren', lastName: 'Debnath', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1561', title: 'Mr.', firstName: 'Pratap', lastName: 'Chandra Roy', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1562', title: 'Ms.', firstName: 'Promita', lastName: 'Dey', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1563', title: 'Mr.', firstName: 'Sudip', lastName: 'Hansda', deptCode: 'CSBS', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1564', title: 'Mr.', firstName: 'Souvik', lastName: 'Sharma', deptCode: 'CIVIL', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1566', title: 'Dr.', firstName: 'Parthasarathi', lastName: 'De', deptCode: 'CSE - AIML', rawDesignation: 'Associate Professor-HOD', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1567', title: 'Ms.', firstName: 'Shristi', lastName: 'Seal', deptCode: 'CSBS', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1583', title: 'Ms.', firstName: 'Mousumi', lastName: 'Mitra', deptCode: 'CSE - DS', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1587', title: 'Ms.', firstName: 'Mouli', lastName: 'Das', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1590', title: 'Mr.', firstName: 'Abhishek', lastName: 'Banerjee', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1591', title: 'Ms.', firstName: 'Pubali', lastName: 'Maiti', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1592', title: 'Ms.', firstName: 'Ankita', lastName: 'Barua', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1595', title: 'Mr.', firstName: 'Biswajit', lastName: 'Patra', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1598', title: 'Mr.', firstName: 'Debarshi', lastName: 'Bandyopadhyay', deptCode: 'CSE - AIML', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1599', title: 'Dr.', firstName: 'Subhabrata', lastName: 'Roy', deptCode: 'ECE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1601', title: 'Dr.', firstName: 'Sujit', lastName: 'Saha', deptCode: 'ME', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1615', title: 'Mr.', firstName: 'Arvin', lastName: 'Bera', deptCode: 'CSE - DS', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1616', title: 'Mr.', firstName: 'Archi', lastName: 'Choudhary', deptCode: 'CSE', rawDesignation: 'Assistant Professor', createdBy: process.env.SUPER_ADMIN_NAME },

  // Technical & Support Staff
  { empId: 'NIT/0042', title: 'Mr.', firstName: 'Amit', lastName: 'Mitra', deptCode: 'EE', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0045', title: 'Mr.', firstName: 'Partha', lastName: 'Bhattacharyya', deptCode: 'ME', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0046', title: 'Mr.', firstName: 'Partha', lastName: 'Pratim Basu', deptCode: 'IT', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0047', title: 'Mr.', firstName: 'Pran', lastName: 'Krishna Kumar', deptCode: 'ME', rawDesignation: 'Lab Attendant', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0049', title: 'Mr.', firstName: 'Soumen', lastName: 'Roy', deptCode: 'ME', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0053', title: 'Mrs.', firstName: 'Anusree', lastName: 'Mondal', deptCode: 'ECE', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0063', title: 'Mr.', firstName: 'Milan', lastName: 'Banerjee', deptCode: 'EE', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0162', title: 'Mr.', firstName: 'Amitava', lastName: 'Sanfui', deptCode: 'ME', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0185', title: 'Mrs.', firstName: 'Joyita', lastName: 'Basak', deptCode: 'CSE', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0190', title: 'Mrs.', firstName: 'Srabani', lastName: 'Das (nee) Roy', deptCode: 'ECE', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0202', title: 'Mr.', firstName: 'Atanu', lastName: 'Sen', deptCode: 'CSE', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0203', title: 'Mrs.', firstName: 'Haimanti', lastName: 'Tarafdar', deptCode: 'IT', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0204', title: 'Mr.', firstName: 'Prasenjit', lastName: 'Guha', deptCode: 'IT', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0210', title: 'Mr.', firstName: 'Atanu', lastName: 'Wadadar', deptCode: 'ECE', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0226', title: 'Mrs.', firstName: 'Rupa', lastName: 'Das Gupta (Guha)', deptCode: 'EE', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0236', title: 'Mr.', firstName: 'Debtosh', lastName: 'Panda', deptCode: 'PHYSICS', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0262', title: 'Mr.', firstName: 'Sudip', lastName: 'Pal', deptCode: 'ECE', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0281', title: 'Mrs.', firstName: 'Rekha', lastName: 'Sarkar Majumder', deptCode: 'ECE', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0289', title: 'Mr.', firstName: 'Bhola', lastName: 'Nath Pal', deptCode: 'ECE', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0408', title: 'Mr.', firstName: 'Arup', lastName: 'Kumar Ghosh', deptCode: 'EE', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0418', title: 'Mr.', firstName: 'Chiradeep', lastName: 'Ghose', deptCode: 'IT', rawDesignation: 'System Admin', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0426', title: 'Mr.', firstName: 'Karuna', lastName: 'Ketan Karan', deptCode: 'PHYSICS', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0455', title: 'Mr.', firstName: 'Bhola', lastName: 'Guha', deptCode: 'ME', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0490', title: 'Mr.', firstName: 'Barendra', lastName: 'Kanta Chakraborty', deptCode: 'ME', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0513', title: 'Mr.', firstName: 'Subhajit', lastName: 'Roy', deptCode: 'EE', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0526', title: 'Mr.', firstName: 'Avijit', lastName: 'Dey', deptCode: 'ECE', rawDesignation: 'Jr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0534', title: 'Mr.', firstName: 'Subrata', lastName: 'Mazumder', deptCode: 'ECE', rawDesignation: 'Sr. Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0640', title: 'Mr.', firstName: 'Nasiruddin', lastName: 'Mondal', deptCode: 'EE', rawDesignation: 'Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/0700', title: 'Mr.', firstName: 'Rajat', lastName: 'Saha', deptCode: 'CIVIL', rawDesignation: 'Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
  { empId: 'NIT/1333', title: 'Mr.', firstName: 'Mahendra', lastName: 'Kumar Sahu', deptCode: 'CHEMISTRY', rawDesignation: 'Tech. Asst.', createdBy: process.env.SUPER_ADMIN_NAME },
];

// Helper to generate clean professional email addresses
function generateEmail(fullName: string, empId: string): string {
  const cleanName = fullName
    .replace(/\(.*?\)/g, '') // strip text in brackets e.g. (Dey)
    .replace(/[^a-zA-Z\s]/g, '') // strip special characters
    .trim()
    .toLowerCase();

  const parts = cleanName.split(/\s+/);
  const firstName = parts[0] || 'staff';
  const lastNameInitial = parts.length > 1 ? parts[parts.length - 1][0] : '';
  const numCode = empId.split('/')[1] || Math.floor(1000 + Math.random() * 9000);

  return `${firstName}.${lastNameInitial}${numCode}@nit.ac.in`;
}

// ─── 3. SEEDING LOGIC ────────────────────────────────────────────────────────────
const seedOfficialData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully.');

    // Step A: Purge old data
    console.log('🧹 Purging existing Departments and Faculty records...');
    await Department.deleteMany({});
    await Employee.deleteMany({});

    // Step B: Extract unique department codes and create Departments
    console.log('🏢 Extracting and seeding Departments...');
    const uniqueDeptCodes = Array.from(new Set(rawEmployeeRecords.map(r => r.deptCode)));

    const departmentsToInsert = uniqueDeptCodes.map(code => {
      const meta = DEPARTMENT_METADATA[code] || { name: `Department of ${code}`, description: `${code} Department` };
      return {
        name: meta.name,
        code,
        description: meta.description,
        isActive: true,
      };
    });

    const createdDepartments = await Department.insertMany(departmentsToInsert);
    console.log(`✅ Successfully created ${createdDepartments.length} unique Departments.`);

    // Build Department Code -> Mongoose _id lookup map
    const deptMap = createdDepartments.reduce((acc, dept) => {
      acc[dept.code] = dept._id;
      return acc;
    }, {} as Record<string, mongoose.Types.ObjectId>);

    // Step C: Format and link Employee / Faculty records
    // Step C: Format and link Employee / Faculty records
    console.log('👨‍🏫 Formatting and seeding 158 Employee records...');
    
    const facultyToInsert = rawEmployeeRecords.map((item) => {
      const isHOD = item.rawDesignation.toUpperCase().includes('HOD');
      
      // 1. Strip -HOD
      // 2. Fix typos in raw data (e.g. "Asistant" -> "Assistant")
      let designation = item.rawDesignation
        .replace(/-HOD/i, '')
        .replace(/Asistant/g, 'Assistant')
        .trim();
    
      const name = `${item.firstName} ${item.lastName}`.trim();
      const fullName = `${item.title ? item.title + ' ' : ''}${name}`.trim();
      const createdBy = item.createdBy || process.env.SUPER_ADMIN_NAME || 'SYSTEM_SEEDER';
    
      return {
        employeeId: item.empId,
        title: item.title,
        firstName: item.firstName,
        lastName: item.lastName,
        fullName,
        email: generateEmail(name, item.empId),
        phone: '+91 98300 00000',
        department: deptMap[item.deptCode],
        designation,
        isHOD,
        status: 'ACTIVE',
        joiningDate: new Date('2020-01-15'),
        attendanceIdentity: `BIO-${item.empId.replace('NIT/', '')}`,
        isActive: true,
        createdBy,
      };
    });

    const createdFaculty = await Employee.insertMany(facultyToInsert);
    console.log(`✅ Successfully seeded ${createdFaculty.length} Employees/Faculty members.`);

    console.log('\n🎉 ALL OFFICIAL DATA SEEDED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
};

seedOfficialData();