const express = require("express");
const { createRoom, getMyRooms, getRooms, updateRoom } = require("../controllers/roomController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const multer = require('multer');
const path = require('path');

// configure multer to save uploads to /uploads and expose them via /uploads route
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '..', 'uploads'));
	},
	filename: function (req, file, cb) {
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const ext = path.extname(file.originalname) || '.jpg';
		cb(null, `${unique}${ext}`);
	},
});

const upload = multer({ storage });

const router = express.Router();

router.get("/", getRooms);
router.get("/mine", protect, requireRole("owner"), getMyRooms);
router.post("/", protect, requireRole("owner"), createRoom);
// image upload endpoint (accepts multiple files under field name 'images')
router.post('/upload', protect, requireRole('owner'), upload.array('images', 6), (req, res) => {
	try {
		const urls = (req.files || []).map((f) => `/uploads/${f.filename}`);
		return res.json(urls);
	} catch (err) {
		return res.status(500).json({ message: 'Image upload failed' });
	}
});
router.put("/:id", protect, requireRole("owner"), updateRoom);

module.exports = router;
