import { Box, Image, Badge, Text, HStack, IconButton, Button, Icon } from '@chakra-ui/react'
import { FiEye, FiImage } from 'react-icons/fi'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ _id, name, price, priceOnSale, thumbnail, discount, isNew, rating, reviews }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/product/${_id}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    // Xử lý thêm vào giỏ hàng
  }

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

  const formatPrice = (price) => {
    const number = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(number)
  }

  return (
    <Box
      bg='gray.50'
      borderRadius='md'
      overflow='hidden'
      transition='all 0.3s'
      position='relative'
      cursor='pointer'
      onClick={handleClick}
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
        {discount !== 0 && (
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

        <IconButton
          position='absolute'
          top={2}
          right={2}
          size='sm'
          variant='solid'
          bg='white'
          icon={<FiEye />}
          borderRadius='full'
          className='card-actions'
          opacity={0}
          transform='translateY(-10px)'
          transition='all 0.3s'
          zIndex={1}
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/product/${_id}`)
          }}
        />

        <Image src={thumbnail} alt={name} w='full' h='200px' objectFit='contain' fallback={<NoImage />} />
      </Box>

      <Box p={4}>
        <Text fontWeight='medium' mb={2} noOfLines={2}>
          {name}
        </Text>
        <HStack mb={2}>
          <Text color='red.500' fontWeight='bold'>
            ${formatPrice(priceOnSale)}
          </Text>
          {priceOnSale !== price && (
            <Text color='gray.500' textDecoration='line-through'>
              ${formatPrice(price)}
            </Text>
          )}
        </HStack>
        {rating && reviews && (
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
        )}

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
          onClick={handleAddToCart}
        >
          Add To Cart
        </Button>
      </Box>
    </Box>
  )
}

export default ProductCard
