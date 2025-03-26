import { Flex, Box, Text } from '@chakra-ui/react'

const CountdownTimer = (props) => {
  const { days, hours, minutes, seconds } = props

  const timeUnits = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds }
  ]

  return (
    <Flex gap={4} mb={2}>
      {timeUnits.map((unit, index) => (
        <Box key={`${unit.label}-${index}`} display='flex' alignItems='center'>
          <Box>
            <Text color='black' fontSize='12px' fontWeight='600' mb={1}>
              {unit.label}
            </Text>
            <Text fontSize='32px' fontWeight='700' lineHeight='1'>
              {String(unit.value).padStart(2, '0')}
            </Text>
          </Box>
          {index < timeUnits.length - 1 && (
            <Text fontSize='32px' fontWeight='600' color='red.500' mt={3} ml={4}>
              :
            </Text>
          )}
        </Box>
      ))}
    </Flex>
  )
}
export default CountdownTimer
