import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/rootStore'
import { useDisclosure, Container, VStack, Text, Button, Flex, Box, useBreakpointValue } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import CartItem from './components/CartItem'
import CartSummary from './components/CartSummary'
import Loading from '@/components/common/Loading'
import ConfirmModal from '@/components/common/ConfirmModal'

const Cart = observer(() => {
  const { cartStore } = useStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [itemToDelete, setItemToDelete] = useState(null)
  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    cartStore.fetchCart()
  }, [cartStore])

  if (cartStore.loading || !cartStore.cart) {
    return <Loading text='Loading your cart...' />
  }

  if (!cartStore.cart.items?.length) {
    return (
      <Container maxW='container.xl' py={8}>
        <VStack spacing={6} align='center'>
          <Text fontSize='2xl' fontWeight='medium'>
            Your cart is empty
          </Text>
          <Link to='/products'>
            <Button size='lg' colorScheme='blue'>
              Continue Shopping
            </Button>
          </Link>
        </VStack>
      </Container>
    )
  }

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity >= 1) {
      try {
        await cartStore.updateCartItem(productId, quantity)
      } catch (error) {
        toast.error(error.message || 'Failed to update quantity')
      }
    }
  }

  const handleRemoveClick = (productId, productName) => {
    setItemToDelete({ id: productId, name: productName })
    onOpen()
  }

  const handleRemoveConfirm = async () => {
    try {
      await cartStore.removeFromCart(itemToDelete.id)
      toast.success('Item removed from cart successfully')
      onClose()
    } catch (error) {
      toast.error(error.message || 'Failed to remove item')
    }
  }

  return (
    <>
      <Container maxW='container.xl' py={8}>
        <Text fontSize='2xl' fontWeight='bold' mb={6}>
          Shopping Cart
        </Text>
        <Flex direction='column' gap={6}>
          <Box bg='white' rounded='lg' shadow='sm' overflow='hidden'>
            {!isMobile && (
              <Flex borderBottom='1px' borderColor='gray.200' p={4} bg='gray.50' fontWeight='medium'>
                <Box flex={2}>Product</Box>
                <Box flex={1} textAlign='center'>
                  Price
                </Box>
                <Box flex={1} textAlign='center'>
                  Quantity
                </Box>
                <Box flex={1} textAlign='right'>
                  Subtotal
                </Box>
                <Box w='50px'></Box>
              </Flex>
            )}

            {cartStore.cart.items.map((item) => (
              <CartItem
                key={item.productId._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveClick}
                isMobile={isMobile}
              />
            ))}
          </Box>

          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify='space-between'
            align={{ base: 'stretch', md: 'start' }}
            gap={6}
          >
            <Link to='/products'>
              <Button variant='outline' size='lg' w={{ base: 'full', md: 'auto' }}>
                Continue Shopping
              </Button>
            </Link>
            <CartSummary totalAmount={cartStore.cart.totalAmount} isMobile={isMobile} />
          </Flex>
        </Flex>
      </Container>

      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleRemoveConfirm}
        title='Remove Item'
        message={`Remove "${itemToDelete?.name}" from your cart?`}
        confirmText='Remove'
        cancelText='Cancel'
        confirmColorScheme='red'
        isLoading={itemToDelete ? cartStore.isItemLoading(itemToDelete.id) : false}
      />
    </>
  )
})

export default Cart
