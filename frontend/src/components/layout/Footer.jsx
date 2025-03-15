import { Box, Container, Stack, Text, Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const Footer = () => {
  return (
    <Box as="footer" bg="gray.50" borderTop="1px" borderColor="gray.200" py={4}>
      <Container maxW="container.xl">
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify="space-between" align="center">
          <Text>&copy; 2024 Your Shop. All rights reserved.</Text>
          <Stack direction="row" spacing={6}>
            <Link as={RouterLink} to="/about">
              About
            </Link>
            <Link as={RouterLink} to="/contact">
              Contact
            </Link>
            <Link as={RouterLink} to="/privacy">
              Privacy
            </Link>
            <Link as={RouterLink} to="/terms">
              Terms
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
