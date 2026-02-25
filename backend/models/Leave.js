const mongoose = require("mongoose");
const NotificationSchemaAddon = {
  notified: { type: Boolean, default: false },
};

const LeaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This links to your User collection
      required: true,
    },
    leaveType: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Pre-save hook to handle Auto-Approval based on Role
LeaveSchema.pre("save", async function () {
  try {
    const user = await mongoose.model("User").findById(this.employeeId);
    if (user && user.role === "Admin") {
      this.status = "Approved"; // Auto-approve for Kunal
    }
  } catch (err) {
    throw err;
  }
});

module.exports = mongoose.model("Leave", LeaveSchema);
