const Leave = require("../models/Leave");
const Reimbursement = require("../models/Reimbursement");

exports.getPendingNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find leaves that are Approved/Rejected but NOT yet notified
    const leaves = await Leave.find({
      employeeId: userId,
      status: { $ne: "Pending" },
      notified: false,
    });

    // Find reimbursements that are Approved/Rejected but NOT yet notified
    const reimbursements = await Reimbursement.find({
      employeeId: userId,
      status: { $ne: "Pending" },
      notified: false,
    });

    // Combine them into a single list for the frontend toast
    const updates = [
      ...leaves.map((l) => ({ ...l._doc, category: "Leave" })),
      ...reimbursements.map((r) => ({ ...r._doc, category: "Expense" })),
    ];

    res.json({ updates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    const { id, category } = req.body;
    const Model = category === "Leave" ? Leave : Reimbursement;

    await Model.findByIdAndUpdate(id, { notified: true });
    res.json({ message: "Notification marked as seen" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
