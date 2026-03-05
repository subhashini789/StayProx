const express = require("express");
const router = express.Router();

router.get("/rooms", (req, res) => {
  res.send("All rooms");
});

module.exports = router;