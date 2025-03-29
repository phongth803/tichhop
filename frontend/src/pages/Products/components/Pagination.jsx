import { Flex, HStack, Button, Text } from '@chakra-ui/react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Flex justify='center' mt={12}>
      <HStack spacing={2}>
        <Button
          colorScheme='red'
          variant='outline'
          isDisabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>

        {[...Array(totalPages)].map((_, i) => {
          if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage + 2)) {
            return (
              <Button
                key={i}
                colorScheme='red'
                variant={currentPage === i + 1 ? 'solid' : 'outline'}
                onClick={() => onPageChange(i + 1)}
              >
                {i + 1}
              </Button>
            )
          } else if (i === currentPage - 3 || i === currentPage + 3) {
            return (
              <Text key={i} px={2}>
                ...
              </Text>
            )
          }
          return null
        })}

        <Button
          colorScheme='red'
          variant='outline'
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </HStack>
    </Flex>
  )
}

export default Pagination
