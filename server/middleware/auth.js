const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/User')
const { findUserById, sanitizeUser, getEffectiveJwtSecret } = require('../services/authStore')

const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const effectiveSecret = getEffectiveJwtSecret()
    const decoded = jwt.verify(token, effectiveSecret)
    
    let user
    try {
      if (mongoose.connection.readyState === 1) {
        user = await User.findById(decoded.id).select('-password')
      } else {
        user = sanitizeUser(await findUserById(decoded.id))
      }
    } catch (dbError) {
      // Fallback to authStore on database error
      user = sanitizeUser(await findUserById(decoded.id))
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = user
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

    const effectiveSecret = getEffectiveJwtSecret()
    const decoded = jwt.verify(token, effectiveSecret)
    
    let user
    try {
      if (mongoose.connection.readyState === 1) {
        user = await User.findById(decoded.id).select('-password')
      } else {
        user = sanitizeUser(await findUserById(decoded.id))
      }
    } catch (dbError) {
      // Fallback to authStore on database error
      user = sanitizeUser(await findUserById(decoded.id))
    }
    
    if (user) {
      req.user = user
    }
    return next()
  } catch {
    return next()
  }
}

module.exports = { protect, optionalAuth }
