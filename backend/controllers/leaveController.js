// --- Inside controllers/leaveController.js ---
const Config = require("../models/Config");

exports.applyLeave = async (req, res) => {
  try {
    const user = req.user;
    const systemConfig = await Config.findOne();

    let initialStatus = "Pending";

    // AUTO-APPROVE LOGIC
    // If user is a Manager AND the Admin has enabled the auto-approve switch
    if (user.role === "Manager" && systemConfig.autoApproveManagers) {
      initialStatus = "Approved";
    }

    const newLeave = new Leave({
      ...req.body,
      employeeId: user.id,
      status: initialStatus,
    });

    await newLeave.save();
    res.status(201).json(newLeave);
  } catch (err) {
    res
      .status(500)
      .json({ message: "System failure during leave submission." });
  }
};

// Get leaves for a specific user (History Table)
exports.getUserLeaves = async (req, res) => {
  try {
    // UPDATED: Added populate here so the user can see their own name/role in their history list
    const leaves = await Leave.find({ employeeId: req.params.userId })
      .populate("employeeId", "name role")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manager/Admin: Get ALL leaves for approval portal
const Leave = require("../models/Leave");

exports.getAllLeaves = async (req, res) => {
  try {
    // 1. Fetch all leaves and attempt to fill in user details
    const leaves = await Leave.find()
      .populate("employeeId", "name role department") // Critical for Frontend names
      .sort({ createdAt: -1 });

    // 2. Safety Filter: Remove any null entries if population failed
    const cleanData = leaves.map((leave) => {
      if (!leave.employeeId) {
        return {
          ...leave._doc,
          employeeId: { name: "System User", role: "Unknown" },
        };
      }
      return leave;
    });

    res.status(200).json(cleanData);
  } catch (err) {
    console.error("CRITICAL BACKEND ERROR:", err.message);
    res
      .status(500)
      .json({ message: "Internal Protocol Failure", error: err.message });
  }
};

// Manager/Admin: Update status (Approve/Reject)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json({ message: `Leave ${status}`, leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
