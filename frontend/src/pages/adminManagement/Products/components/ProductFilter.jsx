import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  VStack,
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Switch,
  Input
} from '@chakra-ui/react'

const ProductFilter = ({ isOpen, onClose, onFilter, currentFilters, categories }) => {
  const handleFilterChange = (type, value) => {
    const newFilters = { ...currentFilters, [type]: value }
    onFilter(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      category: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      onSale: false,
      sort: 'newest'
    }
    onFilter(resetFilters)
    onClose()
  }

  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose} size={{ base: 'full', md: 'sm' }}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>Filter Products</DrawerHeader>

        <DrawerBody>
          <Stack spacing={6} py={4}>
            {/* Sort Options */}
            <FormControl>
              <FormLabel fontWeight='bold'>Sort By</FormLabel>
              <Select
                value={currentFilters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                size={{ base: 'lg', md: 'md' }}
              >
                <option value='newest'>Newest</option>
                <option value='price-asc'>Price: Low to High</option>
                <option value='price-desc'>Price: High to Low</option>
              </Select>
            </FormControl>

            {/* Category Filter */}
            <FormControl>
              <FormLabel fontWeight='bold'>Category</FormLabel>
              <Select
                value={currentFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                size={{ base: 'lg', md: 'md' }}
              >
                <option value=''>All Categories</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl>
              <FormLabel fontWeight='bold'>Status</FormLabel>
              <Select
                value={currentFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                size={{ base: 'lg', md: 'md' }}
              >
                <option value=''>All Status</option>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </Select>
            </FormControl>

            {/* Price Range Filter */}
            <FormControl>
              <FormLabel fontWeight='bold'>Price Range</FormLabel>
              <VStack spacing={2} w='100%'>
                <Input
                  type='number'
                  placeholder='Min Price'
                  value={currentFilters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  min={0}
                  size={{ base: 'lg', md: 'md' }}
                />
                <Input
                  type='number'
                  placeholder='Max Price'
                  value={currentFilters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  min={0}
                  size={{ base: 'lg', md: 'md' }}
                />
              </VStack>
            </FormControl>

            {/* On Sale Filter */}
            <FormControl>
              <FormLabel fontWeight='bold'>On Sale</FormLabel>
              <Switch
                isChecked={currentFilters.onSale}
                onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                size={{ base: 'lg', md: 'md' }}
              />
            </FormControl>

            <Flex justify='space-between' mt={4} w='100%'>
              <Button colorScheme='gray' onClick={onClose} size={{ base: 'lg', md: 'md' }}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleReset} size={{ base: 'lg', md: 'md' }}>
                Reset Filters
              </Button>
            </Flex>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default ProductFilter
