const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    const error = new Error("No token provided");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    req.user = decoded;
    next();
  } catch (err) {
    err.statusCode = 401;
    err.message = "Invalid token";
    next(err);
  }
};

module.exports = auth;
