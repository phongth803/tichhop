import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useBreakpointValue
} from '@chakra-ui/react'

const FilterModal = ({ isOpen, onClose, onApply, children }) => {
  const drawerSize = useBreakpointValue({ base: 'full', md: 'md' })

  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose} size={drawerSize}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>Filter</DrawerHeader>

        <DrawerBody>{children}</DrawerBody>

        <DrawerFooter borderTopWidth='1px'>
          <Button variant='outline' mr={3} onClick={onClose} colorScheme='gray'>
            Cancel
          </Button>
          <Button colorScheme='blue' onClick={onApply}>
            Apply Filter
          </Button>
          <Button variant='link' ml={3} color='blue.500'>
            Reset
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default FilterModal
