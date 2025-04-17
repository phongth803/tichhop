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
  Textarea,
  Spinner,
  FormHelperText
} from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { formatPrice } from '@/components/common/FormatPrice'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CheckoutForm = ({ clientSecret, onSuccess, formData }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')

  const getBillingDetails = () => ({
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.emailAddress,
    phone: formData.phoneNumber,
    address: {
      line1: formData.address
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          payment_method_data: {
            billing_details: getBillingDetails()
          },
          save_payment_method: false,
          return_url: `${window.location.origin}/payment-success`
        }
      })

      if (error) {
        setMessage(error.message)
        toast.error(error.message)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        await onSuccess()
      }
    } catch (error) {
      console.error('Payment error:', error)
      setMessage('An unexpected error occurred.')
      toast.error('An unexpected error occurred.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: getBillingDetails()
          },
          wallets: {
            link: 'never'
          },
          fields: {
            billingDetails: {
              address: {
                country: 'auto'
              }
            }
          }
        }}
      />
      <Button
        colorScheme='red'
        size='lg'
        width='full'
        mt={4}
        disabled={isProcessing || !stripe || !elements}
        isLoading={isProcessing}
        loadingText='Processing...'
        type='submit'
      >
        Pay now
      </Button>
      {message && (
        <Text color='red.500' mt={2}>
          {message}
        </Text>
      )}
    </form>
  )
}

const Payment = observer(() => {
  const navigate = useNavigate()
  const { authStore, cartStore, stripeStore, userOrderStore } = useStore()
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

  useEffect(() => {
    // Initialize payment intent when selecting credit card
    if (paymentMethod === 'stripe' && !stripeStore.clientSecret) {
      stripeStore.createPaymentIntent(calculateSubtotal()).catch(() => {
        setPaymentMethod('cod') // Reset to COD if payment initialization fails
      })
    }
  }, [paymentMethod])

  // Reset stripe store when component unmounts
  useEffect(() => {
    return () => {
      stripeStore.reset()
    }
  }, [])

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
    return cartStore.cart?.items.reduce((total, item) => total + item.productId.priceOnSale * item.quantity, 0) || 0
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

  const getOrderData = (paymentStatus) => {
    return {
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
        price: item.productId.priceOnSale
      })),
      paymentMethod: paymentMethod === 'stripe' ? 'card' : 'cod',
      totalAmount: calculateSubtotal(),
      shippingPrice: 0,
      status: 'pending',
      paymentStatus: paymentStatus
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      if (paymentMethod === 'stripe') {
        try {
          await stripeStore.createPaymentIntent(calculateSubtotal())
        } catch (error) {
          return
        }
      } else {
        const orderResponse = await userOrderStore.createOrder(getOrderData('pending'))

        if (orderResponse && orderResponse._id) {
          await handleOrderSuccess(orderResponse)
          navigate('/my-orders')
        }
      }
    } catch (error) {
      console.error('Order process error:', error)
      toast.warning(
        'Your order might have been created but there was an error in the process. Please check your orders.',
        {
          autoClose: 7000
        }
      )
      navigate('/my-orders')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOrderSuccess = async (orderResponse) => {
    try {
      await authStore.updateProfile({
        address: formData.address,
        phone: formData.phoneNumber
      })
    } catch (error) {
      console.error('Failed to update user profile:', error)
      toast.warning('Order placed successfully, but failed to save your contact information.')
    }

    toast.success('Order placed successfully!')
    await cartStore.fetchCart()
  }

  const handlePaymentSuccess = async () => {
    try {
      const orderResponse = await userOrderStore.createOrder(getOrderData('paid'))

      if (orderResponse && orderResponse._id) {
        await handleOrderSuccess(orderResponse)
        navigate('/payment-success', {
          state: {
            orderId: orderResponse._id,
            totalAmount: calculateSubtotal()
          }
        })
      }
    } catch (error) {
      console.error('Order process error:', error)
      toast.error('Failed to create order after successful payment')
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

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#E53E3E'
    }
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
                  placeholder='Email Address'
                  name='emailAddress'
                  type='email'
                  value={formData.emailAddress}
                  bg='gray.100'
                  border='none'
                  isReadOnly
                  title='Email cannot be changed'
                />
                <FormHelperText color='gray.500'>Email cannot be changed</FormHelperText>
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
                      <Text color='gray.600'>{formatPrice(item.productId.priceOnSale)} each</Text>
                    </HStack>
                  </Box>
                  <Text fontWeight='bold'>{formatPrice(item.productId.priceOnSale * item.quantity)}</Text>
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
                  <Radio value='stripe'>Credit Card</Radio>
                  <Radio value='cod'>Cash on delivery</Radio>
                </Stack>
              </RadioGroup>

              {paymentMethod === 'stripe' ? (
                stripeStore.clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret: stripeStore.clientSecret,
                      appearance
                    }}
                  >
                    <CheckoutForm onSuccess={handlePaymentSuccess} formData={formData} />
                  </Elements>
                ) : (
                  <Box textAlign='center' py={4}>
                    <Spinner size='md' color='red.500' />
                    <Text mt={2}>Initializing payment...</Text>
                  </Box>
                )
              ) : (
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
              )}
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  )
})

export default Payment
