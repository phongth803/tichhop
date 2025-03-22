import { HStack, Icon, Text, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FiUser, FiShoppingCart, FiHeart } from 'react-icons/fi'
import { useStore } from '@/stores/rootStore'
import ProfileMenu from './ProfileMenu'

const ActionButtons = ({ isMobile }) => {
  const { authStore } = useStore()
  const { isAuthenticated } = authStore

  return (
    <HStack spacing={4}>
      <Button as={Link} to='/wishlist' variant='ghost' p={2}>
        <Icon as={FiHeart} boxSize={5} />
      </Button>

      <Button as={Link} to='/cart' variant='ghost' p={2}>
        <Icon as={FiShoppingCart} boxSize={5} />
      </Button>

      {isAuthenticated ? (
        <ProfileMenu />
      ) : (
        <Button
          as={Link}
          to='/login'
          variant='ghost'
          leftIcon={<Icon as={FiUser} boxSize={5} />}
          size={isMobile ? 'sm' : 'md'}
        >
          <Text>Sign In</Text>
        </Button>
      )}
    </HStack>
  )
}

export default ActionButtons
