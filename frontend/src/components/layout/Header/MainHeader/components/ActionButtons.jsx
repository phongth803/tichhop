import { HStack, IconButton, Box } from '@chakra-ui/react'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'

const ActionButtons = () => {
  return (
    <HStack spacing={4}>
      <IconButton
        aria-label='Wishlist'
        icon={<FiHeart size={20} />}
        variant='ghost'
        _hover={{ bg: 'gray.100' }}
        transition='all 0.2s'
      />
      <Box position='relative'>
        <IconButton
          aria-label='Cart'
          icon={<FiShoppingCart size={20} />}
          variant='ghost'
          _hover={{ bg: 'gray.100' }}
          transition='all 0.2s'
        />
        <Box
          position='absolute'
          top='-1'
          right='-1'
          px={1.5}
          py={0.5}
          fontSize='xs'
          fontWeight='bold'
          color='white'
          bg='red.500'
          borderRadius='full'
          minW='18px'
          textAlign='center'>
          0
        </Box>
      </Box>
    </HStack>
  )
}

export default ActionButtons
