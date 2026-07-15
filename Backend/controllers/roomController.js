const Room = require("../models/Room");

const getRooms = async (_req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 }).populate("owner", "name email");
    res.json(rooms);
  } catch (_error) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};

const createRoom = async (req, res) => {
  try {
    const { title, location, price, description, contact } = req.body;
    if (!title || !location || price === undefined || price === null) {
      return res.status(400).json({ message: "Title, location and price are required" });
    }

    const room = await Room.create({
      title: title.trim(),
      location: location.trim(),
      price: Number(price),
      description: description || "",
      contact: contact || "",
      owner: req.user._id,
    });

    res.status(201).json(room);
  } catch (_error) {
    res.status(500).json({ message: "Failed to create room" });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ _id: req.params.id, owner: req.user._id });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const { title, location, price, description, contact } = req.body;
    if (!title || !location || price === undefined || price === null) {
      return res.status(400).json({ message: 'Title, location and price are required' });
    }

    room.title = title.trim();
    room.location = location.trim();
    room.price = Number(price);
    room.description = description || '';
    room.contact = contact || '';

    await room.save();
    res.json(room);
  } catch (_error) {
    res.status(500).json({ message: 'Failed to update room' });
  }
};

const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (_error) {
    res.status(500).json({ message: "Failed to fetch owner rooms" });
  }
};

module.exports = {
  getRooms,
  createRoom,
  getMyRooms,
  updateRoom,
};
