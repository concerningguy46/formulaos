require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {
  createUser,
  findUserByUsername,
  findUserById,
  sanitizeUser,
  verifyPassword,
} = require('../services/authStore')

const JWT_SECRET = process.env.JWT_SECRET || 'formulaos-fallback-jwt-secret'

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' })
}

const toPlainUser = (user) => {
  if (!user) return null
  return typeof user.toObject === 'function' ? user.toObject() : user
}

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const useMongo = mongoose.connection.readyState === 1
    let user

    if (useMongo) {
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' })
      }

      user = await User.create({ username, password })
    } else {
      const existingUser = await findUserByUsername(username)
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' })
      }

      user = await createUser({ username, password })
    }

    const plainUser = toPlainUser(user)
    res.status(201).json({
      ...sanitizeUser(plainUser),
      token: generateToken(plainUser._id)
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const useMongo = mongoose.connection.readyState === 1
    const user = useMongo
      ? await User.findOne({ username })
      : await findUserByUsername(username)

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const isMatch = useMongo
      ? await user.matchPassword(password)
      : await verifyPassword(user, password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const plainUser = toPlainUser(user)
    res.json({
      ...sanitizeUser(plainUser),
      token: generateToken(plainUser._id)
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

exports.getMe = async (req, res) => {
  try {
    const useMongo = mongoose.connection.readyState === 1
    const user = useMongo
      ? await User.findById(req.user._id).select('-password')
      : await findUserById(req.user._id)

    res.json(sanitizeUser(toPlainUser(user)))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
