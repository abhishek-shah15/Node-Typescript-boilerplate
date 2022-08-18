import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config()

const dbURL = process.env.DATABASE_URL || "mongodb://localhost:27017/db";
const dbName = process.env.DB_NAME || "db";

export function reconnectDb() {
  console.log(`Connecting to mongodb`);
  mongoose.connect(dbURL, { dbName });
}
reconnectDb();
