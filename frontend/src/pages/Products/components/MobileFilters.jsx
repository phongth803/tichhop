import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react'
import ProductFilters from './ProductFilters'

const MobileFilters = ({ isOpen, onClose, localFilters, setLocalFilters, categories, onReset }) => {
  const handleImmediateFilterChange = (newFilters) => {
    setLocalFilters(newFilters)
    onClose()
  }

  const handleDebouncedFilterChange = (newFilters) => {
    setLocalFilters(newFilters)
  }

  const handleResetMobile = () => {
    onReset()
    onClose()
  }

  return (
    <Drawer isOpen={isOpen} placement='left' onClose={onClose} size='sm'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody py={8}>
          <ProductFilters
            localFilters={localFilters}
            setLocalFilters={handleDebouncedFilterChange}
            onImmediateChange={handleImmediateFilterChange}
            categories={categories}
            onReset={handleResetMobile}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileFilters
