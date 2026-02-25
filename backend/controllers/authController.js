const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    // 2. Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // 3. Hash password (Fixed: Passing 10 as a number)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and Save User
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "Employee",
      department,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login." });
  }
};

// Admin function to get all users [cite: 4, 41]
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude sensitive data [cite: 32]
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
