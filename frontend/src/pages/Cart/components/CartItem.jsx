import {
  Flex,
  Box,
  HStack,
  VStack,
  Image,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Tooltip,
  Grid,
  GridItem
} from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'
import { useStore } from '@/stores/rootStore'
import { formatPrice } from '@/components/common/FormatPrice'

const CartItem = ({ item, onQuantityChange, onRemove, isMobile }) => {
  const { cartStore } = useStore()
  const isLoading = cartStore.isItemLoading(item.productId._id)

  if (isMobile) {
    return (
      <Box p={4} borderBottom='1px' borderColor='gray.100'>
        <Grid templateColumns="80px 1fr" gap={4}>
          <GridItem>
            <Image
              src={item.productId.thumbnail}
              alt={item.productId.name}
              w='80px'
              h='80px'
              objectFit='cover'
              rounded='md'
              fallbackSrc='/images/placeholder.jpg'
            />
          </GridItem>
          <GridItem>
            <VStack align="stretch" spacing={2}>
              <Flex justify="space-between" align="start">
                <Text fontWeight='medium' noOfLines={2} flex={1}>
                  {item.productId.name}
                </Text>
                <IconButton
                  icon={<FiTrash2 />}
                  variant='ghost'
                  colorScheme='red'
                  size='sm'
                  onClick={() => onRemove(item.productId._id, item.productId.name)}
                  isLoading={isLoading}
                  ml={2}
                />
              </Flex>
              <Text color='gray.700' fontWeight='medium'>
                {formatPrice(item.productId.priceOnSale)}
              </Text>
              <Flex justify="space-between" align="center">
                <NumberInput
                  value={item.quantity}
                  min={1}
                  max={99}
                  w='100px'
                  size='sm'
                  onChange={(value) => onQuantityChange(item.productId._id, parseInt(value))}
                  isDisabled={isLoading}
                >
                  <NumberInputField textAlign='center' />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontWeight='medium'>{formatPrice(item.subtotal)}</Text>
              </Flex>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    )
  }

  return (
    <Flex p={4} borderBottom='1px' borderColor='gray.100' align='center'>
      <Box flex={2}>
        <HStack spacing={4}>
          <Image
            src={item.productId.thumbnail}
            alt={item.productId.name}
            boxSize='60px'
            objectFit='cover'
            rounded='md'
            fallbackSrc='/images/placeholder.jpg'
          />
          <Text fontWeight='medium' noOfLines={2}>
            {item.productId.name}
          </Text>
        </HStack>
      </Box>
      <Box flex={1} textAlign='center'>
        <Text color='gray.700' fontWeight='medium'>
          {formatPrice(item.productId.priceOnSale)}
        </Text>
      </Box>
      <Box flex={1} textAlign='center'>
        <NumberInput
          value={item.quantity}
          min={1}
          max={99}
          w='100px'
          mx='auto'
          size='sm'
          onChange={(value) => onQuantityChange(item.productId._id, parseInt(value))}
          isDisabled={isLoading}
        >
          <NumberInputField textAlign='center' />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>
      <Box flex={1} textAlign='right'>
        <Text fontWeight='medium'>{formatPrice(item.subtotal)}</Text>
      </Box>
      <Box w='50px' textAlign='right'>
        <Tooltip label='Remove item'>
          <IconButton
            icon={<FiTrash2 />}
            variant='ghost'
            colorScheme='red'
            size='sm'
            onClick={() => onRemove(item.productId._id, item.productId.name)}
            isLoading={isLoading}
          />
        </Tooltip>
      </Box>
    </Flex>
  )
}

export default CartItem
