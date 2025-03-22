import User from '../models/User.js'
import jwt from 'jsonwebtoken'

// Các hàm helper trong cùng file
const createToken = userId => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
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

    const token = createToken(user._id)
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

    const token = createToken(user._id)
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

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, address, currentPassword, newPassword } = req.body
    const userId = req.user._id

    // Validate input cơ bản trước
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    let isPasswordChanged = false
    // Xử lý password riêng biệt
    if (currentPassword || newPassword) {
      // Kiểm tra đủ cả 2 trường
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Both current password and new password are required'
        })
      }

      // Kiểm tra password hiện tại
      const isMatch = await user.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        })
      }

      // Validate password mới
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        })
      }

      // Cập nhật password
      user.password = newPassword
      isPasswordChanged = true
    }

    // Cập nhật thông tin cá nhân
    user.firstName = firstName
    user.lastName = lastName
    user.address = address || user.address

    // Lưu thay đổi
    await user.save()

    // Response
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      role: user.role
    }

    res.json({
      success: true,
      message: isPasswordChanged ? 'Profile and password updated successfully' : 'Profile updated successfully',
      user: userResponse,
      isPasswordChanged // Thêm flag này để frontend biết password đã được thay đổi
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating profile'
    })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(400).json({
      success: false,
      message: 'Error fetching profile'
    })
  }
}
