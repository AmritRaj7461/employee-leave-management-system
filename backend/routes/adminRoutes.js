const express = require("express");
const router = express.Router();
const Config = require("../models/Config");
const AuditLog = require("../models/AuditLog");

// Use the functions exactly as they are named in your authMiddleware.js
const {
  verifyToken,
  isAdmin,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// GET current config
router.get("/config", verifyToken, async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = await Config.create({});
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE config (Admin Only)
router.put("/config", verifyToken, isAdmin, async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = new Config();
    Object.assign(config, req.body);
    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Update Failed" });
  }
});

// GET Security Logs (Admin Only)
// Using isAdmin here to match your project's working patterns
router.get("/logs", verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("adminId", "name")
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve logs" });
  }
});

module.exports = router;
