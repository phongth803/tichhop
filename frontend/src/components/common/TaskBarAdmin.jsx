import { Flex, Heading, HStack, Button, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

const TaskBarAdmin = (props) => {
  const {
    title,
    isFilter,
    isAdd,
    handleOpenFilter,
    handleAdd,
    buttonText,
    searchPlaceholder,
    searchValue,
    onSearchChange
  } = props

  return (
    <Flex justify='space-between' align='center' mb={4}>
      <Heading size='lg'>{title}</Heading>
      <HStack spacing={4}>
        <InputGroup maxW='300px'>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray.400' />
          </InputLeftElement>
          <Input
            placeholder={searchPlaceholder || 'Search...'}
            value={searchValue}
            onChange={onSearchChange}
            borderRadius='md'
            _focus={{
              borderColor: 'purple.500',
              boxShadow: '0 0 0 1px purple.500'
            }}
          />
        </InputGroup>
        {isFilter && (
          <Button minW='80px' onClick={handleOpenFilter}>
            Filter
          </Button>
        )}
        {isAdd && (
          <Button colorScheme='purple' minW='120px' onClick={handleAdd}>
            {buttonText || 'Add'}
          </Button>
        )}
      </HStack>
    </Flex>
  )
}

export default TaskBarAdmin
