import { Box, Image, Badge, Text, HStack, IconButton, Button, Icon } from '@chakra-ui/react'
import { FiEye, FiImage } from 'react-icons/fi'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../stores/rootStore'
import { toast } from 'react-toastify'
import { useState } from 'react'

const ProductCard = observer(
  ({ _id, name, price, priceOnSale, thumbnail, discount, isNew, averageRating, ratings, stock }) => {
    const { cartStore } = useStore()
    const navigate = useNavigate()
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    const handleClick = () => {
      navigate(`/product/${_id}`)
    }

    const handleAddToCart = async (e) => {
      e.stopPropagation()
      if (stock === 0) {
        return
      }
      setIsAddingToCart(true)
      try {
        const success = await cartStore.addToCart(_id, 1)
        if (success) {
          toast.success('Product added to cart')
        } else {
          toast.error(cartStore.error || 'Failed to add product to cart')
        }
      } catch (error) {
        toast.error(error.message || 'Failed to add product to cart')
      } finally {
        setIsAddingToCart(false)
      }
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
          {stock === 0 && (
            <Box
              position='absolute'
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg='blackAlpha.400'
              zIndex={2}
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <Badge bg='red.500' color='white' fontSize='lg' px={4} py={2} borderRadius='md'>
                Out of Stock
              </Badge>
            </Box>
          )}
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
          <HStack>
            <HStack spacing={1}>
              {Array(5)
                .fill('')
                .map((_, i) => (
                  <Icon
                    key={i}
                    as={i < Math.round(averageRating || 0) ? FaStar : FaRegStar}
                    color={i < Math.round(averageRating || 0) ? 'yellow.400' : 'gray.300'}
                  />
                ))}
            </HStack>
            <Text color='gray.500' fontSize='sm'>
              ({ratings?.length || 0})
            </Text>
          </HStack>

          <Button
            w='full'
            mt={3}
            bg={stock === 0 ? 'gray.400' : 'black'}
            color='white'
            className='add-to-cart'
            opacity={0}
            transform='translateY(20px)'
            transition='all 0.3s'
            _hover={{ bg: stock === 0 ? 'gray.400' : 'gray.800' }}
            isLoading={isAddingToCart}
            loadingText='Adding...'
            onClick={handleAddToCart}
            cursor={stock === 0 ? 'not-allowed' : 'pointer'}
          >
            {stock === 0 ? 'Out of Stock' : 'Add To Cart'}
          </Button>
        </Box>
      </Box>
    )
  }
)

export default ProductCard
