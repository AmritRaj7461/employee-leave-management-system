const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  applyReimbursement,
  getUserClaims,
  getAllClaims,
  updateReimbursementStatus,
} = require("../controllers/reimbursementController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

router.post("/apply", verifyToken, upload.single("proof"), applyReimbursement);

router.get("/user/:userId", verifyToken, getUserClaims);

router.get(
  "/all",
  verifyToken,
  authorizeRoles("Manager", "Admin", "Employee"),
  getAllClaims,
);

router.put(
  "/status/:id",
  verifyToken,
  authorizeRoles("Manager", "Admin"),
  updateReimbursementStatus,
);

module.exports = router;
