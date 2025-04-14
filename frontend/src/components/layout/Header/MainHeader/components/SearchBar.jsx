import {
  InputGroup,
  Input,
  InputRightElement,
  Box,
  VStack,
  Text,
  useDisclosure,
  useOutsideClick
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useState, useRef, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useNavigate } from 'react-router-dom'
import ProductCard from '@/components/common/ProductCard'
import Loading from '@/components/common/Loading'
import { getProducts } from '@/apis/products'

const SearchBar = ({ isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [totalSuggestions, setTotalSuggestions] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const ref = useRef()
  const navigate = useNavigate()

  useOutsideClick({
    ref: ref,
    handler: () => {
      onClose()
      setSearchTerm('')
    }
  })

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearchTerm) {
        setSuggestions([])
        setTotalSuggestions(0)
        return
      }

      setIsLoading(true)
      try {
        const response = await getProducts({
          search: debouncedSearchTerm,
          limit: 5,
          page: 1
        })
        setSuggestions(response.data.products)
        setTotalSuggestions(response.data.pagination.totalItems)
      } catch (error) {
        console.error('Error fetching search suggestions:', error)
        setSuggestions([])
        setTotalSuggestions(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedSearchTerm])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    if (e.target.value) {
      onOpen()
    } else {
      onClose()
    }
  }

  const handleViewAll = () => {
    navigate(`/products?search=${searchTerm}`)
    onClose()
    setSearchTerm('')
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
    onClose()
    setSearchTerm('')
  }

  return (
    <Box ref={ref} position='relative' w={isMobile ? '100%' : '400px'}>
      <InputGroup size='md'>
        <Input
          placeholder='What are you looking for?'
          bg='gray.50'
          borderRadius='4px'
          fontSize='sm'
          pl={4}
          height='40px'
          value={searchTerm}
          onChange={handleSearch}
          _placeholder={{
            color: 'gray.500',
            fontSize: '14px'
          }}
          border='none'
          _hover={{
            bg: 'gray.100'
          }}
          _focus={{
            bg: 'gray.100',
            boxShadow: 'none'
          }}
        />
        <InputRightElement h='40px'>
          <SearchIcon color='gray.700' w={4} h={4} cursor='pointer' onClick={handleViewAll} />
        </InputRightElement>
      </InputGroup>

      {isOpen && debouncedSearchTerm && (
        <Box
          position='absolute'
          top='100%'
          left={0}
          right={0}
          mt={2}
          bg='white'
          borderRadius='md'
          boxShadow='lg'
          zIndex={1000}
          maxH='400px'
          overflowY='auto'
        >
          <VStack spacing={2} p={4} align='stretch'>
            {isLoading ? (
              <Loading size='sm' />
            ) : suggestions.length > 0 ? (
              <>
                {suggestions.map((product) => (
                  <Box
                    key={product._id}
                    cursor='pointer'
                    onClick={() => handleProductClick(product._id)}
                    _hover={{ bg: 'gray.50' }}
                    p={2}
                    borderRadius='md'
                  >
                    <ProductCard {...product} />
                  </Box>
                ))}
                {totalSuggestions > 5 && (
                  <Text
                    color='red.500'
                    cursor='pointer'
                    textAlign='center'
                    onClick={handleViewAll}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    View All
                  </Text>
                )}
              </>
            ) : (
              <Text color='gray.500' textAlign='center' py={4}>
                No products found matching "{debouncedSearchTerm}"
              </Text>
            )}
          </VStack>
        </Box>
      )}
    </Box>
  )
}

export default SearchBar
