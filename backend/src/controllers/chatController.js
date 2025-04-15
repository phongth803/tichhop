import ChatConversation from '../models/ChatConversation.js'
import ChatMessage from '../models/ChatMessage.js'
import User from '../models/User.js'
import sendEmail from '../utils/emailService.js'

export const createConversation = async (req, res) => {
  try {
    const { participants } = req.body

    const existingConversation = await ChatConversation.findOne({
      participants: { $all: participants }
    })

    if (existingConversation) {
      return res.status(200).json(existingConversation)
    }

    const conversation = new ChatConversation({
      participants
    })

    await conversation.save()

    const admins = await User.find({ role: 'ADMIN' })
    const user = await User.findById(participants.find(p => p !== req.user._id))

    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: 'New Chat Conversation',
        text: `A new chat conversation has been started with ${user.firstName} ${user.lastName}`
      })
    }

    res.status(201).json(conversation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getConversations = async (req, res) => {
  try {
    const conversations = await ChatConversation.find({
      participants: req.user._id
    })
      .populate('participants', 'firstName lastName email')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })

    res.json(conversations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
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

    const message = new ChatMessage({
      conversation: conversationId,
      sender: req.user._id,
      content
    })

    await message.save()

    await ChatConversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: Date.now()
    })

    const conversation = await ChatConversation.findById(conversationId).populate('participants', 'email role')

    const otherParticipants = conversation.participants.filter(p => p._id.toString() !== req.user._id.toString())

    for (const participant of otherParticipants) {
      if (participant.role === 'ADMIN') {
        await sendEmail({
          to: participant.email,
          subject: 'New Chat Message',
          text: `You have received a new message in your conversation`
        })
      }
    }

    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params
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
