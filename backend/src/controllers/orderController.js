import Order from '../models/Order.js'
import Cart from '../models/Cart.js'

export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    const { shippingAddress } = req.body
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' })
      return
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
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
    cart.items = []
    await cart.save()

    res.status(201).json(order)
  } catch (error) {
    res.status(400).json({ message: 'Error creating order' })
  }
}

export const getOrders = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    const orders = await Order.find().populate('user', '-password').populate('items.product').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
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
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

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
