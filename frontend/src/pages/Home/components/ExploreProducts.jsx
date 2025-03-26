import { observer } from 'mobx-react-lite'
import { Box, Grid } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '@/components/common/ProductCard'
import SectionHeader from '../components/SectionHeader'
import ViewAllButton from '../components/ViewAllButton'
import NavigationButtons from '../components/NavigationButtons'

const ExploreProducts = observer(({ products, currentIndex, onPrev, onNext }) => {
  const navigate = useNavigate()
  if (!products?.length) return null

  return (
    <Box py={8}>
      <SectionHeader label='Our Products' title='Explore Our Products'>
        <NavigationButtons onPrev={onPrev} onNext={onNext} />
      </SectionHeader>

      <Box overflow='hidden' mx={-4}>
        <Box
          display='flex'
          width={`${Math.ceil(products.length / 8) * 100}%`}
          transform={`translateX(-${(currentIndex * 100) / Math.ceil(products.length / 8)}%)`}
          transition='transform 0.5s ease-in-out'
        >
          {Array.from({ length: Math.ceil(products.length / 8) }).map((_, pageIndex) => (
            <Box key={pageIndex} width={`${100 / Math.ceil(products.length / 8)}%`} px={4}>
              <Grid templateColumns='repeat(4, 1fr)' templateRows='repeat(2, 1fr)' gap={6}>
                {products.slice(pageIndex * 8, (pageIndex + 1) * 8).map((product) => (
                  <ProductCard key={product._id} {...product} />
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      </Box>

      {/* View All Button */}
      <ViewAllButton onClick={() => navigate('/products')} />
    </Box>
  )
})

export default ExploreProducts
