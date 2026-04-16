// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();

// --- Define Room Schema & Model ---
const roomSchema = new mongoose.Schema({
  title: String,
});

const Room = mongoose.model("Room", roomSchema);

// --- Routes ---

// Test route
app.get("/", (req, res) => {
  res.send("StayProx API Running");
});

// Get all rooms
app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find(); // fetch all rooms
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new room (optional)
app.post("/rooms", async (req, res) => {
  try {
    const { title } = req.body;
    const newRoom = new Room({ title });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
