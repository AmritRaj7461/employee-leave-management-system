const Reimbursement = require("../models/Reimbursement");

// Employee/Manager/Admin: Submit a new reimbursement claim
exports.applyReimbursement = async (req, res) => {
  try {
    const { title, amount } = req.body;
    const newClaim = new Reimbursement({
      employeeId: req.user.id,
      title,
      amount,
    });

    // The status will be auto-set to 'Approved' for Admins
    // by the pre-save hook in your Reimbursement model.
    const savedClaim = await newClaim.save();
    res.status(201).json(savedClaim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get specific user claim history (Populated for UI display)
exports.getUserClaims = async (req, res) => {
  try {
    const claims = await Reimbursement.find({ employeeId: req.params.userId })
      .populate("employeeId", "name role") // Ensures name/designation are visible
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manager/Admin: Get ALL claims for the Approvals Center
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Reimbursement.find().populate(
      "employeeId",
      "name role department",
    ); // Required for hierarchical filtering
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
    );

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.json({ message: `Claim ${status} successfully`, claim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
