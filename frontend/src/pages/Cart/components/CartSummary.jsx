import { Box, Text, VStack, Flex, Button, Divider } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { formatPrice } from '@/components/common/FormatPrice'

const CartSummary = ({ totalAmount, isMobile }) => (
  <Box
    flex={1}
    maxW={isMobile ? 'full' : '400px'}
    w='full'
    borderWidth={1}
    p={6}
    borderRadius='lg'
    bg='white'
    shadow='sm'
  >
    <Text fontSize='xl' fontWeight='bold' mb={4}>
      Order Summary
    </Text>
    <VStack spacing={4} align='stretch'>
      <Flex justify='space-between' fontSize='lg'>
        <Text color='gray.600'>Subtotal</Text>
        <Text fontWeight='medium'>{formatPrice(totalAmount)}</Text>
      </Flex>
      <Flex justify='space-between' fontSize='lg'>
        <Text color='gray.600'>Shipping</Text>
        <Text fontWeight='medium'>Free</Text>
      </Flex>
      <Divider />
      <Flex justify='space-between' fontSize='xl' fontWeight='bold'>
        <Text>Total</Text>
        <Text color='green.500'>{formatPrice(totalAmount)}</Text>
      </Flex>
      <Button colorScheme='red' size='lg' as={Link} to='/checkout' mt={4}>
        Proceed to Checkout
      </Button>
    </VStack>
  </Box>
)

export default CartSummary
