import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Container, VStack, Text, Button, Icon } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { formatPrice } from '@/components/common/FormatPrice'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId, totalAmount } = location.state || {}

  return (
    <Container maxW='container.md' py={16}>
      <Box p={8} bg='white' borderRadius='lg' shadow='md' textAlign='center'>
        <VStack spacing={6}>
          <Icon as={CheckCircleIcon} w={20} h={20} color='green.500' />

          <Text fontSize='3xl' fontWeight='bold' color='green.500'>
            Payment Successful!
          </Text>

          <Text fontSize='lg'>Thank you for your purchase. Your order has been confirmed.</Text>

          {totalAmount && (
            <Text fontSize='xl' fontWeight='medium'>
              Total Amount: {formatPrice(totalAmount)}
            </Text>
          )}

          {orderId && <Text color='gray.600'>Order ID: {orderId}</Text>}

          <Box pt={6}>
            <Button colorScheme='red' size='lg' onClick={() => navigate('/my-orders')} mb={4} width='full'>
              View My Orders
            </Button>

            <Button variant='outline' colorScheme='red' size='lg' onClick={() => navigate('/products')} width='full'>
              Continue Shopping
            </Button>
          </Box>
        </VStack>
      </Box>
    </Container>
  )
}

export default PaymentSuccess
