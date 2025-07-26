const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  console.log('Request body:', req.body);
  const errors = validationResult(req);
  console.log('Validation errors:', errors.array());
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value,
        })),
      },
    });
  }
  next();
};

module.exports = validate;