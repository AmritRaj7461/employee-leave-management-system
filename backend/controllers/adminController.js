const Config = require("../models/Config");

// Retrieve Global Settings
exports.getGlobalConfig = async (req, res) => {
  try {
    let config = await Config.findOne();

    // If no config exists yet, create the default one
    if (!config) {
      config = await Config.create({});
    }

    res.status(200).json(config);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve infrastructure configuration." });
  }
};

// Update Global Settings
exports.updateGlobalConfig = async (req, res) => {
  try {
    const { strictRoleValidation, mfaEnabled, autoApproveManagers } = req.body;

    const config = await Config.findOneAndUpdate(
      {},
      {
        strictRoleValidation,
        mfaEnabled,
        autoApproveManagers,
        updatedBy: req.user.id,
        lastUpdated: Date.now(),
      },
      { new: true, upsert: true }, // Upsert creates it if it doesn't exist
    );

    res.status(200).json(config);
  } catch (err) {
    res.status(500).json({ message: "Security protocol update failed." });
  }
};
