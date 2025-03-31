import { Box, VStack, Input, Select, HStack, Text, Checkbox, Button, Flex, Heading } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'

const ProductFilters = observer(({ localFilters, setLocalFilters, onImmediateChange, categories, onReset }) => {
  const handleDebouncedChange = (key, value) => {
    const newFilters = {
      ...localFilters,
      [key]: value
    }
    setLocalFilters(newFilters)
  }

  const handleImmediateChange = (key, value) => {
    const newFilters = {
      ...localFilters,
      [key]: value
    }
    if (onImmediateChange) {
      onImmediateChange(newFilters)
    } else {
      setLocalFilters(newFilters)
    }
  }

  return (
    <Box bg='white' p={4} borderRadius='md' shadow='sm'>
      <Flex justify='space-between' align='center' mb={4}>
        <Heading size='sm'>Filters</Heading>
        <Button size='sm' colorScheme='gray' onClick={onReset}>
          Reset
        </Button>
      </Flex>

      <VStack spacing={4} align='stretch'>
        <Box>
          <Text mb={2} fontWeight='medium'>
            Search
          </Text>
          <Input
            placeholder='Search products...'
            value={localFilters.search}
            onChange={(e) => handleDebouncedChange('search', e.target.value)}
          />
        </Box>

        <Box>
          <Text mb={2} fontWeight='medium'>
            Category
          </Text>
          <Select value={localFilters.category} onChange={(e) => handleImmediateChange('category', e.target.value)}>
            <option value=''>All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </Box>

        <Box>
          <Text mb={2} fontWeight='medium'>
            Price Range
          </Text>
          <HStack spacing={2}>
            <Input
              type='number'
              placeholder='Min'
              value={localFilters.minPrice}
              onChange={(e) => handleDebouncedChange('minPrice', e.target.value)}
              size='sm'
            />
            <Text>-</Text>
            <Input
              type='number'
              placeholder='Max'
              value={localFilters.maxPrice}
              onChange={(e) => handleDebouncedChange('maxPrice', e.target.value)}
              size='sm'
            />
          </HStack>
        </Box>

        <Box>
          <Checkbox isChecked={localFilters.onSale} onChange={(e) => handleImmediateChange('onSale', e.target.checked)}>
            On Sale
          </Checkbox>
        </Box>
      </VStack>
    </Box>
  )
})

export default ProductFilters
