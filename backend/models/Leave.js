const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to your User collection
      required: true,
    },
    leaveType: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true }, // The employee's reason
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminReason: { type: String, default: "" }, // NEW: Reason for Rejection/Approval
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // NEW: Who made the change
    notified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Pre-save hook to handle Auto-Approval based on Role (Specifically for Admins)
LeaveSchema.pre("save", async function () {
  try {
    const user = await mongoose.model("User").findById(this.employeeId);
    if (user && user.role === "Admin") {
      this.status = "Approved"; // Auto-approve if the applicant is an Admin
    }
  } catch (err) {
    throw err;
  }
});

module.exports = mongoose.model("Leave", LeaveSchema);
