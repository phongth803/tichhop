import { Menu, MenuButton, MenuList, MenuItem, Avatar, Icon, Text } from '@chakra-ui/react'
import { FiUser, FiShoppingBag, FiStar, FiXCircle, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/stores/rootStore'

const ProfileMenu = () => {
  const navigate = useNavigate()
  const { authStore } = useStore()
  const { user } = authStore

  const handleLogout = () => {
    authStore.logout()
    navigate('/')
  }

  const menuItems = [
    {
      label: 'Manage My Account',
      icon: FiUser,
      onClick: () => navigate('/profile')
    },
    {
      label: 'My Order',
      icon: FiShoppingBag,
      onClick: () => navigate('/orders')
    },
    {
      label: 'My Cancellations',
      icon: FiXCircle,
      onClick: () => navigate('/cancellations')
    },
    {
      label: 'My Reviews',
      icon: FiStar,
      onClick: () => navigate('/reviews')
    },
    {
      label: 'Logout',
      icon: FiLogOut,
      onClick: handleLogout
    }
  ]

  return (
    <Menu>
      <MenuButton>
        <Avatar size='sm' name={user?.lastName} src={user?.avatar} />
      </MenuButton>
      <MenuList>
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={item.onClick} icon={<Icon as={item.icon} boxSize={4} />}>
            <Text>{item.label}</Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default ProfileMenu
