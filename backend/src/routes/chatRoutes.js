import express from 'express'
const router = express.Router()
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  getAllConversations
} from '../controllers/chatController.js'
import { auth } from '../middleware/auth.js'

router.get('/conversations/all', auth, getAllConversations)
router.post('/conversations', auth, createConversation)
router.get('/conversations', auth, getConversations)
router.get('/conversations/:conversationId/messages', auth, getMessages)
router.post('/messages', auth, sendMessage)
router.put('/conversations/:conversationId/read', auth, markAsRead)

export default router
