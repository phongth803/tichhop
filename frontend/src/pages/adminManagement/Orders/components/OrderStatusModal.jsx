import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select
} from '@chakra-ui/react'

const OrderStatusModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const status = e.target.status.value
    onSubmit({ status })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Order Status</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                defaultValue={initialData?.status || ''}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit">
              Update Status
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
} 

export default OrderStatusModal 