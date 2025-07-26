const express = require("express");
const { body } = require("express-validator");
const WellBeing = require("../models/WellBeing");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

// GET /api/wellbeings
router.get("/", auth, async (req, res, next) => {
  try {
    const wellBeings = await WellBeing.find({ userId: req.user.userId });
    res.json(wellBeings);
  } catch (err) {
    next(err);
  }
});

// POST /api/wellbeings
router.post(
  "/",
  auth,
  [
    body("name").trim().notEmpty().withMessage("Well-being name is required"),
    validate,
  ],
  async (req, res, next) => {
    const { name } = req.body;

    try {
      const wellBeing = new WellBeing({
        userId: req.user.userId,
        name,
        accentColor: "#915941",
        isRemovable: true,
      });
      await wellBeing.save();
      res.status(201).json(wellBeing);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/wellbeings/:id
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const wellBeing = await WellBeing.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!wellBeing) {
      const error = new Error("Well-being not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!wellBeing.isRemovable) {
      const error = new Error("This well-being cannot be removed");
      error.statusCode = 400;
      return next(error);
    }

    await WellBeing.deleteOne({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: "Well-being removed successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
