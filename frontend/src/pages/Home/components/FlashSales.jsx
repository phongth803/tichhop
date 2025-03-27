import { Box, Flex } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

import { ITEMS_PER_PAGE } from '../constants/home'
import SectionHeader from './SectionHeader'
import CountdownTimer from './CountdownTimer'
import NavigationButtons from './NavigationButtons'
import ProductCard from '@/components/common/ProductCard'
import ViewAllButton from './ViewAllButton'

const FlashSales = ({ countdown, flashSaleProducts, currentIndex, handlePrev, handleNext }) => {
  const navigate = useNavigate()
  const itemsPerPage = ITEMS_PER_PAGE.FLASH_SALE

  if (!flashSaleProducts?.length) return null

  return (
    <Box py={8}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify='space-between'
        align={{ base: 'flex-start', md: 'center' }}
      >
        <SectionHeader label="Today's" title='Flash Sales' />
        <Flex align='center' gap={4} mt={{ base: 4, md: 0 }}>
          <CountdownTimer {...countdown} />
          <NavigationButtons onPrev={() => handlePrev('flashSale')} onNext={() => handleNext('flashSale')} />
        </Flex>
      </Flex>

      <Box overflow='hidden' mx={{ base: -2, md: -4 }}>
        <Box
          display='flex'
          width={`${Math.ceil(flashSaleProducts.length / itemsPerPage) * 100}%`}
          transform={`translateX(-${(currentIndex * 100) / Math.ceil(flashSaleProducts.length / itemsPerPage)}%)`}
          transition='transform 0.5s ease-in-out'
        >
          {Array.from({ length: Math.ceil(flashSaleProducts.length / itemsPerPage) }).map((_, pageIndex) => (
            <Box
              key={pageIndex}
              width={`${100 / Math.ceil(flashSaleProducts.length / itemsPerPage)}%`}
              px={{ base: 2, md: 4 }}
            >
              <Flex gap={{ base: 2, md: 6 }} flexDir={{ base: 'column', sm: 'row' }}>
                {flashSaleProducts.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((product) => (
                  <Box key={product._id} flex={1}>
                    <ProductCard {...product} />
                  </Box>
                ))}
              </Flex>
            </Box>
          ))}
        </Box>
      </Box>
      <ViewAllButton onClick={() => navigate('/products')} />
    </Box>
  )
}

export default FlashSales
