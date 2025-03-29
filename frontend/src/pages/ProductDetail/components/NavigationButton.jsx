import { IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

const NavigationButton = ({ direction, onClick, isDark = false }) => (
  <IconButton
    icon={direction === 'left' ? <ChevronLeftIcon boxSize={6} /> : <ChevronRightIcon boxSize={6} />}
    aria-label={`${direction === 'left' ? 'Previous' : 'Next'} image`}
    position='absolute'
    {...(direction === 'left' ? { left: 2 } : { right: 2 })}
    top='50%'
    transform='translateY(-50%)'
    onClick={onClick}
    h='60px'
    minW='30px'
    rounded='sm'
    bg={isDark ? 'gray.700' : 'white'}
    color={isDark ? 'white' : 'gray.700'}
    opacity={0.8}
    _hover={{
      opacity: 1,
      bg: isDark ? 'gray.700' : 'white'
    }}
    _active={{
      bg: isDark ? 'gray.800' : 'gray.100'
    }}
    zIndex={2}
  />
)

export default NavigationButton
