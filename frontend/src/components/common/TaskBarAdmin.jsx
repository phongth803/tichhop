import { Flex, Heading, HStack, Button } from '@chakra-ui/react'

const TaskBarAdmin = (props) => {
  const { title, isFilter, isAdd, handleFilter, handleAdd, buttonText } = props
  return (
    <Flex justify='space-between' align='center' mb={4}>
      <Heading size='lg'>{title}</Heading>
      <HStack spacing={4}>
        {isFilter && <Button onClick={handleFilter}>Filter</Button>}
        {isAdd && (
          <Button colorScheme='purple' onClick={handleAdd}>
            {buttonText || 'Add'}
          </Button>
        )}
      </HStack>
    </Flex>
  )
}

export default TaskBarAdmin
