const Leave = require("../models/Leave");
const Config = require("../models/Config");

// Apply for leave (With Manager Auto-Approve Check)
exports.applyLeave = async (req, res) => {
  try {
    const user = req.user;
    const systemConfig = await Config.findOne();

    let initialStatus = "Pending";

    // AUTO-APPROVE LOGIC: Manager role + Admin toggle
    if (user.role === "Manager" && systemConfig?.autoApproveManagers) {
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

// Get history for the specific logged-in user
exports.getUserLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.userId })
      .populate("employeeId", "name role")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manager/Admin: Get ALL leaves for the portal
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employeeId", "name role department")
      .sort({ createdAt: -1 });

    // Safety Filter for deleted users
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
    res
      .status(500)
      .json({ message: "Internal Protocol Failure", error: err.message });
  }
};

// UPDATE STATUS: Includes Admin Re-approval and Admin Reasons
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminReason } = req.body;
    const userRole = req.user.role;
    const userId = req.user.id;

    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    // HIERARCHY LOGIC:
    // If a leave is already "Rejected", only an Admin can change it back to "Approved".
    if (
      leave.status === "Rejected" &&
      status === "Approved" &&
      userRole !== "Admin"
    ) {
      return res.status(403).json({
        message:
          "Hierarchy Restriction: Only an Admin can re-approve a rejected request.",
      });
    }

    leave.status = status;
    leave.adminReason = adminReason || ""; // Capture the reason
    leave.updatedBy = userId; // Log who did it

    await leave.save();
    res.json({ message: `Leave status updated to ${status}`, leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
