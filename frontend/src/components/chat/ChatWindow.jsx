import { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Box, IconButton, Input, Text, VStack, HStack, useColorModeValue } from '@chakra-ui/react'
import { FaTimes, FaPaperPlane } from 'react-icons/fa'
import { useStore } from '@/stores/rootStore'

const ChatWindow = observer(({ onClose }) => {
  const { chatStore, authStore } = useStore()
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatStore.messages])

  useEffect(() => {
    const initializeChat = async () => {
      if (!authStore.user) return

      // Reset current conversation and messages when component mounts
      chatStore.setCurrentConversation(null)
      chatStore.messages = []

      // Fetch conversation for current user
      await chatStore.fetchConversations()

      if (chatStore.conversations.length === 0) {
        // Create new conversation if none exists
        await chatStore.startNewConversation([authStore.user._id])
      } else {
        // Set the user's conversation as current
        const userConversation = chatStore.conversations.find((conv) => conv.userId === authStore.user._id)
        if (userConversation) {
          chatStore.setCurrentConversation(userConversation)
          await chatStore.fetchMessages(userConversation._id)
        }
      }
    }

    if (authStore.isAuthenticated) {
      initializeChat()
    }

    // Cleanup function to reset state when component unmounts
    return () => {
      chatStore.setCurrentConversation(null)
      chatStore.messages = []
    }
  }, [authStore.isAuthenticated, authStore.user])

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (data) => {
      if (data.conversationId === chatStore.currentConversation?._id) {
        chatStore.addMessage(data.message)
        scrollToBottom()
      }
    }

    chatStore.socket?.on('newMessage', handleNewMessage)
    return () => {
      chatStore.socket?.off('newMessage', handleNewMessage)
    }
  }, [chatStore.socket, chatStore.currentConversation])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !authStore.user) return

    try {
      await chatStore.sendNewMessage(chatStore.currentConversation._id, message.trim())
      setMessage('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (!authStore.user) {
    return null
  }

  return (
    <Box
      width='300px'
      height='400px'
      bg={bgColor}
      borderRadius='lg'
      boxShadow='xl'
      border='1px'
      borderColor={borderColor}
      overflow='hidden'
    >
      {/* Header */}
      <HStack p={3} bg='blue.500' color='white' justifyContent='space-between'>
        <Text fontWeight='bold'>Hỗ trợ khách hàng</Text>
        <IconButton
          icon={<FaTimes />}
          size='sm'
          variant='ghost'
          color='white'
          _hover={{ bg: 'blue.600' }}
          onClick={onClose}
          aria-label='Close chat'
        />
      </HStack>

      {/* Messages */}
      <VStack height='290px' overflowY='auto' p={3} spacing={3} alignItems='stretch'>
        {chatStore.messages.map((msg) => (
          <Box key={msg._id} alignSelf={msg.sender._id === authStore.user._id ? 'flex-end' : 'flex-start'} maxW='80%'>
            <Box
              bg={msg.sender._id === authStore.user._id ? 'blue.500' : 'gray.100'}
              color={msg.sender._id === authStore.user._id ? 'white' : 'black'}
              px={3}
              py={2}
              borderRadius='lg'
            >
              <Text fontSize='sm'>{msg.content}</Text>
            </Box>
            <Text fontSize='xs' color='gray.500' mt={1}>
              {new Date(msg.createdAt).toLocaleTimeString()}
            </Text>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </VStack>

      {/* Input */}
      <form onSubmit={handleSendMessage}>
        <HStack p={3} borderTop='1px' borderColor={borderColor}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Nhập tin nhắn...'
            size='sm'
          />
          <IconButton
            type='submit'
            icon={<FaPaperPlane />}
            colorScheme='blue'
            size='sm'
            isDisabled={!message.trim()}
            aria-label='Send message'
          />
        </HStack>
      </form>
    </Box>
  )
})

export default ChatWindow
