import { Flex, VStack, Heading, Text, Select, Button, HStack } from '@chakra-ui/react'
import { FiFilter } from 'react-icons/fi'

const ProductListHeader = ({ totalProducts, filters, onSortChange, onOpenFilters, isMobile }) => {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justify='space-between'
      align={{ base: 'stretch', md: 'center' }}
      gap={4}
    >
      <VStack align='flex-start' spacing={1}>
        <Heading size='lg'>All Products</Heading>
        <Text color='gray.600'>
          {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
        </Text>
      </VStack>

      <HStack spacing={2}>
        {isMobile && (
          <Button leftIcon={<FiFilter />} onClick={onOpenFilters} variant='outline'>
            Filters
          </Button>
        )}
        <Select value={filters.sort} onChange={(e) => onSortChange(e.target.value)} w='200px'>
          <option value='newest'>Newest</option>
          <option value='price-asc'>Price: Low to High</option>
          <option value='price-desc'>Price: High to Low</option>
        </Select>
      </HStack>
    </Flex>
  )
}

export default ProductListHeader
