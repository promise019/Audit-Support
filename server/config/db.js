/**
 * db.js — MongoDB Connection Manager with Mongoose
 * Faculty of Computing, University of Calabar (CFASS)
 */

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cfass_db';
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[CFASS Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[CFASS Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn(`[CFASS Database Warning] Ensure MONGODB_URI is provided in server/.env`);
    // Allow server to run or bubble up depending on environment
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
