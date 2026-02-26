const mongoose = require("mongoose");
const NotificationSchemaAddon = {
  notified: { type: Boolean, default: false },
};

const ReimbursementSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    // ADD THIS LINE BELOW
    proof: { type: String, default: null },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    notified: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// FIXED: Removed 'next' to prevent TypeError in async hooks
ReimbursementSchema.pre("save", async function () {
  try {
    const User = mongoose.model("User");
    const user = await User.findById(this.employeeId);

    // Auto-approve if the applicant is Admin
    if (user && user.role === "Admin") {
      this.status = "Approved";
    }
  } catch (err) {
    console.error("Reimbursement Auto-Approve Error:", err);
    throw err;
  }
});

module.exports = mongoose.model("Reimbursement", ReimbursementSchema);
