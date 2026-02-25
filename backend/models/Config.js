const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema({
  autoApproveManagers: { type: Boolean, default: false },
  strictRoleValidation: { type: Boolean, default: true },
  mfaEnabled: { type: Boolean, default: false },
});

module.exports = mongoose.model("Config", ConfigSchema);
