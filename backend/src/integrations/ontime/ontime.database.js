import sql from 'mssql/msnodesqlv8.js';
import dotenv from 'dotenv';

// Ensure .env is loaded if this file is tested standalone
dotenv.config();

const dbConfig = {
  server: process.env.ONTIME_DB_SERVER || 'localhost',
  database: process.env.ONTIME_DB_NAME || 'ONtime_Att',
  driver: 'SQL Server',
  options: {
    instanceName: process.env.ONTIME_DB_INSTANCE || 'SQLEXPRESS',
    trustedConnection: true, // Use Windows Authentication
    trustServerCertificate: true, // Needed for local dev with self-signed certs
  },
};

let pool = null;

/**
 * Creates and returns a single reused connection pool to the ONtime database.
 * Does not expose credentials to the frontend, operates purely on the backend.
 */
export const connectToONtime = async () => {
  try {
    if (pool) {
      return pool;
    }
    
    console.log(`Attempting to connect to ONtime database: ${dbConfig.server}\\${dbConfig.options.instanceName} - ${dbConfig.database}...`);
    pool = await sql.connect(dbConfig);
    console.log('Successfully connected to ONtime SQL Server database.');
    return pool;
  } catch (error) {
    console.error('Failed to connect to ONtime database:', error);
    throw error;
  }
};

/**
 * Retrieves the existing ONtime database connection pool.
 */
export const getONtimePool = () => {
  if (!pool) {
    throw new Error('ONtime database pool has not been initialized. Call connectToONtime first.');
  }
  return pool;
};

// Export the sql module directly so we can use its data types (e.g., sql.Int, sql.NVarChar) in queries
export { sql };
