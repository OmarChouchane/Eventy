import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object to include `mongoose`
declare global {
  var mongoose: MongooseCache;
}

// Ensure global.mongoose exists
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: 'evently',
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  global.mongoose = cached;

  return cached.conn;
};
