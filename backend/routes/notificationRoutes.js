const express = require("express");
const router = express.Router();
const {
  getPendingNotifications,
  markAsSeen,
} = require("../controllers/notificationController");
const { verifyToken } = require("../middleware/auth");

router.get("/pending", verifyToken, getPendingNotifications);
router.post("/mark-seen", verifyToken, markAsSeen);

module.exports = router;
