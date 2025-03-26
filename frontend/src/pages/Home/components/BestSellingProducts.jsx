import { observer } from 'mobx-react-lite'
import { Box, Grid } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '@/components/common/ProductCard'
import SectionHeader from '../components/SectionHeader'
import ViewAllButton from '../components/ViewAllButton'

const BestSellingProducts = observer(({ products }) => {
  const navigate = useNavigate()
  if (!products?.length) return null

  return (
    <Box py={8}>
      <SectionHeader label='This Month' title='Best Selling Products' />

      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        }}
        gap={{ base: 4, md: 6 }}
      >
        {products.map((product) => (
          <ProductCard key={product._id} {...product} />
        ))}
      </Grid>
    </Box>
  )
})

export default BestSellingProducts
