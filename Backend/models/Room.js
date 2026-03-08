const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  description: String,
  contact: String
});

module.exports = mongoose.model("Room", RoomSchema);