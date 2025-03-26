import { Box, Text } from '@chakra-ui/react'
import SectionHeader from './SectionHeader'
import NavigationButtons from './NavigationButtons'
import { ITEMS_PER_PAGE } from '../constants/home'

const Categories = ({ currentIndex, handlePrev, handleNext, categories }) => {
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE.CATEGORIES)

  return (
    <Box py={8}>
      <SectionHeader label='Categories' title='Browse By Category'>
        <NavigationButtons onPrev={() => handlePrev('categories')} onNext={() => handleNext('categories')} />
      </SectionHeader>

      <Box overflow='hidden'>
        <Box
          display='flex'
          width={`${totalPages * 100}%`}
          transform={`translateX(-${(currentIndex * 100) / totalPages}%)`}
          transition='transform 0.5s ease-in-out'
        >
          {categories.map((cat, idx) => (
            <Box key={idx} width={`${100 / ITEMS_PER_PAGE.CATEGORIES}%`} px={3}>
              <Box
                p={8}
                border='1px solid'
                borderColor='gray.200'
                borderRadius='md'
                bg='white'
                textAlign='center'
                cursor='pointer'
                transition='all 0.3s'
                _hover={{
                  borderColor: 'red.500',
                  bg: 'red.500',
                  color: 'white'
                }}
              >
                <cat.icon size={40} style={{ margin: '0 auto 12px' }} />
                <Text fontSize='md'>{cat.name}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default Categories
