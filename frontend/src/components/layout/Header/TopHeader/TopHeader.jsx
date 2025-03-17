import { Box, Container, HStack, Center } from '@chakra-ui/react'
import { AnnouncementBar, LanguageSelector } from './components'

const TopHeader = () => {
  return (
    <Box bg='black' py={2}>
      <Container maxW='container.xl'>
        <HStack justify='space-between' align='center'>
          <Box flex={1}>
            <Center>
              <AnnouncementBar />
            </Center>
          </Box>
          <LanguageSelector />
        </HStack>
      </Container>
    </Box>
  )
}

export default TopHeader
