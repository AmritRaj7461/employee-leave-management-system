const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware"); // Ensure this file exists
const {
  applyReimbursement,
  getUserClaims,
  getAllClaims,
  updateReimbursementStatus,
} = require("../controllers/reimbursementController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

// UPDATED: Added upload.single("proof") middleware
// "proof" must match the key you used in your frontend FormData
router.post("/apply", verifyToken, upload.single("proof"), applyReimbursement);

router.get("/user/:userId", verifyToken, getUserClaims);

// Manager/Admin protected routes
router.get(
  "/all",
  verifyToken,
  authorizeRoles("Manager", "Admin"),
  getAllClaims,
);

router.put(
  "/status/:id",
  verifyToken,
  authorizeRoles("Manager", "Admin"),
  updateReimbursementStatus,
);

module.exports = router;
