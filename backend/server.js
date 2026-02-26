const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load Environment Variables
dotenv.config();

// Route Imports
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const reimbursementRoutes = require("./routes/reimbursementRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// --- CORS CONFIGURATION (FIXED) ---
const allowedOrigins = [
  "https://employee-leave-management-system-kohl.vercel.app",
  "https://employee-leave-management-system-pd6qxse4v.vercel.app",
  "http://localhost:5173", // Allow local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware
app.use(express.json());

// Static Folder for Uploads (Fixes the 404 Eye Icon issues)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reimbursement", reimbursementRoutes);
app.use("/api/notifications", notificationRoutes);

// Root Health Check (Good for Render/Railway deployment)
app.get("/", (req, res) => {
  res.send("🚀 System Core API is Operational");
});

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ MongoDB Connected: Cloud Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err.message);
  });
