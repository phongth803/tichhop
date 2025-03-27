import { Box } from '@chakra-ui/react'

const ProductSlider = ({ products, currentIndex, itemsPerPage = 4, renderItem }) => {
  if (!products?.length) return null

  return (
    <Box overflow='hidden' mx={-4}>
      <Box
        display='flex'
        width={`${Math.ceil(products.length / itemsPerPage) * 100}%`}
        transform={`translateX(-${(currentIndex * 100) / Math.ceil(products.length / itemsPerPage)}%)`}
        transition='transform 0.5s ease-in-out'
      >
        {products.map((item, index) => (
          <Box key={item._id || index} width={`${(100 / products.length) * itemsPerPage}%`} px={4}>
            {renderItem(item)}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ProductSlider
