import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import CartItem from '../models/CartItem.js'

export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    const { shippingAddress } = req.body
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      res.status(400).json({ message: 'Cart not found' })
      return
    }

    const cartItems = await CartItem.find({ cartId: cart._id }).populate('productId')

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ message: 'Cart is empty' })
      return
    }

    const orderItems = cartItems.map(item => ({
      product: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price
    }))

    const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0)

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress
    })

    await order.save()

    // Clear cart after order creation
    await CartItem.deleteMany({ cartId: cart._id })

    res.status(201).json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(400).json({ message: 'Error creating order' })
  }
}

export const getOrders = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    const { search, status, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit
    let query = {}

    if (search) {
      // Use pipeline only for searching user names
      const orderIds = await Order.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userData'
          }
        },
        { $unwind: '$userData' },
        {
          $match: {
            $or: [
              { 'userData.firstName': { $regex: search, $options: 'i' } },
              { 'userData.lastName': { $regex: search, $options: 'i' } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $concat: ['$userData.firstName', ' ', '$userData.lastName'] },
                    regex: search,
                    options: 'i'
                  }
                }
              }
            ]
          }
        },
        { $project: { _id: 1 } }
      ])
      
      query._id = { $in: orderIds.map(order => order._id) }
    }

    if (status) {
      query.status = status
    }

    // Get total count for pagination
    const total = await Order.countDocuments(query)

    // Get paginated orders with populated data
    const orders = await Order.find(query)
      .populate('user', '-password')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    res.json({
      orders,
      totalItems: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ message: 'Error fetching orders' })
  }
}

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['processing', 'delivered', 'cancelled']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = status
    await order.save()
    res.json(order)
  } catch (error) {
    res.status(400).json({ message: 'Error updating order status' })
  }
}

export const cancelOrder = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'pending'
    })

    if (!order) {
      res.status(404).json({ message: 'Order not found or cannot be cancelled' })
      return
    }
    order.status = 'cancelled'
    await order.save()
    res.json(order)
  } catch (error) {
    res.status(400).json({ message: 'Error cancelling order' })
  }
}
