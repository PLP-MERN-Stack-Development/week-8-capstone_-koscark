const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const WellBeing = require("../models/WellBeing");
const Log = require("../models/Log");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/users/signup
router.post(
  "/signup",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: errors.array().map(err => ({ field: err.path, message: err.msg })),
        },
      });
    }
    const { fullName, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: { message: "Email already exists" } });
      }

      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({ fullName, email, password: hashedPassword });
      await user.save();

      const defaultWellBeings = [
        { name: "General", accentColor: "#3F48CC", isRemovable: false },
        { name: "Mental", accentColor: "#764986", isRemovable: true },
        { name: "Physical", accentColor: "#0F7D97", isRemovable: true },
        { name: "Social", accentColor: "#E55118", isRemovable: true },
        { name: "Financial", accentColor: "#379587", isRemovable: true },
      ];

      try {
        await WellBeing.insertMany(
          defaultWellBeings.map((wellBeing) => ({
            ...wellBeing,
            userId: user._id,
          }))
        );
      } catch (err) {
        await User.deleteOne({ _id: user._id });
        return res.status(500).json({ error: { message: "Failed to create default well-beings" } });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(201).json({ user: { _id: user._id, fullName, email }, token });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/users/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: errors.array().map(err => ({ field: err.path, message: err.msg })),
        },
      });
    }
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: { message: "Invalid credentials" } });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: { message: "Invalid credentials" } });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({
        user: { _id: user._id, fullName: user.fullName, email },
        token,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/users/forgot-password
router.post(
  "/forgot-password",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage("Passwords must match"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log('Validation errors in route:', errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: errors.array().map(err => ({ field: err.path, message: err.msg })),
        },
      });
    }
    const { email, newPassword } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: { message: "User not found" } });
      }

      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
      user.password = await bcrypt.hash(newPassword, saltRounds);
      user.updatedAt = Date.now();
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/users/profile
router.get("/profile", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/profile
router.put(
  "/profile",
  auth,
  [
    body("fullName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Full name cannot be empty"),
    body("newPassword")
      .optional()
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
    body("confirmPassword")
      .optional()
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage("Passwords must match"),
    body("oldPassword")
      .if(body("newPassword").exists())
      .notEmpty()
      .withMessage("Old password is required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: errors.array().map(err => ({ field: err.path, message: err.msg })),
        },
      });
    }
    const { fullName, oldPassword, newPassword } = req.body;

    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: { message: "User not found" } });
      }

      if (newPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: { message: "Invalid old password" } });
        }
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
        user.password = await bcrypt.hash(newPassword, saltRounds);
      }

      if (fullName) {
        user.fullName = fullName;
      }

      user.updatedAt = Date.now();
      await user.save();

      res.json({ _id: user._id, fullName: user.fullName, email: user.email });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/wellbeings
router.post(
  "/wellbeings",
  auth,
  [
    body("name").trim().notEmpty().withMessage("Well-being name is required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: errors.array().map(err => ({ field: err.path, message: err.msg })),
        },
      });
    }
    const { name } = req.body;

    try {
      const existingWellBeing = await WellBeing.findOne({
        userId: req.user.userId,
        name: { $regex: `^${name.trim()}$`, $options: 'i' },
      });
      if (existingWellBeing) {
        return res.status(400).json({ error: { message: "Well-being name already exists" } });
      }

      // Generate random accent color
      const accentColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      const wellBeing = new WellBeing({
        name, // Save original name with spaces
        userId: req.user.userId,
        accentColor,
        isRemovable: true,
      });
      await wellBeing.save();
      res.status(201).json(wellBeing);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/wellbeings
router.get("/wellbeings", auth, async (req, res, next) => {
  try {
    const wellBeings = await WellBeing.find({ userId: req.user.userId });
    res.json(wellBeings);
  } catch (err) {
    next(err);
  }
});

// POST /api/logs
router.post(
  "/logs",
  auth,
  [
    body("wellbeingId").notEmpty().withMessage("Well-being ID is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: errors.array().map(err => ({ field: err.path, message: err.msg })),
        },
      });
    }
    const { wellbeingId, state, note, date } = req.body;

    try {
      const wellBeing = await WellBeing.findOne({
        _id: wellbeingId,
        userId: req.user.userId,
      });
      if (!wellBeing) {
        return res.status(404).json({ error: { message: "Well-being not found" } });
      }

      const log = new Log({
        wellbeingId,
        userId: req.user.userId,
        state,
        note: note || '',
        date: new Date(date),
      });
      await log.save();
      res.status(201).json(log);
    } catch (err) {
      console.error('POST /api/logs error:', err);
      next(err);
    }
  }
);

module.exports = router;