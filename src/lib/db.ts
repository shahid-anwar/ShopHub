import { MongoClient } from "mongodb";
import mongoose from "mongoose";
const uri = process.env.MONGODB_URI;
console.log("ENV CHECK:", process.env.MONGODB_URI);

if (!uri) {
  console.log("uri", uri);
  throw new Error("Please add your Mongo URI to .env.local");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

const clientPromise: Promise<MongoClient> = global._mongoClientPromise;

export default clientPromise;

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.log("URI:", process.env.MONGODB_URI);
  throw new Error("Mongo URI missing");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
