import React from 'react'
import { Box, Flex, VStack, Icon, Text, HStack, IconButton, Avatar } from '@chakra-ui/react'
import {
  MdDashboard,
  MdInventory,
  MdFlashOn,
  MdPeople,
  MdNotifications,
  MdSettings,
  MdLogout,
  MdShoppingCart,
  MdCategory
} from 'react-icons/md'
import { useStore } from '../../stores/rootStore'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const AdminLayout = ({ children }) => {
  const { authStore } = useStore()
  const { logout } = authStore
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isActive = (path) => pathname === path
  const menuItems = [
    { icon: MdDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: MdInventory, label: 'Products', path: '/admin/products' },
    { icon: MdFlashOn, label: 'Flash Sales', path: '/admin/flash-sales' },
    { icon: MdPeople, label: 'Users', path: '/admin/users' },
    { icon: MdShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: MdCategory, label: 'Category', path: '/admin/category' },
    { icon: MdSettings, label: 'Settings', path: '/admin/settings' }
  ]

  return (
    <Flex h='100vh'>
      <Box w='240px' bg='white' borderRight='1px' borderColor='gray.200' py={4} position='fixed' h='100vh'>
        <HStack px={4} mb={8}>
          <Text fontSize='xl' fontWeight='bold' color='purple.600'>
            PDT
          </Text>
        </HStack>

        <VStack spacing={1} align='stretch'>
          {menuItems.map((item, index) => (
            <HStack
              key={index}
              px={4}
              py={3}
              cursor='pointer'
              _hover={{ bg: 'gray.100' }}
              onClick={() => navigate(item.path)}
              color={isActive(item.path) ? 'purple.600' : 'gray.600'}
              bg={isActive(item.path) ? 'purple.50' : 'transparent'}
            >
              <Icon as={item.icon} boxSize={5} />
              <Text>{item.label}</Text>
            </HStack>
          ))}
        </VStack>

        <HStack
          px={4}
          py={3}
          cursor='pointer'
          _hover={{ bg: 'gray.100' }}
          position='absolute'
          bottom={4}
          w='100%'
          color='gray.600'
        >
          <Icon as={MdLogout} boxSize={5} />
          <Text onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            Log out
          </Text>
        </HStack>
      </Box>

      <Box ml='240px' flex={1}>
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
        >
          <Text fontSize='20px' fontWeight='bold'>
            Admin Dashboard
          </Text>
          <HStack spacing={4}>
            <IconButton icon={<Icon as={MdNotifications} />} variant='ghost' aria-label='Notifications' />
            <Avatar size='sm' src='/path-to-avatar.jpg' cursor='pointer' />
          </HStack>
        </Flex>

        <Box p={4}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  )
}

export default AdminLayout
