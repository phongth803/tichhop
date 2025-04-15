import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/rootStore'
import {
  Box,
  Input,
  Text,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Grid,
  GridItem,
  VStack,
  Flex,
  Divider,
  Container,
  Image,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Textarea
} from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { createOrder } from '@/apis/order'
import { formatPrice } from '@/components/common/FormatPrice'

const Payment = observer(() => {
  const navigate = useNavigate()
  const { authStore, cartStore } = useStore()
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: authStore.user?.firstName || '',
    lastName: authStore.user?.lastName || '',
    emailAddress: authStore.user?.email || '',
    address: authStore.user?.address || '',
    phoneNumber: authStore.user?.phone || ''
  })

  useEffect(() => {
    // Update form data when user data changes
    if (authStore.user) {
      setFormData((prev) => ({
        ...prev,
        firstName: authStore.user.firstName || '',
        lastName: authStore.user.lastName || '',
        emailAddress: authStore.user.email || '',
        address: authStore.user.address || '',
        phoneNumber: authStore.user.phone || ''
      }))
    }
  }, [authStore.user])

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const calculateSubtotal = () => {
    return cartStore.cart?.items.reduce((total, item) => total + item.productId.price * item.quantity, 0) || 0
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.emailAddress.trim()) newErrors.emailAddress = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) newErrors.emailAddress = 'Email is invalid'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    else if (!/^\d{10,11}$/.test(formData.phoneNumber.replace(/[- ]/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be 10-11 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      const orderData = {
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.emailAddress,
          address: formData.address,
          phoneNumber: formData.phoneNumber
        },
        orderItems: cartStore.cart.items.map((item) => ({
          product: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price
        })),
        paymentMethod,
        totalAmount: calculateSubtotal(),
        shippingPrice: 0,
        status: 'PENDING'
      }

      // First try to create the order
      let orderResponse
      try {
        orderResponse = await createOrder(orderData)
      } catch (error) {
        console.error('Failed to create order:', error)
        toast.error(error.response?.data?.message || 'Something went wrong while creating your order')
        return // Exit early if order creation fails
      }

      // If order creation was successful, proceed with navigation
      if (orderResponse && orderResponse._id) {
        toast.success('Order placed successfully!')

        // Force a cart refresh before navigation
        try {
          await cartStore.fetchCart()
        } catch (error) {
          console.error('Failed to refresh cart:', error)
        }

        // Navigate to order confirmation or orders page
        navigate('/my-orders')
      }
    } catch (error) {
      console.error('Order process error:', error)
      toast.warning(
        'Your order might have been created but there was an error in the process. Please check your orders.',
        {
          autoClose: 7000
        }
      )
      // Navigate to orders page anyway so user can check their order status
      navigate('/my-orders')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!cartStore.cart?.items?.length) {
      navigate('/cart')
    }
  }, [cartStore.cart, navigate])

  if (!cartStore.cart) {
    return null
  }

  return (
    <Container maxW='container.xl' py={8}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
        <GridItem>
          <Text fontSize='2xl' fontWeight='bold' mb={6}>
            Billing Details
          </Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align='stretch'>
              <Grid templateColumns='repeat(2, 1fr)' gap={4}>
                <FormControl isInvalid={errors.firstName}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    required
                    placeholder='First Name'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    bg='gray.50'
                  />
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.lastName}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    required
                    placeholder='Last Name'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    bg='gray.50'
                  />
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                </FormControl>
              </Grid>

              <FormControl isInvalid={errors.emailAddress}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  required
                  placeholder='Email Address'
                  name='emailAddress'
                  type='email'
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  bg='gray.50'
                />
                <FormErrorMessage>{errors.emailAddress}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.address}>
                <FormLabel>Shipping Address</FormLabel>
                <Textarea
                  required
                  placeholder='Enter your complete shipping address'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  bg='gray.50'
                  rows={3}
                />
                <FormErrorMessage>{errors.address}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.phoneNumber}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  required
                  placeholder='Phone Number'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  bg='gray.50'
                />
                <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
              </FormControl>
            </VStack>
          </form>
        </GridItem>

        <GridItem>
          <Box bg='gray.50' p={6} borderRadius='lg' shadow='sm'>
            <Text fontSize='xl' fontWeight='bold' mb={4}>
              Your Order
            </Text>

            <VStack spacing={4} align='stretch'>
              {cartStore.cart.items.map((item) => (
                <Flex key={item.productId._id} gap={4} align='center' py={2}>
                  <Image
                    src={item.productId.images[0]}
                    alt={item.productId.name}
                    boxSize='60px'
                    objectFit='cover'
                    borderRadius='md'
                  />
                  <Box flex='1'>
                    <Text fontWeight='medium'>{item.productId.name}</Text>
                    <HStack spacing={4}>
                      <Text color='gray.600'>Quantity: {item.quantity}</Text>
                      <Text color='gray.600'>{formatPrice(item.productId.price)} each</Text>
                    </HStack>
                  </Box>
                  <Text fontWeight='bold'>{formatPrice(item.productId.price * item.quantity)}</Text>
                </Flex>
              ))}

              <Divider />

              <Flex justify='space-between'>
                <Text>Subtotal:</Text>
                <Text>{formatPrice(calculateSubtotal())}</Text>
              </Flex>
              <Flex justify='space-between'>
                <Text>Shipping:</Text>
                <Text>Free</Text>
              </Flex>
              <Flex justify='space-between' fontWeight='bold'>
                <Text>Total:</Text>
                <Text>{formatPrice(calculateSubtotal())}</Text>
              </Flex>

              <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                <Stack>
                  <Radio value='bank'>Bank Transfer</Radio>
                  <Radio value='cod'>Cash on delivery</Radio>
                </Stack>
              </RadioGroup>

              <Button
                colorScheme='red'
                size='lg'
                width='full'
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText='Placing Order...'
              >
                Place Order
              </Button>
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  )
})

export default Payment
