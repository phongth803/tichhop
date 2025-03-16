import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  IconButton,
  Stack,
  Text
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import rootStore from '../../stores/rootStore'

const Header = observer(() => {
  const { isOpen, onToggle } = useDisclosure()
  const { authStore } = rootStore
  const { isAuthenticated, isAdmin, user, logout } = authStore

  return (
    <Box bg='white' px={4} borderBottom={1} borderStyle='solid' borderColor='gray.200'>
      <Flex h={16} alignItems='center' justifyContent='space-between'>
        <IconButton
          size='md'
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label='Open Menu'
          display={{ md: 'none' }}
          onClick={onToggle}
        />

        <Box as={RouterLink} to='/' fontWeight='bold'>
          Logo
        </Box>

        <Flex display={{ base: 'none', md: 'flex' }} alignItems='center'>
          <Button as={RouterLink} to='/products' variant='ghost'>
            Products
          </Button>

          {isAuthenticated ? (
            <>
              <Button as={RouterLink} to='/cart' variant='ghost'>
                Cart
              </Button>

              <Menu>
                <MenuButton as={Button} variant='ghost'>
                  {user.fullName}
                </MenuButton>
                <MenuList>
                  {isAdmin && (
                    <MenuItem as={RouterLink} to='/admin'>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem as={RouterLink} to='/orders'>
                    My Orders
                  </MenuItem>
                  <MenuItem as={RouterLink} to='/profile'>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Stack direction='row' spacing={4}>
              <Button as={RouterLink} to='/login'>
                Login
              </Button>
              <Button as={RouterLink} to='/register' colorScheme='blue'>
                Register
              </Button>
            </Stack>
          )}
        </Flex>
      </Flex>
    </Box>
  )
})

export default Header
