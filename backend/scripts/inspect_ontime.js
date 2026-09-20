import { connectToONtime } from '../src/integrations/ontime/ontime.database.js';

async function runQueries() {
  try {
    const pool = await connectToONtime();
    
    console.log("--- Query 1: Counts & Max IDs ---");
    const result1 = await pool.request().query(`
      SELECT
          COUNT(*) AS total_rows,
          COUNT(DISTINCT tran_id) AS distinct_tran_ids,
          COUNT(DISTINCT sno_id) AS distinct_sno_ids,
          MAX(tran_id) AS max_tran_id,
          MAX(sno_id) AS max_sno_id
      FROM Tran_DeviceAttRec;
    `);
    console.table(result1.recordset);

    console.log("\n--- Query 2: Top 20 Records ---");
    const result2 = await pool.request().query(`
      SELECT TOP 20
          tran_id,
          sno_id,
          Emp_id,
          Card_Number,
          Punch_RawDate,
          Att_PunchRecDate,
          Dev_Id,
          dev_sno,
          Dev_Verify,
          Dev_Direction,
          att_status
      FROM Tran_DeviceAttRec
      ORDER BY sno_id DESC;
    `);
    console.table(result2.recordset);
    
    process.exit(0);
  } catch (err) {
    console.error("Error executing queries:", err);
    process.exit(1);
  }
}

runQueries();
