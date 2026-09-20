import { connectToONtime } from './ontime.database.js';

const runTest = async () => {
  try {
    const pool = await connectToONtime();
    console.log('\nExecuting test query on Tran_DeviceAttRec...');
    
    // We only read from the table as per constraints (no INSERT/UPDATE/DELETE)
    const result = await pool.request().query(`
      SELECT TOP 10
          tran_id,
          sno_id,
          Emp_id,
          Card_Number,
          Punch_RawDate,
          Att_PunchRecDate,
          Att_PunchDownDate,
          Dev_Id,
          dev_sno,
          Dev_Verify,
          Dev_Direction,
          att_status
      FROM Tran_DeviceAttRec
      ORDER BY Punch_RawDate DESC;
    `);

    console.log('\n--- Query Results ---');
    console.table(result.recordset);
    console.log(`\nSuccessfully retrieved ${result.recordset.length} records from ONtime_Att.`);
    
    // Process exits naturally or via explicit exit if there are open handles
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

runTest();
