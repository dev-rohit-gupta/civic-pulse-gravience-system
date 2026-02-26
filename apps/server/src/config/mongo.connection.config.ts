import type { ConnectOptions } from "mongoose";

export const options: ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  retryReads: true,
  compressors: ["zlib"],
  autoIndex: false,
};
