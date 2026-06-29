import mongoose from 'mongoose';
import logger from './logger.config.js';

/**
 * Connect to MongoDB Database
 *
 * Uses the MONGODB_URI environment variable. If not set, falls back to
 * the local development URI. Connection failures are logged as warnings —
 * the server continues running so the health endpoint remains accessible.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nit-admin';
    const conn = await mongoose.connect(mongoURI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.warn(`MongoDB connection failed: ${error.message}`);
    logger.warn('Server will continue running. Verify MONGODB_URI in your .env file.');
  }
};

export default connectDB;
