const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Helmet for secure HTTP headers
const helmetMiddleware = helmet();

// Rate limiter for API requests
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});

// Combine security middlewares
const security = [helmetMiddleware, rateLimiter];

module.exports = security;
