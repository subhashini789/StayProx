const express = require("express");
const { createRoom, getMyRooms, getRooms } = require("../controllers/roomController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getRooms);
router.get("/mine", protect, requireRole("owner"), getMyRooms);
router.post("/", protect, requireRole("owner"), createRoom);
router.put("/:id", protect, requireRole("owner"), updateRoom);

module.exports = router;
