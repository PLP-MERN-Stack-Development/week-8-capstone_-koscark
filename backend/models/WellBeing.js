const mongoose = require("mongoose");

const wellBeingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Well-being name is required"],
      trim: true,
    },
    accentColor: {
      type: String,
      required: true,
      match: [/^#[0-9A-Fa-f]{6}$/, "Invalid hex color code"],
    },
    isRemovable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    indexes: [
      { key: { userId: 1, name: 1 }, unique: true }, // Ensure unique well-being names per user
    ],
  }
);

module.exports = mongoose.model("WellBeing", wellBeingSchema);
