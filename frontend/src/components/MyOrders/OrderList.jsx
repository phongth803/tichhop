import React from 'react'
import { Box, Text, Accordion } from '@chakra-ui/react'
import OrderDetails from './OrderDetails'

const OrderList = ({ orders, getStatusColor }) => {
  if (orders.length === 0) {
    return (
      <Box textAlign='center' py={6}>
        <Text fontSize={{ base: 'sm', md: 'md' }} color='gray.500'>
          No orders found
        </Text>
      </Box>
    )
  }

  return (
    <Accordion allowMultiple>
      {orders.map((order) => (
        <OrderDetails key={order._id} order={order} getStatusColor={getStatusColor} />
      ))}
    </Accordion>
  )
}

export default OrderList
