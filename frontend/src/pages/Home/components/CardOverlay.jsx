import { Box, Heading, Text, Link } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const CardOverlay = ({ title, description, size = 'lg' }) => {
  const navigate = useNavigate()

  const handleShopNow = () => {
    navigate('/products')
  }
  return (
    <Box
      position='absolute'
      bottom={0}
      p={6}
      w='100%'
      bgGradient='linear(to-t, blackAlpha.900 0%, blackAlpha.700 50%, transparent 100%)'
    >
      <Heading size={size} color='white' mb={2}>
        {title}
      </Heading>
      <Text color='white' mb={4} maxW='250px'>
        {description}
      </Text>
      <Link
        display='inline-flex'
        alignItems='center'
        color='white'
        fontSize='18px'
        position='relative'
        onClick={handleShopNow}
        _hover={{
          textDecoration: 'none',
          '&::after': {
            width: '85px'
          }
        }}
        sx={{
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '0',
            bottom: '-3px',
            width: '0',
            height: '1.5px',
            backgroundColor: 'white',
            transition: 'width 0.3s ease'
          }
        }}
      >
        Shop Now
      </Link>
    </Box>
  )
}

export default CardOverlay
