import { Box, Icon, Heading, Text } from '@chakra-ui/react'

const StatCard = ({ icon, number, text, bgColor = 'white' }) => (
  <Box p={8} bg={bgColor} borderRadius='xl' shadow='lg' textAlign='center'>
    <Icon as={icon} boxSize={12} mb={4} color={bgColor === 'white' ? 'black' : 'white'} />
    <Heading size='xl' mb={2} color={bgColor === 'white' ? 'black' : 'white'}>
      {number}
    </Heading>
    <Text color={bgColor === 'white' ? 'gray.600' : 'white'}>{text}</Text>
  </Box>
)

export default StatCard
