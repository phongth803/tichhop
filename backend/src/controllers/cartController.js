import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
      await cart.save()
    }
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' })
  }
}

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' })
    }

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ product: productId, quantity })
    }

    await cart.save()
    await cart.populate('items.product')
    res.json(cart)
  } catch (error) {
    res.status(400).json({ message: 'Error adding to cart' })
  }
}

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' })
      return
    }

    const item = cart.items.find(item => item.product.toString() === productId)

    if (!item) {
      res.status(404).json({ message: 'Item not found in cart' })
      return
    }

    item.quantity = quantity
    await cart.save()
    await cart.populate('items.product')
    res.json(cart)
  } catch (error) {
    res.status(400).json({ message: 'Error updating cart item' })
  }
}

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' })
      return
    }

    const filteredItems = cart.items.filter(item => item.product.toString() !== productId)
    cart.items = filteredItems

    await cart.save()
    await cart.populate('items.product')
    res.json(cart)
  } catch (error) {
    res.status(400).json({ message: 'Error removing from cart' })
  }
}
