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
  Tooltip,
  Flex,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import { toast } from 'react-toastify'
import RatingForm from '../RatingForm'
import { useStore } from '@/stores/rootStore'
import { observer } from 'mobx-react-lite'

const OrderDetails = observer(({ order, getStatusColor, onToggle }) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const { userOrderStore, authStore } = useStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const handleCancelOrder = async () => {
    try {
      await userOrderStore.cancelOrder(order._id)
      toast.success('Order cancelled successfully')
    } catch (error) {
      toast.error('Cannot cancel order. Please try again later')
    }
  }

  const handleCancelClick = () => {
    onOpen()
  }

  const handleConfirmCancel = () => {
    handleCancelOrder()
    onClose()
  }

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

  const hasUserRated = (product) => {
    return product.ratings?.some((rating) => rating.user === authStore.user?._id)
  }

  const renderRating = (product) => {
    if (!product.ratings || product.ratings.length === 0) {
      return null
    }

    const userRating = product.ratings.find((rating) => rating.user === authStore.user?._id)
    if (!userRating) {
      return null
    }

    return (
      <Tooltip label={`You have rated ${userRating.rating} stars`}>
        <HStack spacing={1}>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} w={4} h={4} color={star <= userRating.rating ? 'yellow.400' : 'gray.300'} />
          ))}
        </HStack>
      </Tooltip>
    )
  }

  return (
    <AccordionItem border='1px' borderColor='gray.200' borderRadius='md' mb={2}>
      <h2>
        <AccordionButton py={2} onClick={onToggle}>
          <Box flex='1'>
            <OrderSummary />
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <VStack spacing={3} align='stretch'>
          <Flex justify='space-between' align='center'>
            <Badge colorScheme={order.paymentStatus === 'paid' ? 'green' : 'yellow'} fontSize='sm' px={2} py={1}>
              Payment: {order.paymentStatus.toUpperCase()}
            </Badge>
            {order.status === 'pending' && (
              <Button colorScheme='red' size='sm' onClick={handleCancelClick}>
                Cancel Order
              </Button>
            )}
          </Flex>

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
                      {!hasUserRated(item.product) && (
                        <Button
                          size='sm'
                          colorScheme='red'
                          onClick={() => {
                            setSelectedProduct(item.product)
                            setIsRatingModalOpen(true)
                          }}
                        >
                          Rating
                        </Button>
                      )}
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
          initialRating={selectedProduct.ratings?.find((rating) => rating.user === authStore.user?._id)?.rating}
          initialReview={selectedProduct.ratings?.find((rating) => rating.user === authStore.user?._id)?.review}
        />
      )}

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Cancel Order
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to cancel this order? This action cannot be undone.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleConfirmCancel} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AccordionItem>
  )
})

export default OrderDetails
