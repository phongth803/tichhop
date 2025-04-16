import User from '../models/User.js'

// Lấy danh sách tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, isActive, page = 1, limit = 10 } = req.query
    let query = {}

    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          // Tìm theo full name
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ['$firstName', ' ', '$lastName'] },
                regex: search,
                options: 'i'
              }
            }
          }
        ]
      }
    }

    if (role) {
      query.role = role
    }

    if (isActive !== undefined && isActive !== '') {
      query.isActive = isActive === 'true'
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Get total count for pagination
    const total = await User.countDocuments(query)

    // Get paginated users
    const users = await User.find(query).skip(skip).limit(parseInt(limit))

    res.json({
      users,
      totalItems: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Tạo người dùng mới
export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, address, role, isActive } = req.body
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    address,
    role,
    isActive: isActive !== undefined ? isActive : true
  })

  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Cập nhật người dùng
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName, email, password, address, phone, role, isActive } = req.body

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (email) user.email = email
    if (password) user.password = password
    if (address !== undefined) user.address = address
    if (phone !== undefined) user.phone = phone
    if (role) user.role = role
    if (isActive !== undefined) user.isActive = isActive

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

    await user.deleteOne()
    res.json({ message: 'Deleted User' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
