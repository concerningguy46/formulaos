/**
 * Validates email format using regex.
 */
const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

/**
 * Validates password strength — at least 6 characters.
 */
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Sanitizes a string by trimming whitespace and removing HTML tags.
 */
const sanitizeString = (str) => {
  if (!str) return '';
  return str.trim().replace(/<[^>]*>/g, '');
};

/**
 * Basic spam check for marketplace uploads.
 * Returns true if content passes, false if it looks like spam.
 */
const passesSpamCheck = (name, description) => {
  // Too short
  if (!name || name.length < 3) return false;

  // Excessive caps
  const capsRatio = (name.match(/[A-Z]/g) || []).length / name.length;
  if (capsRatio > 0.7 && name.length > 5) return false;

  // Repeated characters
  if (/(.)\1{4,}/.test(name)) return false;

  // Suspicious patterns
  const spamPatterns = /\b(buy now|click here|free money|guaranteed|act now)\b/i;
  if (spamPatterns.test(name) || spamPatterns.test(description)) return false;

  return true;
};

module.exports = { isValidEmail, isValidPassword, sanitizeString, passesSpamCheck };
