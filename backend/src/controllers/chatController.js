import ChatConversation from '../models/ChatConversation.js'
import ChatMessage from '../models/ChatMessage.js'
import User from '../models/User.js'
import sendEmail from '../utils/emailService.js'

export const createConversation = async (req, res) => {
  try {
    const existingConversation = await ChatConversation.findOne({
      userId: req.user._id
    }).populate('participants', 'firstName lastName email')

    if (existingConversation) {
      return res.status(200).json(existingConversation)
    }

    const conversation = new ChatConversation({
      userId: req.user._id,
      participants: [req.user._id]
    })

    await conversation.save()
    await conversation.populate('participants', 'firstName lastName email')

    res.status(201).json(conversation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getConversations = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const conversations = await ChatConversation.find()
        .populate('participants', 'firstName lastName email')
        .populate('userId', 'firstName lastName email')
        .populate('lastMessage')
        .sort({ updatedAt: -1 })
      return res.json(conversations)
    } else {
      const conversation = await ChatConversation.findOne({
        userId: req.user._id
      })
        .populate('participants', 'firstName lastName email')
        .populate('lastMessage')
      return res.json(conversation ? [conversation] : [])
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const conversation = await ChatConversation.findById(conversationId)

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }

    if (req.user.role !== 'admin' && conversation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this conversation' })
    }

    const messages = await ChatMessage.find({ conversation: conversationId })
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: 1 })

    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body
    const conversation = await ChatConversation.findById(conversationId)

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }

    if (req.user.role !== 'admin' && conversation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this conversation' })
    }

    const message = new ChatMessage({
      conversation: conversationId,
      sender: req.user._id,
      content
    })

    await message.save()
    await message.populate('sender', 'firstName lastName')

    const messageCount = await ChatMessage.countDocuments({ conversation: conversationId })
    if (messageCount === 1 && req.user.role !== 'admin') {
      const admins = await User.find({ role: 'admin' })
      conversation.participants = [...new Set([...conversation.participants, ...admins.map(admin => admin._id)])]
      await conversation.save()
      await conversation.populate('participants', 'firstName lastName email')
      await conversation.populate('userId', 'firstName lastName email')
      req.io.emit('newConversation', conversation)
    }

    await ChatConversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: Date.now()
    })

    req.io.emit('newMessage', {
      conversationId,
      message
    })

    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params
    const conversation = await ChatConversation.findById(conversationId)

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }

    if (req.user.role !== 'admin' && conversation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this conversation' })
    }

    await ChatMessage.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        isRead: false
      },
      { isRead: true }
    )

    res.json({ message: 'Messages marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllConversations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const conversations = await ChatConversation.find()
      .populate('participants', 'firstName lastName email')
      .populate('userId', 'firstName lastName email')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })

    res.json(conversations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
