const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { findUserById, sanitizeUser } = require('../services/authStore')

const JWT_SECRET = process.env.JWT_SECRET || 'formulaos-fallback-jwt-secret'

const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = User.db.readyState === 1
      ? await User.findById(decoded.id).select('-password')
      : sanitizeUser(await findUserById(decoded.id))

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' })
    }

    next()
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return next()
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = User.db.readyState === 1
      ? await User.findById(decoded.id).select('-password')
      : sanitizeUser(await findUserById(decoded.id))
    return next()
  } catch {
    return next()
  }
}

module.exports = { protect, optionalAuth }
