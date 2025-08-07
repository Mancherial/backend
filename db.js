import { MongoClient } from "mongodb";

let _db;

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.mongoDBURL);
    await client.connect();
    _db = client.db("mancherial"); // Correct DB name
    console.log("✅ MongoDB connected");
    return _db;
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  }
};

export const getDB = () => _db;
export default connectDB;
