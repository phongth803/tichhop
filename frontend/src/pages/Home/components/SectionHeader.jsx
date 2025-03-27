import { Flex, Box, Text } from '@chakra-ui/react'

const SectionHeader = ({ label, title, children }) => (
  <Flex justify='space-between' align='center' mb={8}>
    <Box>
      <Flex align='center' gap={2} mb={1}>
        <Box w='16px' h='32px' bg='red.500' borderRadius='4px' />
        <Text color='red.500' fontSize='16px' fontWeight='700'>
          {label}
        </Text>
      </Flex>
      <Text fontSize='36px' fontWeight='600' lineHeight='48px'>
        {title}
      </Text>
    </Box>
    {children}
  </Flex>
)

export default SectionHeader
