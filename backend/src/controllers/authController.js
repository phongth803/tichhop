import User from '../models/User.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists' })
      return
    }

    const user = new User({
      email,
      password,
      fullName,
      phone
    })

    await user.save()

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.status(201).json({ user, token })
  } catch (error) {
    res.status(400).json({ message: 'Error creating user' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Thêm role vào token
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Không gửi password về client
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }

    res.json({ user: userWithoutPassword, token })
  } catch (error) {
    res.status(400).json({ message: 'Error logging in' })
  }
}
