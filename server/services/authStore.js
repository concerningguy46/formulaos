const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const DATA_DIR = path.join(__dirname, '..', 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

const ensureStore = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(USERS_FILE)
  } catch {
    await fs.writeFile(USERS_FILE, '[]', 'utf8')
  }
}

const readUsers = async () => {
  await ensureStore()
  const raw = await fs.readFile(USERS_FILE, 'utf8')
  const users = JSON.parse(raw || '[]')
  return Array.isArray(users) ? users : []
}

const writeUsers = async (users) => {
  await ensureStore()
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

const sanitizeUser = (user) => {
  if (!user) return null
  const { passwordHash, ...safe } = user
  return safe
}

const createUser = async ({ username, password }) => {
  const users = await readUsers()
  const normalizedUsername = username.trim()
  const duplicate = users.find((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase())

  if (duplicate) {
    const error = new Error('Username already taken')
    error.statusCode = 400
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const now = new Date().toISOString()
  const user = {
    _id: crypto.randomUUID(),
    username: normalizedUsername,
    passwordHash,
    aiUsageThisMonth: 0,
    stripeAccountId: null,
    createdAt: now,
    updatedAt: now,
  }

  users.push(user)
  await writeUsers(users)
  return sanitizeUser(user)
}

const findUserByUsername = async (username) => {
  const users = await readUsers()
  const normalizedUsername = username.trim().toLowerCase()
  return users.find((user) => user.username.toLowerCase() === normalizedUsername) || null
}

const findUserById = async (id) => {
  const users = await readUsers()
  return users.find((user) => user._id === id) || null
}

const verifyPassword = async (user, enteredPassword) => {
  if (!user?.passwordHash) return false
  return bcrypt.compare(enteredPassword, user.passwordHash)
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  sanitizeUser,
  verifyPassword,
}
