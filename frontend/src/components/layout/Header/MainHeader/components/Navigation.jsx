import { HStack, VStack, Button } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '@/stores/rootStore'
import { NAV_ITEMS } from '@/components/layout/Header/constants/constants'

const Navigation = ({ isMobile, onClose }) => {
  const { authStore } = useStore()
  const { isAuthenticated } = authStore
  const location = useLocation()
  const Container = isMobile ? VStack : HStack

  const handleClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  // Lọc nav items dựa trên trạng thái authentication
  const filteredNavItems = NAV_ITEMS.filter((item) => !item.guestOnly || !isAuthenticated)

  return (
    <Container
      spacing={isMobile ? 0 : 8}
      align={isMobile ? 'stretch' : 'center'}
      justify={isMobile ? 'flex-start' : 'center'}
      w='100%'
    >
      {filteredNavItems.map(({ id, label, path }) => {
        const isActive = location.pathname === path

        return (
          <Link key={id} to={path} style={{ width: isMobile ? '100%' : 'auto' }} onClick={handleClick}>
            <Button
              variant='ghost'
              w={isMobile ? '100%' : 'auto'}
              justifyContent={isMobile ? 'flex-start' : 'center'}
              py={isMobile ? 4 : 2}
              px={isMobile ? 6 : 3}
              borderRadius={0}
              bg={isMobile && isActive ? 'gray.100' : 'transparent'}
              color='black'
              fontWeight={isActive ? 'bold' : 'normal'}
              position='relative'
              _hover={{
                bg: isMobile ? 'gray.50' : 'transparent',
                color: 'black'
              }}
              _after={
                !isMobile
                  ? {
                      content: '""',
                      position: 'absolute',
                      bottom: '0',
                      left: '50%',
                      transform: isActive ? 'translateX(-50%)' : 'translateX(-50%) scaleX(0)',
                      width: '100%',
                      height: '2px',
                      bg: 'black',
                      transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
                      opacity: isActive ? 1 : 0
                    }
                  : {}
              }
              sx={{
                '&:hover': {
                  '&::after': !isMobile
                    ? {
                        transform: 'translateX(-50%) scaleX(1)',
                        opacity: 1
                      }
                    : {}
                }
              }}
            >
              {label}
            </Button>
          </Link>
        )
      })}
    </Container>
  )
}

export default Navigation
