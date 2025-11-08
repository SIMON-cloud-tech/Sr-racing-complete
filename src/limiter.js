const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000, // minutes to ms
  max: parseInt(process.env.RATE_LIMIT_MAX),
  message: 'Too many requests. Please try again later.'
});

module.exports = { contactLimiter };
