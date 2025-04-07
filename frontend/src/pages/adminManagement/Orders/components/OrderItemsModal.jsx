import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  Image,
  VStack,
  Box
} from '@chakra-ui/react'

const OrderItemsModal = ({ isOpen, onClose, items }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Order Items</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>PRODUCT</Th>
                <Th>PRICE</Th>
                <Th>QUANTITY</Th>
                <Th>TOTAL</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items?.map((item, index) => (
                <Tr key={index}>
                  <Td>
                    <HStack spacing={4}>
                      <Image 
                        src={item.product?.thumbnail || item.product?.images?.[0]} 
                        alt={item.product?.name}
                        boxSize="60px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{item.product?.name}</Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {item.product?.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td>${Number(item.price).toFixed(2)}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>${(item.quantity * item.price).toFixed(2)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default OrderItemsModal 