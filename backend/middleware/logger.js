const logger = (req, res, next) => {
  const start = Date.now();
  const { method, url } = req;

  // Log request details
  console.log(
    `[${new Date().toISOString()}] ${method} ${url} - Request received`
  );

  // Capture response details
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${method} ${url} - Response sent: ${
        res.statusCode
      } (${duration}ms)`
    );
  });

  next();
};

module.exports = logger;