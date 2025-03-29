import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react'
import ProductFilters from './ProductFilters'

const MobileFilters = ({ isOpen, onClose, localFilters, setLocalFilters, categories, onApply, onReset }) => {
  return (
    <Drawer isOpen={isOpen} placement='left' onClose={onClose} size='sm'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filters</DrawerHeader>
        <DrawerBody>
          <ProductFilters
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            categories={categories}
            onApply={onApply}
            onReset={onReset}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileFilters
