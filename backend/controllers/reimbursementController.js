const Reimbursement = require("../models/Reimbursement");
const AuditLog = require("../models/AuditLog");

// Employee/Manager/Admin: Submit a new reimbursement claim
exports.applyReimbursement = async (req, res) => {
  try {
    const { title, amount } = req.body;

    const newClaim = new Reimbursement({
      employeeId: req.user.id,
      title,
      amount,
      // Multer stores the file info in req.file
      proof: req.file ? req.file.path : null,
      status: "Pending",
    });

    const savedClaim = await newClaim.save();

    // 🛡️ SECURITY LOG: Record submission
    await AuditLog.create({
      adminId: req.user.id,
      action: "REIMBURSEMENT_SUBMITTED",
      targetId: savedClaim._id,
      details: `Title: ${title} | Amount: ₹${amount}`,
    });

    res.status(201).json(savedClaim);
  } catch (err) {
    console.error("Submission Error:", err);
    res.status(500).json({ message: "Error saving claim" });
  }
};

// Get specific user claim history
exports.getUserClaims = async (req, res) => {
  try {
    const claims = await Reimbursement.find({ employeeId: req.params.userId })
      .populate("employeeId", "name role")
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manager/Admin: Get ALL claims for the Approvals Center
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Reimbursement.find()
      .populate("employeeId", "name role department")
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manager/Admin: Update claim status (Approve/Reject)
exports.updateReimbursementStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expecting 'Approved' or 'Rejected'

    const claim = await Reimbursement.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("employeeId", "name");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // 🛡️ SECURITY LOG: Record the Decision
    await AuditLog.create({
      adminId: req.user.id,
      action: `REIMBURSEMENT_${status.toUpperCase()}`,
      targetId: claim._id,
      details: `Action by ${req.user.role} on claim for ${claim.employeeId?.name || "Unknown"}`,
    });

    res.json({ message: `Claim ${status} successfully`, claim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
