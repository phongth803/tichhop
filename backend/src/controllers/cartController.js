import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import CartItem from '../models/CartItem.js'
import { transformProduct } from './productController.js'

// Helper function để transform cart data
const transformCartData = cart => {
  if (!cart) return null

  const items = cart.items
    .map(item => {
      if (!item || !item.productId) return null

      const transformedProduct = transformProduct(item.productId)
      if (!transformedProduct) return null

      return {
        ...item.toObject(),
        productId: transformedProduct,
        subtotal: transformedProduct.priceOnSale * item.quantity
      }
    })
    .filter(item => item !== null)

  const totalAmount = items.reduce((total, item) => total + item.subtotal, 0)

  return {
    _id: cart._id,
    user: cart.user,
    items,
    totalAmount
  }
}

export const getCart = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' })
    }

    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items',
      populate: { path: 'productId' }
    })

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
      await cart.save()
    }

    const transformedCart = transformCartData(cart)
    if (!transformedCart) {
      return res.status(500).json({ message: 'Error transforming cart data' })
    }

    res.json(transformedCart)
  } catch (error) {
    console.error('Error in getCart:', error)
    res.status(500).json({
      message: 'Error fetching cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
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

    let cartItem = await CartItem.findOne({ cartId: cart._id, productId })

    if (cartItem) {
      cartItem.quantity += quantity
    } else {
      cartItem = new CartItem({ cartId: cart._id, productId, quantity })
      cart.items.push(cartItem._id)
    }

    await cartItem.save()
    await cart.save()
    await cart.populate({
      path: 'items',
      populate: { path: 'productId' }
    })
    res.json(transformCartData(cart))
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

    const cartItem = await CartItem.findOne({ cartId: cart._id, productId })

    if (!cartItem) {
      res.status(404).json({ message: 'Item not found in cart' })
      return
    }

    cartItem.quantity = quantity
    await cartItem.save()
    await cart.populate({
      path: 'items',
      populate: { path: 'productId' }
    })

    // Transform cart data để bao gồm priceOnSale
    const transformedCart = transformCartData(cart)

    res.json(transformedCart)
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

    const cartItem = await CartItem.findOneAndDelete({ cartId: cart._id, productId })

    if (!cartItem) {
      res.status(404).json({ message: 'Item not found in cart' })
      return
    }

    cart.items = cart.items.filter(item => item.toString() !== cartItem._id.toString())
    await cart.save()
    await cart.populate({
      path: 'items',
      populate: { path: 'productId' }
    })
    res.json(transformCartData(cart))
  } catch (error) {
    res.status(400).json({ message: 'Error removing from cart' })
  }
}

export const getAllCarts = async (req, res) => {
  const carts = await Cart.find()
    .populate('user')
    .populate({
      path: 'items',
      populate: { path: 'productId' }
    })
  res.json(carts)
}
