import { Flex, Heading, HStack, Button, Input, InputGroup, InputLeftElement, VStack } from '@chakra-ui/react'
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
    onSearchChange,
    isMobile
  } = props

  const ActionButtons = () => (
    <HStack spacing={2} width={{ base: '100%', md: 'auto' }} justify={{ base: 'flex-end', md: 'flex-start' }}>
      {isFilter && (
        <Button minW={{ base: '70px', md: '80px' }} size={{ base: 'sm', md: 'md' }} onClick={handleOpenFilter}>
          Filter
        </Button>
      )}
      {isAdd && (
        <Button
          colorScheme='purple'
          minW={{ base: '100px', md: '120px' }}
          size={{ base: 'sm', md: 'md' }}
          onClick={handleAdd}
        >
          {buttonText || 'Add'}
        </Button>
      )}
    </HStack>
  )

  if (isMobile) {
    return (
      <VStack spacing={4} align='stretch' mb={4} px={2}>
        <Flex justify='space-between' align='center'>
          <Heading size='lg'>{title}</Heading>
          <ActionButtons />
        </Flex>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray.400' />
          </InputLeftElement>
          <Input
            placeholder={searchPlaceholder || 'Search...'}
            value={searchValue}
            onChange={onSearchChange}
            borderRadius='md'
            size='md'
            _focus={{
              borderColor: 'purple.500',
              boxShadow: '0 0 0 1px purple.500'
            }}
          />
        </InputGroup>
      </VStack>
    )
  }

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
        <ActionButtons />
      </HStack>
    </Flex>
  )
}

export default TaskBarAdmin
