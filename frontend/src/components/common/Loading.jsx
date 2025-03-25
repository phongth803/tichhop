import { Flex, Spinner, Text } from '@chakra-ui/react'

const Loading = ({ text = 'Loading...' }) => {
  return (
    <Flex direction='column' align='center' justify='center' minH='200px' gap={4}>
      <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      <Text fontSize='lg' color='gray.600'>
        {text}
      </Text>
    </Flex>
  )
}

export default Loading
