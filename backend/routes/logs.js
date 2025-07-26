const express = require("express");
const { body } = require("express-validator");
const Log = require("../models/Log");
const WellBeing = require("../models/WellBeing");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

// POST /api/logs
router.post(
  "/",
  auth,
  [
    body("wellbeingId").isMongoId().withMessage("Invalid well-being ID"),
    body("state")
      .isIn([
        "Very Bad",
        "Bad",
        "Slightly Bad",
        "Okay",
        "Slightly Good",
        "Good",
        "Very Good",
      ])
      .withMessage("Invalid state"),
    body("note").optional().trim(),
    validate,
  ],
  async (req, res, next) => {
    const { wellbeingId, state, note } = req.body;
    try {
      // Verify well-being belongs to user
      const wellBeing = await WellBeing.findOne({
        _id: wellbeingId,
        userId: req.user.userId,
      });
      if (!wellBeing) {
        const error = new Error("Well-being not found");
        error.statusCode = 404;
        return next(error);
      }
      const log = new Log({
        wellbeingId,
        state,
        note,
        userId: req.user.userId,
      });
      await log.save();
      res.status(201).json(log);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;