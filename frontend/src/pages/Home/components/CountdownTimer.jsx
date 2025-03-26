import { Flex, Box, Text } from '@chakra-ui/react'

const CountdownTimer = ({ days, hours, minutes, seconds }) => (
  <Flex gap={4} mb={2}>
    <Box>
      <Text color='black' fontSize='12px' fontWeight='600' mb={1}>
        Days
      </Text>
      <Text fontSize='32px' fontWeight='700' lineHeight='1'>
        {String(days).padStart(2, '0')}
      </Text>
    </Box>
    <Text fontSize='32px' fontWeight='600' color='red.500' mt={3}>
      :
    </Text>
    <Box>
      <Text color='black' fontSize='12px' fontWeight='600' mb={1}>
        Hours
      </Text>
      <Text fontSize='32px' fontWeight='700' lineHeight='1'>
        {String(hours).padStart(2, '0')}
      </Text>
    </Box>
    <Text fontSize='32px' fontWeight='600' color='red.500' mt={3}>
      :
    </Text>
    <Box>
      <Text color='black' fontSize='12px' fontWeight='600' mb={1}>
        Minutes
      </Text>
      <Text fontSize='32px' fontWeight='700' lineHeight='1'>
        {String(minutes).padStart(2, '0')}
      </Text>
    </Box>
    <Text fontSize='32px' fontWeight='600' color='red.500' mt={3}>
      :
    </Text>
    <Box>
      <Text color='black' fontSize='12px' fontWeight='600' mb={1}>
        Seconds
      </Text>
      <Text fontSize='32px' fontWeight='700' lineHeight='1'>
        {String(seconds).padStart(2, '0')}
      </Text>
    </Box>
  </Flex>
)

export default CountdownTimer
