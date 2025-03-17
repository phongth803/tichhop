import { InputGroup, Input, InputRightElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

const SearchBar = () => {
  return (
    <InputGroup size='md' w='250px'>
      <Input
        placeholder='What are you looking for?'
        bg='gray.50'
        borderRadius='4px'
        fontSize='sm'
        pl={4}
        height='40px'
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
        <SearchIcon color='gray.700' w={4} h={4} cursor='pointer' />
      </InputRightElement>
    </InputGroup>
  )
}

export default SearchBar
