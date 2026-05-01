const fs = require('fs/promises')
const fsSync = require('fs')
const path = require('path')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const lockfile = require('proper-lockfile')

const DATA_DIR = path.join(__dirname, '..', 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
let fileLock = null

const getEffectiveJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (secret) return secret
  
  if (process.env.NODE_ENV === 'development') {
    return 'formulaos-dev-jwt-secret'
  }
  
  throw new Error(
    'JWT_SECRET environment variable is required in production. '
    + 'Set JWT_SECRET before starting the application.'
  )
}

const ensureStore = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    // Use exclusive creation flag to avoid TOCTOU race
    // This will fail if file already exists (EEXIST)
    fsSync.writeFileSync(USERS_FILE, '[]', { flag: 'wx', encoding: 'utf8' })
  } catch (error) {
    // EEXIST means file already exists - this is success
    if (error.code !== 'EEXIST') {
      throw error
    }
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
  
  // Acquire lock for atomic read-modify-write
  try {
    fileLock = await lockfile.lock(USERS_FILE, { retries: 5 })
    try {
      // Re-read file inside lock to ensure latest state
      const raw = await fs.readFile(USERS_FILE, 'utf8')
      const currentUsers = JSON.parse(raw || '[]')
      
      // If the users array changed externally, merge properly or use provided version
      // For now, write the provided users array (caller should handle merging if needed)
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
    } finally {
      if (fileLock) {
        await lockfile.unlock(USERS_FILE)
        fileLock = null
      }
    }
  } catch (lockError) {
    throw new Error(`Failed to acquire file lock for writing users: ${lockError.message}`)
  }
}

const sanitizeUser = (user) => {
  if (!user) return null
  const { passwordHash, ...safe } = user
  return safe
}

const createUser = async ({ username, password }) => {
  // Input validation
  const normalizedUsername = (username || '').trim()
  
  if (!normalizedUsername) {
    const error = new Error('Username cannot be empty')
    error.statusCode = 400
    throw error
  }
  
  if (normalizedUsername.length < 3) {
    const error = new Error('Username must be at least 3 characters')
    error.statusCode = 400
    throw error
  }
  
  if (!password) {
    const error = new Error('Password is required')
    error.statusCode = 400
    throw error
  }
  
  if (password.length < 8) {
    const error = new Error('Password must be at least 8 characters')
    error.statusCode = 400
    throw error
  }
  
  // Check for duplicates after validation
  const users = await readUsers()
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
  getEffectiveJwtSecret,
}
