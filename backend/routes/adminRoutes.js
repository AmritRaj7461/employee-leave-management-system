const express = require("express");
const router = express.Router();
const Config = require("../models/Config");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

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

// CRITICAL: You must have this exact line at the bottom!
module.exports = router;
