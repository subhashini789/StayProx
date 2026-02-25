const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/stayprox_db");
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
