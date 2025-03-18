import { Box, Container, HStack } from '@chakra-ui/react'
import { Logo, Navigation, SearchBar, ActionButtons } from './components'

const MainHeader = () => {
  return (
    <Box py={4} borderBottom='1px' borderColor='gray.200' bg='white'>
      <Container maxW='container.xl'>
        <HStack justify='space-between' align='center' spacing={8}>
          <Logo />
          <Navigation />
          <HStack spacing={6}>
            <SearchBar />
            <ActionButtons />
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}

export default MainHeader
