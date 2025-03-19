import React from 'react'
import { Box, Heading, Text, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Box textAlign='center' py={20} px={6}>
      <Heading display='inline-block' size='4xl' mb={4}>
        404 Not Found
      </Heading>
      <Text fontSize='lg' mb={6}>
        Your visited page not found. You may go home page.
      </Text>
      <Button colorScheme='red' onClick={() => navigate('/')}>
        Back to home page
      </Button>
    </Box>
  )
}

export default NotFound
