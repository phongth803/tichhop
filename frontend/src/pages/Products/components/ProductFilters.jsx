import { Box, VStack, Input, Select, HStack, Text, Checkbox, Button, Flex, Heading } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'

const ProductFilters = observer(({ localFilters, setLocalFilters, categories, onApply, onReset }) => {
  return (
    <Box bg='white' p={4} borderRadius='md' shadow='sm'>
      <Flex justify='space-between' align='center' mb={4}>
        <Heading size='sm'>Filters</Heading>
        <Button size='sm' colorScheme='gray' onClick={onReset}>
          Reset
        </Button>
      </Flex>

      <VStack spacing={4} align='stretch'>
        {/* Search */}
        <Box>
          <Text mb={2} fontWeight='medium'>
            Search
          </Text>
          <Input
            placeholder='Search products...'
            value={localFilters.search}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                search: e.target.value
              }))
            }
          />
        </Box>

        {/* Category */}
        <Box>
          <Text mb={2} fontWeight='medium'>
            Category
          </Text>
          <Select
            value={localFilters.category}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                category: e.target.value
              }))
            }
          >
            <option value=''>All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </Box>

        {/* Price Range */}
        <Box>
          <Text mb={2} fontWeight='medium'>
            Price Range
          </Text>
          <HStack spacing={2}>
            <Input
              type='number'
              placeholder='Min'
              value={localFilters.minPrice}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  minPrice: e.target.value
                }))
              }
              size='sm'
            />
            <Text>-</Text>
            <Input
              type='number'
              placeholder='Max'
              value={localFilters.maxPrice}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  maxPrice: e.target.value
                }))
              }
              size='sm'
            />
          </HStack>
        </Box>

        {/* Sale Items */}
        <Box>
          <Checkbox
            isChecked={localFilters.onSale}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                onSale: e.target.checked
              }))
            }
          >
            On Sale
          </Checkbox>
        </Box>

        <Button
          colorScheme='red'
          onClick={onApply}
          isDisabled={
            localFilters.minPrice &&
            localFilters.maxPrice &&
            Number(localFilters.minPrice) > Number(localFilters.maxPrice)
          }
        >
          Apply Filters
        </Button>
      </VStack>
    </Box>
  )
})

export default ProductFilters
