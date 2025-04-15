import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { specs } from './config/swagger.js'

import authRoutes from './routes/auth.js'
import productRoutes from './routes/product.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/order.js'
import categoryRoutes from './routes/category.js'
import contactRoutes from './routes/contactRoutes.js'
import userRoutes from './routes/user.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
})

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
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/chat', chatRoutes)
// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// WebSocket connection handling
io.on('connection', socket => {
  console.log('A user connected:', socket.id)

  socket.on('join_conversation', conversationId => {
    socket.join(conversationId)
  })

  socket.on('leave_conversation', conversationId => {
    socket.leave(conversationId)
  })

  socket.on('new_message', data => {
    io.to(data.conversationId).emit('message_received', data)
  })

  socket.on('typing', data => {
    socket.to(data.conversationId).emit('user_typing', {
      userId: data.userId,
      isTyping: data.isTyping
    })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

const PORT = process.env.PORT || 3002

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
