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
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.warn(`MongoDB connection failed: ${error.message}`);
    logger.warn('Server will continue running. Verify MONGODB_URI in your .env file.');
  }
};

export default connectDB;
