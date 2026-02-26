const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: { type: String, required: true }, // e.g., "Approved Reimbursement"
  targetId: { type: String }, // ID of the claim or user affected
  details: { type: String }, // e.g., "Amount: ₹4,000"
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
