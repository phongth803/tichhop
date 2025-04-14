import { Box, VStack, HStack, Text, Divider, Avatar, Icon } from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'

const ProductReviews = ({ ratings }) => {
  if (!ratings || ratings.length === 0) {
    return (
      <Box mt={8}>
        <Text fontSize='lg' fontWeight='medium' mb={4}>
          Reviews
        </Text>
        <Text color='gray.500'>No reviews yet</Text>
      </Box>
    )
  }

  return (
    <Box mt={8}>
      <Text fontSize='lg' fontWeight='medium' mb={4}>
        Reviews ({ratings.length})
      </Text>
      <VStack spacing={6} align='stretch'>
        {ratings.map((rating, index) => (
          <Box key={index}>
            <HStack spacing={2} mb={2}>
              <Avatar size='sm' name={`${rating.user.firstName} ${rating.user.lastName}`} bg='blue.500' color='white' />
              <Box>
                <Text fontWeight='medium'>
                  {rating.user.firstName} {rating.user.lastName}
                </Text>
                <HStack spacing={1}>
                  {Array(5)
                    .fill('')
                    .map((_, i) => (
                      <Icon key={i} as={FaStar} color={i < rating.rating ? 'orange.400' : 'gray.300'} boxSize={3} />
                    ))}
                </HStack>
              </Box>
              <Text color='gray.500' fontSize='sm'>
                {new Date(rating.createdAt).toLocaleDateString()}
              </Text>
            </HStack>
            {rating.review && (
              <Text color='gray.600' mt={2}>
                {rating.review}
              </Text>
            )}
            {index < ratings.length - 1 && <Divider mt={4} />}
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default ProductReviews
