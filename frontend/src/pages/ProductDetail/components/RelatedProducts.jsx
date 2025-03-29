import { Box, SimpleGrid } from '@chakra-ui/react'
import SectionHeader from '@/pages/Home/components/SectionHeader'
import ProductCard from '@/components/common/ProductCard'

const RelatedProducts = ({ products }) => {
  return (
    <Box>
      <SectionHeader label='Related Item' />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {products.map((product, idx) => (
          <ProductCard key={idx} {...product} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default RelatedProducts
