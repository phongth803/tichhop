import React, { useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  HStack,
  VStack,
  Card,
  CardBody,
  IconButton
} from '@chakra-ui/react'
import { StarIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/rootStore'
import { format } from 'date-fns'
import RatingForm from '@/components/RatingForm'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '@/components/common/Loading'

const MyReviews = observer(() => {
  const { productStore } = useStore()
  const [selectedProduct, setSelectedProduct] = React.useState(null)
  const [isRatingModalOpen, setIsRatingModalOpen] = React.useState(false)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      await productStore.fetchMyRatings()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (ratingId) => {
    try {
      await productStore.deleteRating(ratingId)
      toast.success('Review deleted successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (rating) => {
    setSelectedProduct({
      _id: rating.product._id,
      name: rating.product.name,
      thumbnail: rating.product.thumbnail,
      ratings: [rating] // Include the current rating
    })
    setIsRatingModalOpen(true)
  }

  const renderStars = (rating) => (
    <HStack spacing={1}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} w={4} h={4} color={star <= rating ? 'yellow.400' : 'gray.300'} />
      ))}
    </HStack>
  )

  if (productStore.loadingStates.myRatings) {
    return <Loading text='Loading reviews...' />
  }

  return (
    <Container maxW='container.xl' py={8}>
      <Heading mb={6}>My Reviews</Heading>
      {productStore.myRatings.length === 0 ? (
        <Text>You haven't written any reviews yet.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {productStore.myRatings.map((rating) => (
            <Card key={rating._id}>
              <CardBody>
                <HStack spacing={4} align='start'>
                  <Box width='100px' height='100px'>
                    <Image
                      src={rating.product?.thumbnail}
                      alt={rating.product?.name}
                      width='100%'
                      height='100%'
                      objectFit='cover'
                      borderRadius='md'
                    />
                  </Box>
                  <VStack align='start' flex={1} spacing={2}>
                    <Link to={`/product/${rating.product?._id}`}>
                      <Heading size='sm' noOfLines={2}>
                        {rating.product?.name || 'Product not available'}
                      </Heading>
                    </Link>
                    {renderStars(rating.rating)}
                    <Text fontSize='sm' color='gray.600' noOfLines={3}>
                      {rating.review}
                    </Text>
                    <Text fontSize='xs' color='gray.500'>
                      {format(new Date(rating.createdAt), 'MMM d, yyyy')}
                    </Text>
                    <HStack spacing={2}>
                      <IconButton size='sm' icon={<EditIcon />} onClick={() => handleEdit(rating)} />
                      <IconButton
                        size='sm'
                        colorScheme='red'
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(rating._id)}
                      />
                    </HStack>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {selectedProduct && (
        <RatingForm
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false)
            setSelectedProduct(null)
            loadReviews()
          }}
          productId={selectedProduct._id}
          productName={selectedProduct.name}
          productImage={selectedProduct.thumbnail}
          initialRating={selectedProduct.ratings[0].rating}
          initialReview={selectedProduct.ratings[0].review}
        />
      )}
    </Container>
  )
})

export default MyReviews
