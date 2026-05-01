const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("--------------------------------------------------");
    console.error("MONGODB CONNECTION ERROR:");
    console.error("Failed to connect to MongoDB.");
    console.error("Please verify your MONGO_URI in backend/.env and ensure your IP is whitelisted.");
    console.error("Technical Error:", error.message);
    console.error("--------------------------------------------------");
  }
};
module.exports = connectDB;