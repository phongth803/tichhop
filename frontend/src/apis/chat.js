import axiosInstance from '../utils/axios'

export const getConversations = async () => {
  try {
    const response = await axiosInstance.get('/chat/conversations')
    return response.data
  } catch (error) {
    throw error
  }
}

export const getMessages = async (conversationId) => {
  try {
    const response = await axiosInstance.get(`/chat/conversations/${conversationId}/messages`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const sendMessage = async (conversationId, content) => {
  try {
    const response = await axiosInstance.post('/chat/messages', { conversationId, content })
    return response.data
  } catch (error) {
    throw error
  }
}

export const createConversation = async (participants) => {
  try {
    const response = await axiosInstance.post('/chat/conversations', { participants })
    return response.data
  } catch (error) {
    throw error
  }
}

export const markAsRead = async (conversationId) => {
  try {
    const response = await axiosInstance.put(`/chat/conversations/${conversationId}/read`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getAllConversations = async () => {
  try {
    const response = await axiosInstance.get('/chat/conversations/all')
    return response
  } catch (error) {
    throw error
  }
}
