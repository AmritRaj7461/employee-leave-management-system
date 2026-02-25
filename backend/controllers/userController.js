exports.getPendingNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find Approved/Rejected items where notified is still false
    const leaves = await Leave.find({
      employeeId: userId,
      status: { $ne: "Pending" },
      notified: false,
    });
    const claims = await Reimbursement.find({
      employeeId: userId,
      status: { $ne: "Pending" },
      notified: false,
    });

    res.json({
      updates: [
        ...leaves.map((l) => ({ ...l._doc, type: "Leave" })),
        ...claims.map((c) => ({ ...c._doc, type: "Expense" })),
      ],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsNotified = async (req, res) => {
  const { ids, type } = req.body;
  const Model = type === "Leave" ? Leave : Reimbursement;
  await Model.updateMany({ _id: { $in: ids } }, { notified: true });
  res.json({ message: "Marked as seen" });
};
