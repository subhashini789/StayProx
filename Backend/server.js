const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");

const app = express();

app.use(cors());
app.use(express.json());
const path = require('path');
// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.get("/", (_req, res) => {
  res.send("StayProx API Running");
});

app.use("/api/auth", userRoutes);
app.use("/api/rooms", roomRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
