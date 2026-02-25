const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
} = require("../controllers/authController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);

// FIXED: Added /me route for AuthContext verification
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

router.get("/users", verifyToken, authorizeRoles("Admin"), getAllUsers);

module.exports = router;
