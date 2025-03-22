import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { faker } from '@faker-js/faker'
import User from '../models/User.js'
import Product from '../models/Product.js'
import ProductCategory from '../models/ProductCategory.js'
import Cart from '../models/Cart.js'
import CartItem from '../models/CartItem.js'
import Order from '../models/Order.js'

dotenv.config()

const populateDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    // Create unique categories
    const categoryNames = new Set()
    while (categoryNames.size < 5) {
      categoryNames.add(faker.commerce.department())
    }

    const categories = []
    for (let name of categoryNames) {
      categories.push(
        new ProductCategory({
          name,
          description: faker.lorem.sentence(),
          isActive: true
        })
      )
    }
    await ProductCategory.insertMany(categories)

    // Create users
    const users = []
    for (let i = 0; i < 10; i++) {
      const email = faker.internet.email()
      users.push(
        new User({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: email,
          password: email, // Password is the same as email
          address: faker.location.streetAddress(),
          role: 'user'
        })
      )
    }
    await User.insertMany(users)

    // Create products
    const products = []
    for (let i = 0; i < 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      products.push(
        new Product({
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price()),
          category: category._id,
          stock: faker.number.int({ min: 1, max: 100 }),
          images: [],
          isActive: true
        })
      )
    }
    await Product.insertMany(products)

    // Create carts and cart items
    for (let user of users) {
      const cart = new Cart({ user: user._id, items: [] })
      await cart.save()

      const cartItems = []
      for (let i = 0; i < 5; i++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = faker.number.int({ min: 1, max: 5 })
        const cartItem = new CartItem({
          cartId: cart._id,
          productId: product._id,
          quantity
        })
        await cartItem.save()
        cartItems.push(cartItem._id)
      }
      cart.items = cartItems
      await cart.save()
    }

    // Create orders
    for (let user of users) {
      const orderItems = []
      let totalAmount = 0
      for (let i = 0; i < 3; i++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = faker.number.int({ min: 1, max: 5 })
        const price = product.price * quantity
        totalAmount += price
        orderItems.push({
          product: product._id,
          quantity,
          price
        })
      }
      const order = new Order({
        user: user._id,
        items: orderItems,
        totalAmount,
        status: 'pending',
        shippingAddress: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          country: faker.location.country()
        }
      })
      await order.save()
    }

    console.log('Database populated with realistic mock data successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error populating database:', error)
    process.exit(1)
  }
}

populateDatabase()
