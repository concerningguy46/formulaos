const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT token for the given user ID.
 * Token expires in 30 days.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
