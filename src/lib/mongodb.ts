import mongoose from 'mongoose';

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI || process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use globalThis instead of global for better compatibility
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache;

// Check if we're in a server environment
if (typeof globalThis !== 'undefined') {
  cached = globalThis.mongoose || { conn: null, promise: null };
  if (!globalThis.mongoose) {
    globalThis.mongoose = cached;
  }
} else {
  cached = { conn: null, promise: null };
}

async function connectDB() {
  // Only allow connection on server side
  if (typeof window !== 'undefined') {
    // console.warn('MongoDB connection attempted on client side');
    return null;
  }

  // Check if MongoDB URI is configured
  if (!MONGODB_URI) {
    // console.warn('MongoDB URI not configured. Database features will be disabled.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    // console.error('MongoDB connection error:', e);
    return null;
  }

  return cached.conn;
}

export default connectDB;

