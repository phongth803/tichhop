import { HStack, Icon, Text, Button, Box, Badge } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FiUser, FiShoppingCart } from 'react-icons/fi'
import { useStore } from '@/stores/rootStore'
import ProfileMenu from './ProfileMenu'
import { observer } from 'mobx-react-lite'

const ActionButtons = observer(({ isMobile }) => {
  const { authStore, cartStore } = useStore()
  const { isAuthenticated } = authStore

  return (
    <HStack spacing={4}>
      <Box position='relative'>
        <Button as={Link} to='/cart' variant='ghost' p={2}>
          <Icon as={FiShoppingCart} boxSize={5} />
        </Button>
        {cartStore.cart?.items?.length > 0 && (
          <Badge position='absolute' top='-2' right='-2' color='white' bg='red.500' borderRadius='full' fontSize='xs'>
            {cartStore.cart.items.length}
          </Badge>
        )}
      </Box>

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
})

export default ActionButtons
