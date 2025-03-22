import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { specs } from './config/swagger.js'

import authRoutes from './routes/auth.js'
import productRoutes from './routes/product.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/order.js'
import categoryRoutes from './routes/category.js'
import contactRoutes from './routes/contactRoutes.js'
import userRoutes from './routes/user.js'
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin/users', userRoutes)
// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
