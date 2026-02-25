const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getUserLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

// Apply for leave
router.post("/apply", verifyToken, applyLeave);

// Get specific user history
router.get("/user/:userId", verifyToken, getUserLeaves);

// FIXED: Hierarchy-aware approval route
router.get(
  "/all",
  verifyToken,
  authorizeRoles("Manager", "Admin"),
  getAllLeaves,
);

// Update status
router.put(
  "/status/:id",
  verifyToken,
  authorizeRoles("Manager", "Admin"),
  updateLeaveStatus,
);

module.exports = router;
