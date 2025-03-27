import { Flex, Button } from '@chakra-ui/react'

const ViewAllButton = ({ onClick }) => (
  <Flex justify='center' mt={8}>
    <Button
      size='lg'
      bg='red.500'
      color='white'
      px={8}
      py={3}
      fontSize='md'
      rounded='md'
      _hover={{ bg: 'red.600' }}
      onClick={onClick}
    >
      View All Products
    </Button>
  </Flex>
)

export default ViewAllButton
