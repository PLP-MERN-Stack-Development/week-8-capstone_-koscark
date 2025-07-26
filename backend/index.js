const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");
const userRoutes = require("./routes/users");
const wellBeingRoutes = require("./routes/wellBeings");
const logRoutes = require("./routes/logs");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const security = require("./middleware/security");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(logger); // Request logging
app.use(security); // Security headers and rate limiting
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");
    process.exit(1); // Exit process on failure
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/wellbeings", wellBeingRoutes);
app.use("/api/logs", logRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));