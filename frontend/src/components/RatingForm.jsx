import { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Textarea,
  Image,
  Box
} from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import { useStore } from '../stores/rootStore'
import { toast } from 'react-toastify'

const RatingForm = ({ isOpen, onClose, productId, productName, productImage, initialRating, initialReview }) => {
  const [rating, setRating] = useState(initialRating || 0)
  const [review, setReview] = useState(initialReview || '')
  const [hoveredRating, setHoveredRating] = useState(0)
  const { productStore, userOrderStore } = useStore()
  const { loadingStates } = productStore

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating || 0)
      setReview(initialReview || '')
    }
  }, [isOpen, initialRating, initialReview])

  const handleSubmit = async () => {
    try {
      await productStore.addRating(productId, { rating, review })
      await userOrderStore.fetchOrders()
      toast.success('Rating successfully')
      onClose()
    } catch (error) {
      toast.error('Error when rating')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Rating Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align='stretch'>
            <HStack spacing={4}>
              <Image src={productImage} alt={productName} boxSize='100px' objectFit='cover' borderRadius='md' />
              <VStack align='start'>
                <Text fontWeight='bold'>{productName}</Text>
              </VStack>
            </HStack>

            <Box>
              <Text mb={2}>Product quality:</Text>
              <HStack spacing={1}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    w={6}
                    h={6}
                    color={star <= (hoveredRating || rating) ? 'yellow.400' : 'gray.300'}
                    cursor='pointer'
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </HStack>
            </Box>

            <Box>
              <Text mb={2}>Your review:</Text>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder='Share your feedback about the product...'
                size='sm'
              />
            </Box>

            <Button
              colorScheme='red'
              onClick={handleSubmit}
              isDisabled={loadingStates.rating}
              isLoading={loadingStates.rating}
            >
              {initialRating ? 'Update rating' : 'Submit rating'}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default RatingForm
