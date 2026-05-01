const passport = require('passport')

// Google OAuth is disabled for MVP, but the server still expects a callable
// setup function during startup.
const configurePassport = () => {
  return passport
}

module.exports = configurePassport
