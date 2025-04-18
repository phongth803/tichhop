import React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Select
} from '@chakra-ui/react'

const OrderFilter = ({ isOpen, onClose, onFilter, currentFilters }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const status = e.target.status.value
    onFilter({ status })
    onClose()
  }

  const handleReset = () => {
    onFilter({ status: '' })
    onClose()
  }

  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filter Orders</DrawerHeader>
        <DrawerBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select name='status' defaultValue={currentFilters.status}>
                  <option value=''>All</option>
                  <option value='pending'>Pending</option>
                  <option value='processing'>Processing</option>
                  <option value='delivered'>Delivered</option>
                  <option value='cancelled'>Cancelled</option>
                </Select>
              </FormControl>
              <Button width='full' type='submit' colorScheme='purple'>
                Apply Filters
              </Button>
              <Button width='full' variant='ghost' onClick={handleReset}>
                Reset Filters
              </Button>
            </VStack>
          </form>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default OrderFilter
