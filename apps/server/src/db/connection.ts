import mongoose from "mongoose";
import { options } from "../config/mongo.connection.config.js";

// Define the cache interface
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add mongoose to the NodeJS global type
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

export async function connectToDataBase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("⚠️ MONGODB_URI is not defined in .env");
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, options).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
