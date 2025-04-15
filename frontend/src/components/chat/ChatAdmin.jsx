import { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Box,
  IconButton,
  Input,
  Text,
  VStack,
  HStack,
  Flex,
  Avatar,
  Badge,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { FaPaperPlane, FaUserFriends } from 'react-icons/fa'
import { useStore } from '@/stores/rootStore'
import { useSound } from 'use-sound'
import notificationSound from '@/assets/sounds/notification.mp3'

const ChatAdmin = observer(() => {
  const { chatStore, authStore } = useStore()
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [play] = useSound(notificationSound)
  const [unreadMessages, setUnreadMessages] = useState({})

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatStore.messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100)
    }
  }, [isOpen])

  useEffect(() => {
    const initializeChat = async () => {
      if (!authStore.user) return

      try {
        if (authStore.user.role === 'admin') {
          await chatStore.fetchAllConversations()
          const initialUnread = {}
          chatStore.conversations.forEach((conv) => {
            initialUnread[conv._id] = 0
          })
          setUnreadMessages(initialUnread)
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      }
    }

    if (authStore.isAuthenticated) {
      initializeChat()
    }
  }, [authStore.isAuthenticated, authStore.user])

  useEffect(() => {
    const handleNewMessage = async (data) => {
      if (data.message.sender._id !== authStore.user._id) {
        play()

        if (!isOpen || chatStore.currentConversation?._id !== data.conversationId) {
          setUnreadMessages((prev) => ({
            ...prev,
            [data.conversationId]: (prev[data.conversationId] || 0) + 1
          }))

          const updatedConversations = [...chatStore.conversations]
          const conversationIndex = updatedConversations.findIndex((c) => c._id === data.conversationId)

          if (conversationIndex !== -1) {
            const conversation = updatedConversations[conversationIndex]
            updatedConversations.splice(conversationIndex, 1)
            conversation.lastMessage = data.message
            updatedConversations.unshift(conversation)
            chatStore.conversations = updatedConversations
          } else {
            await chatStore.fetchAllConversations()
          }

          if (!isOpen) {
            toast({
              title: 'Tin nhắn mới',
              description: `Từ ${data.message.sender.firstName} ${data.message.sender.lastName}: ${data.message.content}`,
              status: 'info',
              duration: 5000,
              isClosable: true,
              position: 'top-right'
            })
          }
        }

        if (chatStore.currentConversation?._id === data.conversationId) {
          await chatStore.fetchMessages(data.conversationId)
          scrollToBottom()
        }
      }
    }

    const handleNewConversation = async (conversation) => {
      play()

      setUnreadMessages((prev) => ({
        ...prev,
        [conversation._id]: 1
      }))

      if (!isOpen) {
        const user = conversation.participants.find((p) => p._id === conversation.userId)
        if (user) {
          toast({
            title: 'Cuộc trò chuyện mới',
            description: `${user.firstName} ${user.lastName} đã bắt đầu cuộc trò chuyện`,
            status: 'info',
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          })
        }
      }

      chatStore.conversations = [conversation, ...chatStore.conversations]
    }

    chatStore.socket?.on('newMessage', handleNewMessage)
    chatStore.socket?.on('newConversation', handleNewConversation)

    return () => {
      chatStore.socket?.off('newMessage', handleNewMessage)
      chatStore.socket?.off('newConversation', handleNewConversation)
    }
  }, [chatStore.socket, chatStore.conversations, chatStore.currentConversation, isOpen])

  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (authStore.user?.role === 'admin') {
        await chatStore.fetchAllConversations()
      }
    }, 10000)

    return () => clearInterval(refreshInterval)
  }, [authStore.user])

  useEffect(() => {
    if (isOpen && chatStore.currentConversation) {
      setUnreadMessages((prev) => ({
        ...prev,
        [chatStore.currentConversation._id]: 0
      }))
    }
  }, [isOpen, chatStore.currentConversation])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !authStore.user || !chatStore.currentConversation) return

    try {
      await chatStore.sendNewMessage(chatStore.currentConversation._id, message.trim())
      setMessage('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleSelectConversation = async (conversation) => {
    chatStore.setCurrentConversation(conversation)
    await chatStore.fetchMessages(conversation._id)
    setUnreadMessages((prev) => ({
      ...prev,
      [conversation._id]: 0
    }))
    setTimeout(scrollToBottom, 100)
  }

  const getTotalUnreadCount = () => {
    return Object.values(unreadMessages).reduce((sum, count) => sum + count, 0)
  }

  if (!authStore.user) return null

  return (
    <>
      <Box position='relative'>
        <IconButton
          icon={<FaUserFriends />}
          position='fixed'
          bottom='20px'
          right='20px'
          colorScheme='blue'
          size='lg'
          isRound
          onClick={onOpen}
        />
        {getTotalUnreadCount() > 0 && (
          <Badge position='fixed' bottom='55px' right='15px' colorScheme='red' borderRadius='full' fontSize='xs' px={2}>
            {getTotalUnreadCount()}
          </Badge>
        )}
      </Box>

      <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='md'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Chat Support</DrawerHeader>

          <DrawerBody p={0}>
            <Flex h='100%' direction='column'>
              <Box borderBottom='1px' borderColor='gray.200' p={2}>
                <Text fontWeight='bold' mb={2}>
                  Conversations
                </Text>
                {chatStore.conversations?.length === 0 ? (
                  <Text p={4} textAlign='center' color='gray.500'>
                    No conversations yet
                  </Text>
                ) : (
                  <VStack align='stretch' spacing={2} maxH='200px' overflowY='auto'>
                    {chatStore.conversations?.map((conv) => {
                      const otherUser = conv.participants?.find((p) => p._id !== authStore.user._id)
                      if (!otherUser) return null

                      return (
                        <HStack
                          key={conv._id}
                          p={2}
                          cursor='pointer'
                          _hover={{ bg: 'gray.100' }}
                          onClick={() => handleSelectConversation(conv)}
                          bg={chatStore.currentConversation?._id === conv._id ? 'blue.50' : 'transparent'}
                          position='relative'
                        >
                          <Avatar size='sm' name={`${otherUser.firstName} ${otherUser.lastName}`} />
                          <VStack align='start' spacing={0} flex={1}>
                            <Text fontWeight='medium'>
                              {otherUser.firstName} {otherUser.lastName}
                            </Text>
                            {conv.lastMessage && (
                              <Text fontSize='xs' color='gray.500' noOfLines={1}>
                                {conv.lastMessage.content}
                              </Text>
                            )}
                          </VStack>
                          {unreadMessages[conv._id] > 0 && (
                            <Badge colorScheme='red' borderRadius='full' px={2}>
                              {unreadMessages[conv._id]}
                            </Badge>
                          )}
                        </HStack>
                      )
                    })}
                  </VStack>
                )}
              </Box>

              <VStack flex={1} p={4} spacing={3} align='stretch' overflowY='auto'>
                {chatStore.messages?.map((msg) => (
                  <Box
                    key={msg._id}
                    alignSelf={msg.sender._id === authStore.user._id ? 'flex-end' : 'flex-start'}
                    maxW='80%'
                  >
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

              <form onSubmit={handleSendMessage}>
                <HStack p={3} borderTop='1px' borderColor='gray.200'>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Type a message...'
                    size='sm'
                  />
                  <IconButton
                    type='submit'
                    icon={<FaPaperPlane />}
                    colorScheme='blue'
                    size='sm'
                    isDisabled={!message.trim() || !chatStore.currentConversation}
                    aria-label='Send message'
                  />
                </HStack>
              </form>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
})

export default ChatAdmin
