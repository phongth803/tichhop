import { Box, Flex } from '@chakra-ui/react'

import SectionHeader from './SectionHeader'
import CountdownTimer from './CountdownTimer'
import NavigationButtons from './NavigationButtons'
import ProductSlider from './ProductSlider'
import ProductCard from '@/components/common/ProductCard'

const FlashSales = ({ countdown, flashSaleProducts, currentIndex, handlePrev, handleNext, handleViewAll }) => {
  return (
    <Box py={8}>
      <Flex justify='space-between' align='center'>
        <Flex align='center' gap={16}>
          <SectionHeader label="Today's" title='Flash Sales' />
          <CountdownTimer
            days={countdown.days}
            hours={countdown.hours}
            minutes={countdown.minutes}
            seconds={countdown.seconds}
          />
        </Flex>
        <NavigationButtons onPrev={() => handlePrev('flashSale')} onNext={() => handleNext('flashSale')} />
      </Flex>

      <ProductSlider
        products={flashSaleProducts}
        currentIndex={currentIndex}
        itemsPerPage={4}
        renderItem={(product) => <ProductCard {...product} />}
      />
    </Box>
  )
}

export default FlashSales
