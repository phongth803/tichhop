import React, { useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  Icon,
  Text,
  HStack,
  IconButton,
  Avatar,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure
} from '@chakra-ui/react'
import {
  MdDashboard,
  MdInventory,
  MdPeople,
  MdNotifications,
  MdLogout,
  MdShoppingCart,
  MdCategory,
  MdMenu
} from 'react-icons/md'
import { useStore } from '../../stores/rootStore'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import ChatAdmin from '../About/Chat/ChatAdmin'

const AdminLayout = () => {
  const { authStore } = useStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const isActive = (path) => pathname === path
  const menuItems = [
    { icon: MdDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: MdInventory, label: 'Products', path: '/admin/products' },
    { icon: MdPeople, label: 'Users', path: '/admin/users' },
    { icon: MdShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: MdCategory, label: 'Category', path: '/admin/category' }
  ]

  const handleLogout = () => {
    authStore.logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const SidebarContent = () => (
    <VStack spacing={1} align='stretch'>
      <HStack px={4} mb={8}>
        <Text fontSize='xl' fontWeight='bold' color='purple.600'>
          PDT
        </Text>
      </HStack>

      {menuItems.map((item, index) => (
        <HStack
          key={index}
          px={4}
          py={3}
          cursor='pointer'
          _hover={{ bg: 'gray.100' }}
          onClick={() => {
            navigate(item.path)
            if (isMobile) onClose()
          }}
          color={isActive(item.path) ? 'purple.600' : 'gray.600'}
          bg={isActive(item.path) ? 'purple.50' : 'transparent'}
        >
          <Icon as={item.icon} boxSize={5} />
          <Text>{item.label}</Text>
        </HStack>
      ))}

      <HStack
        px={4}
        py={3}
        cursor='pointer'
        _hover={{ bg: 'gray.100' }}
        position={isMobile ? 'relative' : 'absolute'}
        bottom={isMobile ? 0 : 4}
        w='100%'
        color='gray.600'
        onClick={handleLogout}
        mt={isMobile ? 'auto' : 0}
      >
        <Icon as={MdLogout} boxSize={5} />
        <Text>Log out</Text>
      </HStack>
    </VStack>
  )

  return (
    <Flex h='100vh'>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box w='240px' bg='white' borderRight='1px' borderColor='gray.200' py={4} position='fixed' h='100vh'>
          <SidebarContent />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement='left' onClose={onClose} size='full'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader p={4} borderBottomWidth='1px'>
            Menu
          </DrawerHeader>
          <DrawerBody p={0}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box ml={isMobile ? 0 : '240px'} flex={1} w={isMobile ? '100%' : 'calc(100% - 240px)'}>
        <Flex
          h='64px'
          bg='white'
          borderBottom='1px'
          borderColor='gray.200'
          px={4}
          align='center'
          justify='space-between'
          position='sticky'
          top={0}
          zIndex={1000}
        >
          <HStack spacing={4}>
            {isMobile && (
              <IconButton
                icon={<Icon as={MdMenu} boxSize={6} />}
                variant='ghost'
                onClick={onOpen}
                aria-label='Open Menu'
              />
            )}
            <Text fontSize='20px' fontWeight='bold'>
              Admin
            </Text>
          </HStack>

          <HStack spacing={4}>
            <IconButton icon={<Icon as={MdNotifications} />} variant='ghost' aria-label='Notifications' />
            <Avatar size='sm' cursor='pointer' />
          </HStack>
        </Flex>

        <Box p={4}>
          <Outlet />
        </Box>
      </Box>
      <ChatAdmin />
    </Flex>
  )
}

export default AdminLayout
