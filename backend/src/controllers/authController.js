import User from '../models/User.js'
import jwt from 'jsonwebtoken'

// Các hàm helper trong cùng file
const createToken = (userId, role) => {
  return jwt.sign({ _id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const validateProfileInput = (firstName, lastName) => {
  const errors = []
  if (!firstName) errors.push('First name is required')
  if (!lastName) errors.push('Last name is required')
  return errors
}

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body

    // Validate input
    const errors = validateProfileInput(firstName, lastName)
    if (!email) errors.push('Email is required')
    if (!password) errors.push('Password is required')
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0], errors })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' })
    }

    const user = new User({ email, password, firstName, lastName })
    await user.save()

    const token = createToken(user._id, user.role)
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: userResponse,
      token
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(400).json({
      success: false,
      message: 'Error creating user'
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Thêm validation cơ bản
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const token = createToken(user._id, user.role)
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(400).json({
      success: false,
      message: 'Error logging in'
    })
  }
}
