import sql from 'mssql/msnodesqlv8.js';

const runTest = async (config) => {
  try {
    const pool = await sql.connect(config);
    console.log('Success with config:', config);
    await pool.close();
  } catch (err) {
    console.error('Error with config:', config);
    console.error(err.message);
  }
};

const main = async () => {
  await runTest({
    server: 'localhost',
    database: 'ONtime_Att',
    options: {
      instanceName: 'SQLEXPRESS',
      trustedConnection: true,
      trustServerCertificate: true,
      driver: 'SQL Server'
    }
  });

  await runTest({
    server: 'localhost',
    database: 'ONtime_Att',
    driver: 'SQL Server',
    options: {
      instanceName: 'SQLEXPRESS',
      trustedConnection: true,
      trustServerCertificate: true,
    }
  });

  await runTest({
    connectionString: 'Driver={SQL Server};Server=localhost\\SQLEXPRESS;Database=ONtime_Att;Trusted_Connection=yes;'
  });
};

main();
