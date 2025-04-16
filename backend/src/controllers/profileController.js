import User from '../models/User.js'

const updateUserInfo = async (user, { firstName, lastName, address, phone }) => {
  // Kiểm tra có dữ liệu gửi lên không
  if (firstName === undefined && lastName === undefined && address === undefined && phone === undefined) {
    return {
      message: 'No profile information to update',
      isInfoUpdated: false
    }
  }

  // Validate từng trường khi được gửi lên
  if (firstName !== undefined) {
    if (!firstName.trim()) {
      throw new Error('First name cannot be empty')
    }
    user.firstName = firstName.trim()
  }

  if (lastName !== undefined) {
    if (!lastName.trim()) {
      throw new Error('Last name cannot be empty')
    }
    user.lastName = lastName.trim()
  }

  if (address !== undefined) {
    // Cho phép address là empty string để xóa address
    user.address = address.trim()
  }

  if (phone !== undefined) {
    // Cho phép phone là empty string để xóa phone
    const trimmedPhone = phone.trim()
    if (trimmedPhone && !/^[0-9]{10,11}$/.test(trimmedPhone)) {
      throw new Error('Invalid phone number format')
    }
    user.phone = trimmedPhone
  }

  await user.save()
  return {
    message: 'Profile information updated successfully',
    isInfoUpdated: true
  }
}

const updateUserPassword = async (user, { currentPassword, newPassword }) => {
  // Kiểm tra có đủ thông tin không
  if (currentPassword === undefined && newPassword === undefined) {
    return {
      isPasswordChanged: false
    }
  }

  // Kiểm tra có đủ cả 2 trường
  if (!currentPassword || !newPassword) {
    throw new Error('Both current password and new password are required')
  }

  // Validate dữ liệu
  if (!currentPassword.trim() || !newPassword.trim()) {
    throw new Error('Passwords cannot be empty')
  }

  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) {
    throw new Error('Current password is incorrect')
  }

  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters')
  }

  if (currentPassword === newPassword) {
    throw new Error('New password must be different from current password')
  }

  user.password = newPassword
  await user.save()

  return {
    message: 'Password updated successfully',
    isPasswordChanged: true
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, address, phone, currentPassword, newPassword } = req.body
    const userId = req.user._id

    // Kiểm tra có dữ liệu gửi lên không
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided for update'
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    let result = {
      isInfoUpdated: false,
      isPasswordChanged: false,
      message: ''
    }

    try {
      // Xử lý cập nhật thông tin và mật khẩu riêng biệt
      const infoUpdate =
        firstName !== undefined || lastName !== undefined || address !== undefined || phone !== undefined
      const passwordUpdate = currentPassword !== undefined || newPassword !== undefined

      if (infoUpdate) {
        const infoResult = await updateUserInfo(user, { firstName, lastName, address, phone })
        result = { ...result, ...infoResult }
      }

      if (passwordUpdate) {
        const passwordResult = await updateUserPassword(user, { currentPassword, newPassword })
        result = { ...result, ...passwordResult }
      }

      // Kiểm tra và set message phù hợp
      if (!infoUpdate && !passwordUpdate) {
        return res.status(400).json({
          success: false,
          message: 'No valid data provided for update'
        })
      }

      if (result.isInfoUpdated && result.isPasswordChanged) {
        result.message = 'Profile information and password updated successfully'
      }

      const userResponse = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phone: user.phone,
        role: user.role
      }

      return res.json({
        success: true,
        message: result.message,
        user: userResponse,
        isInfoUpdated: result.isInfoUpdated,
        isPasswordChanged: result.isPasswordChanged
      })
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    })
  }
}
