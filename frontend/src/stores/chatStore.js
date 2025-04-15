import { makeAutoObservable } from 'mobx'
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  markAsRead,
  getAllConversations
} from '../apis/chat'
import io from 'socket.io-client'

class ChatStore {
  conversations = []
  currentConversation = null
  messages = []
  loading = false
  error = null
  socket = null

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
    this.initializeSocket()
  }

  initializeSocket = () => {
    this.socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    this.socket.on('connect', () => {
      // Socket connected
    })

    this.socket.on('newMessage', (data) => {
      // Check if message already exists
      const messageExists = this.messages.some((msg) => msg._id === data.message._id)
      if (!messageExists) {
        // Add message to current conversation if it matches
        if (data.conversationId === this.currentConversation?._id) {
          this.addMessage(data.message)
        }
        // Update last message in conversations list
        const conversationIndex = this.conversations.findIndex((conv) => conv._id === data.conversationId)
        if (conversationIndex !== -1) {
          const updatedConversations = [...this.conversations]
          updatedConversations[conversationIndex] = {
            ...updatedConversations[conversationIndex],
            lastMessage: data.message,
            updatedAt: new Date()
          }
          this.setConversations(updatedConversations)
        }
      }
    })

    this.socket.on('disconnect', () => {
      // Socket disconnected
    })
  }

  joinConversation = (conversationId) => {
    if (this.socket) {
      this.socket.emit('join_conversation', conversationId)
    }
  }

  leaveConversation = (conversationId) => {
    if (this.socket) {
      this.socket.emit('leave_conversation', conversationId)
    }
  }

  setLoading = (status) => {
    this.loading = status
  }

  setError = (error) => {
    this.error = error
  }

  setConversations = (conversations) => {
    this.conversations = conversations || []
  }

  setCurrentConversation = (conversation) => {
    if (this.currentConversation) {
      this.leaveConversation(this.currentConversation._id)
    }
    this.currentConversation = conversation
    if (conversation) {
      this.joinConversation(conversation._id)
    }
  }

  setMessages = (messages) => {
    this.messages = messages || []
  }

  addMessage = (message) => {
    // Check if message already exists
    const messageExists = this.messages.some((msg) => msg._id === message._id)
    if (!messageExists) {
      this.messages = [...this.messages, message]
    }
  }

  fetchConversations = async () => {
    this.setLoading(true)
    this.setError(null)
    try {
      const conversations = await getConversations()
      this.setConversations(conversations)
    } catch (error) {
      this.setError(error.message)
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  fetchMessages = async (conversationId) => {
    this.setLoading(true)
    this.setError(null)
    try {
      const messages = await getMessages(conversationId)
      this.setMessages(messages)
      await markAsRead(conversationId)
    } catch (error) {
      this.setError(error.message)
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  sendNewMessage = async (conversationId, content) => {
    this.setLoading(true)
    this.setError(null)
    try {
      const newMessage = await sendMessage(conversationId, content)
      // Don't add message here, wait for socket event
      return newMessage
    } catch (error) {
      this.setError(error.message)
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  startNewConversation = async (participants) => {
    this.setLoading(true)
    this.setError(null)
    try {
      const newConversation = await createConversation(participants)
      this.setCurrentConversation(newConversation)
      return newConversation
    } catch (error) {
      this.setError(error.message)
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  fetchAllConversations = async () => {
    try {
      const response = await getAllConversations()
      this.conversations = response.data
    } catch (error) {
      console.error('Error fetching all conversations:', error)
      throw error
    }
  }
}

export default ChatStore
