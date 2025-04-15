import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Box, IconButton, useDisclosure, SlideFade, Icon, Badge, Text, useToast } from '@chakra-ui/react'
import { FaComments } from 'react-icons/fa'
import { useStore } from '@/stores/rootStore'
import ChatWindow from '@/components/About/Chat/ChatWindow'
import { useSound } from 'use-sound'
import notificationSound from '@/assets/sounds/notification.mp3'

const ChatBubble = observer(() => {
  const { isOpen, onToggle } = useDisclosure()
  const { chatStore, authStore } = useStore()
  const [unreadCount, setUnreadCount] = useState(0)
  const toast = useToast()
  const [play] = useSound(notificationSound)

  useEffect(() => {
    if (authStore.isAuthenticated && !authStore.isAdmin) {
      chatStore.fetchConversations()
    }
  }, [authStore.isAuthenticated])

  useEffect(() => {
    const handleNewMessage = async (data) => {
      // Only handle messages for the user's conversation
      const userConversation = chatStore.conversations[0]
      if (userConversation?._id === data.conversationId && data.message.sender._id !== authStore.user?._id) {
        // Play sound for new message
        play()

        // Update unread count if chat window is not open
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1)

          // Show toast notification
          toast({
            title: 'Tin nhắn mới',
            description: `${data.message.sender.firstName} ${data.message.sender.lastName}: ${data.message.content}`,
            status: 'info',
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          })
        }

        // Update messages if chat is open
        if (isOpen) {
          await chatStore.fetchMessages(data.conversationId)
        }
      }
    }

    chatStore.socket?.on('newMessage', handleNewMessage)
    return () => {
      chatStore.socket?.off('newMessage', handleNewMessage)
    }
  }, [chatStore.socket, isOpen, chatStore.conversations])

  // Reset unread count when opening chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  if (!authStore.isAuthenticated || authStore.isAdmin) return null

  return (
    <Box position='fixed' bottom='70px' right='16px' zIndex={1000}>
      <IconButton
        onClick={onToggle}
        icon={
          <Box position='relative'>
            <Icon as={FaComments} boxSize={6} />
            {unreadCount > 0 && (
              <Badge
                position='absolute'
                top='-8px'
                right='-8px'
                colorScheme='red'
                borderRadius='full'
                minW='18px'
                h='18px'
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                <Text fontSize='xs'>{unreadCount}</Text>
              </Badge>
            )}
          </Box>
        }
        colorScheme='blue'
        size='lg'
        borderRadius='full'
        boxShadow='lg'
        aria-label='Open chat'
      />

      {isOpen && (
        <SlideFade in={isOpen} offsetY='20px'>
          <Box position='absolute' bottom='70px' right='0' zIndex={1000} pointerEvents='auto'>
            <ChatWindow onClose={onToggle} />
          </Box>
        </SlideFade>
      )}
    </Box>
  )
})

export default ChatBubble
