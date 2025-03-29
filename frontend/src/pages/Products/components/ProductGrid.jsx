import { Grid } from '@chakra-ui/react'
import ProductCard from '@/components/common/ProductCard'

const ProductGrid = ({ products }) => {
  return (
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(4, 1fr)'
      }}
      gap={6}
    >
      {products.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </Grid>
  )
}

export default ProductGrid
