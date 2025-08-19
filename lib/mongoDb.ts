import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_DB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI');
}

interface MongooseCache {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let globalWithMongoose = global as typeof global & {
  mongoose?: MongooseCache;
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { connection: null, promise: null };
}

const cached = globalWithMongoose.mongoose;

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.connection) return cached.connection;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.connection = await cached.promise;
  return cached.connection;
}
