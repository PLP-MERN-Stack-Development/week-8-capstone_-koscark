const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wellBeingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WellBeing",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      enum: [
        "Very Bad",
        "Bad",
        "Slightly Bad",
        "Okay",
        "Slightly Good",
        "Good",
        "Very Good",
      ],
    },
    note: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    indexes: [
      { key: { userId: 1, wellBeingId: 1, date: 1 }, unique: true }, // Ensure one log per well-being per user per day
    ],
  }
);

logSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Log", logSchema);
