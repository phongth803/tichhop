import { Box, Text, HStack, Icon, Button, IconButton, NumberInput, Input, Badge, Heading } from '@chakra-ui/react'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { FiTruck, FiRefreshCcw } from 'react-icons/fi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/stores/rootStore'
import { toast } from 'react-toastify'
import ProductReviews from './ProductReviews'

const ProductInfo = ({ product }) => {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('1')
  const [quantity, setQuantity] = useState(1)
  const { cartStore } = useStore()

  const formatPrice = (price) => {
    const number = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(number)
  }

  const validateQuantity = (value) => {
    const val = parseInt(value)
    if (!value || isNaN(val) || val < 1) {
      return 1
    }
    return Math.min(Math.max(val, 1), product.stock)
  }

  const updateQuantityStates = (value) => {
    const validValue = validateQuantity(value)
    setInputValue(validValue.toString())
    setQuantity(validValue)
    return validValue
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    if (val === '') {
      setInputValue('')
      return
    }

    const numVal = parseInt(val)
    if (!isNaN(numVal)) {
      if (numVal > product.stock) {
        toast.error(`Only ${product.stock} items left in stock`)
        updateQuantityStates(product.stock)
      } else {
        setInputValue(val)
        setQuantity(numVal)
      }
    }
  }

  const handleBlur = () => {
    updateQuantityStates(inputValue)
  }

  const handleBuyNow = async () => {
    try {
      const validQuantity = updateQuantityStates(inputValue)

      if (validQuantity > product.stock) {
        toast.error(`Only ${product.stock} items left in stock`)
        return
      }

      const success = await cartStore.addToCart(product._id, validQuantity)
      if (success) {
        navigate('/cart')
      } else {
        toast.error(cartStore.error)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Box maxW='500px'>
      <Heading as='h1' size='lg'>
        {product.name}
        {product.isNew && (
          <Badge bg='green.400' ml={2} color='white' borderRadius='sm'>
            NEW
          </Badge>
        )}
      </Heading>

      <HStack spacing={2} mb={2}>
        <HStack spacing={1}>
          {Array(5)
            .fill('')
            .map((_, i) => (
              <Icon
                key={i}
                as={i < Math.round(product.averageRating) ? FaStar : FaRegStar}
                color={i < Math.round(product.averageRating) ? 'orange.400' : 'gray.300'}
                boxSize={4}
              />
            ))}
        </HStack>
        <Text color='gray.500' fontSize='sm'>
          ({product?.ratings?.length || 0} Reviews)
        </Text>
        <Text color='gray.400'>|</Text>
        <Text color={product.stock > 0 ? 'green.400' : 'red.400'} fontSize='sm'>
          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
        </Text>
      </HStack>

      <HStack spacing={2}>
        <Text fontSize='2xl' fontWeight='bold' color='red.500'>
          ${formatPrice(product.priceOnSale)}
        </Text>
        {product.discount > 0 && (
          <>
            <Text fontSize='xl' color='gray.500' textDecoration='line-through'>
              ${formatPrice(product.price)}
            </Text>
            <Badge bg='red.500' color='white' fontSize='md' borderRadius='md'>
              -{product.discount}%
            </Badge>
          </>
        )}
      </HStack>

      <Text color='gray.600' fontSize='sm' mb={6}>
        {product.description}
      </Text>

      <HStack spacing={4} mb={8}>
        <NumberInput value={quantity} min={1} max={product.stock} onChange={(_, value) => setQuantity(value)} w='140px'>
          <HStack spacing={0} border='1px' borderColor='gray.500' borderRadius='md' w='fit-content' overflow='hidden'>
            <IconButton
              icon={<Text fontSize='xl'>−</Text>}
              variant='unstyled'
              display='flex'
              alignItems='center'
              justifyContent='center'
              borderRight='1px'
              borderColor='gray.500'
              borderRightRadius='none'
              aria-label='Decrease quantity'
              h='40px'
              w='40px'
              onClick={() => {
                const newValue = quantity - 1
                setQuantity(newValue)
                setInputValue(newValue.toString())
              }}
              isDisabled={quantity <= 1}
              _hover={{
                bg: 'gray.50'
              }}
              _active={{
                bg: 'gray.100',
                transform: 'none'
              }}
            />

            <Input
              type='number'
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              textAlign='center'
              w='50px'
              h='40px'
              p={0}
              border='none'
              borderRadius='none'
              _focus={{
                border: 'none',
                outline: 'none'
              }}
              sx={{
                '&::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0
                },
                '&::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0
                }
              }}
            />

            <IconButton
              icon={<Text fontSize='xl'>+</Text>}
              variant='unstyled'
              display='flex'
              alignItems='center'
              justifyContent='center'
              borderLeft='1px'
              borderColor='gray.500'
              borderLeftRadius='none'
              aria-label='Increase quantity'
              h='40px'
              w='40px'
              onClick={() => {
                const newValue = quantity + 1
                setQuantity(newValue)
                setInputValue(newValue.toString())
              }}
              isDisabled={quantity >= product.stock}
              _hover={{
                bg: 'gray.50'
              }}
              _active={{
                bg: 'gray.100',
                transform: 'none'
              }}
            />
          </HStack>
        </NumberInput>

        <Button colorScheme='red' w='140px' h='42px' onClick={handleBuyNow}>
          Buy Now
        </Button>
      </HStack>

      <Box mt={8} border='1px solid' borderColor='gray.500' borderRadius='md'>
        <HStack spacing={4} p={4} borderBottom='1px solid' borderColor='gray.500'>
          <Icon as={FiTruck} boxSize={6} />
          <Box>
            <Text fontWeight='medium'>Free Delivery</Text>
            <Text fontSize='sm'>Enter your postal code for Delivery Availability</Text>
          </Box>
        </HStack>

        <HStack spacing={4} p={4}>
          <Icon as={FiRefreshCcw} boxSize={6} />
          <Box>
            <Text fontWeight='medium'>Return Delivery</Text>
            <Text fontSize='sm'>Free 30 Days Delivery Returns. Details</Text>
          </Box>
        </HStack>
      </Box>

      <ProductReviews ratings={product.ratings} />
    </Box>
  )
}

export default ProductInfo
