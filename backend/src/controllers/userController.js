import User from '../models/User.js'

// Lấy danh sách tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Tạo người dùng mới
export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, address, role } = req.body
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    address,
    role
  })

  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }

    const { firstName, lastName, email, address, role, password } = req.body
    if (firstName != null) user.firstName = firstName
    if (lastName != null) user.lastName = lastName
    if (email != null) user.email = email
    if (address != null) user.address = address
    if (role != null) user.role = role
    if (password != null) user.password = password

    const updatedUser = await user.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Xóa người dùng
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }

    await user.remove()
    res.json({ message: 'Deleted User' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
