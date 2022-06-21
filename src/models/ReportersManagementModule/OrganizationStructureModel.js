const mongoose = require("mongoose");

const organizationStructureSchema = new mongoose.Schema(
  {
    jobRole: {
      type: Array,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "organizationStructure",
  organizationStructureSchema
);

