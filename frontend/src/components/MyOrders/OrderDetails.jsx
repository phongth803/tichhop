import React, { useState } from 'react'
import { format } from 'date-fns'
import {
  Box,
  Text,
  Badge,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Grid,
  GridItem,
  HStack,
  VStack,
  Divider,
  Stack,
  useBreakpointValue,
  Button,
  Tooltip
} from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import RatingForm from '../RatingForm'

const OrderDetails = ({ order, getStatusColor }) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)

  const OrderSummary = () =>
    isMobile ? (
      <HStack justify='space-between' width='100%' align='center'>
        <VStack align='start' spacing={0}>
          <Text fontSize='sm' fontWeight='medium'>
            Order #{order._id.slice(-8)}
          </Text>
          <Text fontSize='xs' color='gray.500'>
            {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
          </Text>
        </VStack>
        <HStack spacing={2}>
          <Text fontSize='sm' fontWeight='medium'>
            ${order.totalAmount.toFixed(2)}
          </Text>
          <Badge colorScheme={getStatusColor(order.status)} fontSize='xs'>
            {order.status.toUpperCase()}
          </Badge>
        </HStack>
      </HStack>
    ) : (
      <Grid templateColumns='repeat(5, 1fr)' gap={4} alignItems='center'>
        <GridItem>
          <Text fontWeight='bold'>Order #{order._id.slice(-8)}</Text>
        </GridItem>
        <GridItem>
          <Text>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</Text>
        </GridItem>
        <GridItem>
          <Text>${order.totalAmount.toFixed(2)}</Text>
        </GridItem>
        <GridItem>
          <Badge colorScheme={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
        </GridItem>
        <GridItem>
          <Text>{order.items.length} items</Text>
        </GridItem>
      </Grid>
    )

  const renderRating = (product) => {
    if (!product.ratings || product.ratings.length === 0) {
      return null
    }

    const rating = product.ratings[0]
    return (
      <Tooltip label={`Bạn đã đánh giá ${rating.rating} sao`}>
        <HStack spacing={1}>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} w={4} h={4} color={star <= rating.rating ? 'yellow.400' : 'gray.300'} />
          ))}
        </HStack>
      </Tooltip>
    )
  }

  return (
    <AccordionItem border='1px' borderColor='gray.200' borderRadius='md' mb={2}>
      <h2>
        <AccordionButton py={2}>
          <Box flex='1'>
            <OrderSummary />
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <VStack spacing={3} align='stretch'>
          {order.items.map((item, index) => (
            <Box key={index} p={3} borderWidth='1px' borderRadius='lg'>
              <Stack direction={{ base: 'row', sm: 'row' }} spacing={3} width='100%'>
                <Image
                  src={item.product?.thumbnail || item.product?.images?.[0]}
                  alt={item.product?.name}
                  boxSize={{ base: '60px', sm: '100px' }}
                  objectFit='cover'
                  borderRadius='md'
                />
                <VStack align='start' flex={1} spacing={1}>
                  <Text fontWeight='medium' fontSize={{ base: 'sm', md: 'md' }} noOfLines={1}>
                    {item.product?.name}
                  </Text>
                  <Text color='gray.600' fontSize={{ base: 'xs', md: 'sm' }} noOfLines={2}>
                    {item.product?.description}
                  </Text>
                  <HStack justify='space-between' width='100%' fontSize={{ base: 'xs', md: 'sm' }}>
                    <Text>Qty: {item.quantity}</Text>
                    <Text>${item.price.toFixed(2)}</Text>
                    <Text fontWeight='medium'>${(item.quantity * item.price).toFixed(2)}</Text>
                  </HStack>
                  {order.status === 'delivered' && (
                    <HStack spacing={2}>
                      {renderRating(item.product)}
                      <Button
                        size='sm'
                        colorScheme='blue'
                        onClick={() => {
                          setSelectedProduct(item.product)
                          setIsRatingModalOpen(true)
                        }}
                      >
                        {item.product.ratings?.length > 0 ? 'Sửa đánh giá' : 'Đánh giá'}
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </Stack>
            </Box>
          ))}
          <Divider />
          <Box alignSelf='flex-end'>
            <Text fontWeight='bold' fontSize={{ base: 'sm', md: 'md' }}>
              Total: ${order.totalAmount.toFixed(2)}
            </Text>
          </Box>
        </VStack>
      </AccordionPanel>

      {selectedProduct && (
        <RatingForm
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false)
            setSelectedProduct(null)
          }}
          productId={selectedProduct._id}
          productName={selectedProduct.name}
          productImage={selectedProduct.thumbnail || selectedProduct.images?.[0]}
          productPrice={selectedProduct.price}
          initialRating={selectedProduct.ratings?.[0]?.rating}
          initialReview={selectedProduct.ratings?.[0]?.review}
        />
      )}
    </AccordionItem>
  )
}

export default OrderDetails
