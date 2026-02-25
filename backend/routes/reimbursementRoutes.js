const express = require("express");
const router = express.Router();
const {
  applyReimbursement,
  getUserClaims,
  getAllClaims,
  updateReimbursementStatus, // Must be imported here
} = require("../controllers/reimbursementController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

router.post("/apply", verifyToken, applyReimbursement);
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
