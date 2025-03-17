import { HStack, Button } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@/components/layout/Header/constants'
const Navigation = () => {
  const location = useLocation()

  return (
    <HStack spacing={8}>
      {NAV_ITEMS.map(({ id, label, path }) => (
        <Link key={id} to={path}>
          <Button
            variant='ghost'
            position='relative'
            color='gray.800'
            _hover={{
              bg: 'transparent',
              color: 'black',
              '&::after': {
                transform: 'translateX(-50%) scaleX(1)'
              }
            }}
            _after={{
              content: '""',
              position: 'absolute',
              bottom: '2px',
              left: '50%',
              transform: location.pathname === path ? 'translateX(-50%)' : 'translateX(-50%) scaleX(0)',
              width: '80%',
              height: '2px',
              bg: 'black',
              transition: 'transform 0.2s ease-in-out'
            }}>
            {label}
          </Button>
        </Link>
      ))}
    </HStack>
  )
}

export default Navigation
