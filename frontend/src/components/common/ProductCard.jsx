import { Box, Image, Badge, Text, HStack, IconButton, Button, Icon } from '@chakra-ui/react'
import { FiHeart, FiEye, FiImage } from 'react-icons/fi'
import { FaStar, FaRegStar } from 'react-icons/fa'

const ProductCard = ({ image, name, price, originalPrice, rating, reviews, discount, isNew }) => {
  const NoImage = () => (
    <Box
      w='full'
      h='200px'
      bg='gray.100'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      color='gray.400'
    >
      <FiImage size={32} />
      <Text mt={2} fontSize='sm'>
        No Image
      </Text>
    </Box>
  )

  return (
    <Box
      bg='gray.50'
      borderRadius='md'
      overflow='hidden'
      transition='all 0.3s'
      position='relative'
      _hover={{
        transform: 'translateY(-5px)',
        shadow: 'md',
        '.card-actions': {
          opacity: 1,
          transform: 'translateY(0)'
        },
        '.add-to-cart': {
          opacity: 1,
          transform: 'translateY(0)'
        }
      }}
    >
      <Box position='relative'>
        {discount && (
          <Badge position='absolute' top={2} left={2} bg='red.500' color='white' borderRadius='md' zIndex={1}>
            -{discount}%
          </Badge>
        )}
        {isNew && (
          <Badge
            position='absolute'
            top={2}
            left={discount ? 16 : 2}
            bg='green.400'
            color='white'
            borderRadius='md'
            zIndex={1}
          >
            NEW
          </Badge>
        )}

        {/* Quick actions */}
        <HStack
          position='absolute'
          top={2}
          right={2}
          spacing={1}
          className='card-actions'
          opacity={0}
          transform='translateY(-10px)'
          transition='all 0.3s'
          zIndex={1}
        >
          <IconButton
            size='sm'
            variant='solid'
            bg='white'
            icon={<FiHeart />}
            borderRadius='full'
            _hover={{ color: 'red.500' }}
          />
          <IconButton size='sm' variant='solid' bg='white' icon={<FiEye />} borderRadius='full' />
        </HStack>

        <Image src={image} alt={name} w='full' h='200px' objectFit='contain' fallback={<NoImage />} />
      </Box>

      <Box p={4}>
        <Text fontWeight='medium' mb={2} noOfLines={2}>
          {name}
        </Text>
        <HStack mb={2}>
          <Text color='red.500' fontWeight='bold'>
            ${price}
          </Text>
          {originalPrice && (
            <Text color='gray.500' textDecoration='line-through'>
              ${originalPrice}
            </Text>
          )}
        </HStack>
        <HStack>
          <HStack spacing={1}>
            {Array(5)
              .fill('')
              .map((_, i) => (
                <Icon key={i} as={i < rating ? FaStar : FaRegStar} color={i < rating ? 'yellow.400' : 'gray.300'} />
              ))}
          </HStack>
          <Text color='gray.500'>({reviews})</Text>
        </HStack>

        {/* Add to Cart button */}
        <Button
          w='full'
          mt={3}
          bg='black'
          color='white'
          className='add-to-cart'
          opacity={0}
          transform='translateY(20px)'
          transition='all 0.3s'
          _hover={{ bg: 'gray.800' }}
        >
          Add To Cart
        </Button>
      </Box>
    </Box>
  )
}

export default ProductCard
