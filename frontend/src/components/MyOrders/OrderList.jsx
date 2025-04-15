import React from 'react'
import { Box, Text, Accordion } from '@chakra-ui/react'
import OrderDetails from './OrderDetails'

const OrderList = ({ orders, getStatusColor, defaultIndex, setDefaultIndex }) => {
  const handleToggleOrder = (index) => {
    setDefaultIndex((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index)
      } else {
        return [...prev, index]
      }
    })
  }

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
    <Accordion allowMultiple defaultIndex={defaultIndex}>
      {orders.map((order, index) => (
        <OrderDetails
          key={order._id}
          order={order}
          getStatusColor={getStatusColor}
          onToggle={() => handleToggleOrder(index)}
        />
      ))}
    </Accordion>
  )
}

export default OrderList
