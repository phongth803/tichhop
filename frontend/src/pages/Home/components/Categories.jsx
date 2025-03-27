import { Box, Text } from '@chakra-ui/react'
import { FiBook, FiMusic, FiGift, FiHeart, FiMonitor, FiPackage } from 'react-icons/fi'
import { ITEMS_PER_PAGE } from '../constants/home'
import SectionHeader from './SectionHeader'
import NavigationButtons from './NavigationButtons'

// Map các từ khóa cơ bản
const CATEGORY_ICONS = {
  book: FiBook,
  music: FiMusic,
  toy: FiGift,
  health: FiHeart,
  game: FiMonitor
}

// Hàm tự động tìm icon dựa theo tên category
const getIconComponent = (categoryName) => {
  // Chuyển tên thành chữ thường và bỏ dấu
  const normalizedName = categoryName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  // Tìm keyword phù hợp trong tên category
  const matchedKey = Object.keys(CATEGORY_ICONS).find((key) => normalizedName.includes(key))

  // Trả về icon tương ứng hoặc icon mặc định
  return matchedKey ? CATEGORY_ICONS[matchedKey] : FiPackage
}

const Categories = ({ currentIndex, handlePrev, handleNext, categories }) => {
  const itemsPerPage = ITEMS_PER_PAGE.CATEGORIES

  if (!categories?.length) return null

  return (
    <Box py={8}>
      <SectionHeader label='Categories' title='Browse By Category'>
        <Box display={{ base: 'none', md: 'block' }}>
          <NavigationButtons onPrev={() => handlePrev('categories')} onNext={() => handleNext('categories')} />
        </Box>
      </SectionHeader>

      <Box overflow='hidden' mx={{ base: -2, md: -4 }}>
        <Box
          display='flex'
          width={`${Math.ceil(categories.length / itemsPerPage) * 100}%`}
          transform={`translateX(-${(currentIndex * 100) / Math.ceil(categories.length / itemsPerPage)}%)`}
          transition='transform 0.5s ease-in-out'
        >
          {Array.from({ length: Math.ceil(categories.length / itemsPerPage) }).map((_, pageIndex) => (
            <Box
              key={pageIndex}
              width={`${100 / Math.ceil(categories.length / itemsPerPage)}%`}
              px={{ base: 2, md: 4 }}
            >
              <Box
                display='grid'
                gridTemplateColumns={{
                  base: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                  lg: 'repeat(6, 1fr)'
                }}
                gap={{ base: 2, md: 4 }}
              >
                {categories.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((cat) => {
                  const IconComponent = getIconComponent(cat.name)
                  return (
                    <Box key={cat._id}>
                      <Box
                        p={4}
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
                        <IconComponent size={40} style={{ margin: '0 auto 12px' }} />
                        <Text fontSize='md'>{cat.name}</Text>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default Categories
