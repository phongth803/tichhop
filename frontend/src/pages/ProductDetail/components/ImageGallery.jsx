import {
  Box,
  Image,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  useDisclosure
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import NavigationButton from './NavigationButton'

const ImageGallery = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found'
  }

  return (
    <Box>
      {/* Main Image Container */}
      <Box position='relative' bg='white' borderRadius='xl' overflow='hidden' h='500px'>
        <Box
          className='image-container'
          position='absolute'
          height='100%'
          display='flex'
          transition='transform 0.3s ease'
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${currentImageIndex * (100 / images.length)}%)`
          }}
        >
          {images.map((image, idx) => (
            <Box
              key={idx}
              width={`${100 / images.length}%`}
              height='100%'
              flexShrink={0}
              display='flex'
              alignItems='center'
              justifyContent='center'
              cursor='zoom-in'
              onClick={onOpen}
            >
              <Image
                src={image}
                alt={`Product image ${idx + 1}`}
                maxW='100%'
                maxH='100%'
                objectFit='contain'
                loading='lazy'
                onError={handleImageError}
              />
            </Box>
          ))}
        </Box>

        {images.length >= 1 && (
          <>
            <NavigationButton direction='left' onClick={prevImage} />
            <NavigationButton direction='right' onClick={nextImage} />

            <Box
              position='absolute'
              bottom={4}
              right={4}
              px={3}
              py={1}
              borderRadius='full'
              bg='blackAlpha.600'
              color='white'
              fontSize='sm'
              fontWeight='medium'
              zIndex={2}
            >
              {currentImageIndex + 1} / {images.length}
            </Box>
          </>
        )}
      </Box>

      {/* Thumbnails */}
      {images.length >= 1 && (
        <HStack
          spacing={3}
          mt={4}
          overflowX='auto'
          py={2}
          px={1}
          sx={{
            '&::-webkit-scrollbar': {
              height: '6px'
            },
            '&::-webkit-scrollbar-track': {
              bg: 'gray.100',
              borderRadius: 'full'
            },
            '&::-webkit-scrollbar-thumb': {
              bg: 'gray.300',
              borderRadius: 'full',
              '&:hover': {
                bg: 'gray.400'
              }
            }
          }}
        >
          {images.map((image, idx) => (
            <Box
              key={idx}
              cursor='pointer'
              position='relative'
              overflow='hidden'
              borderRadius='md'
              onClick={() => setCurrentImageIndex(idx)}
              transition='all 0.2s'
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md'
              }}
            >
              <Box
                position='absolute'
                inset={0}
                bg={currentImageIndex === idx ? 'blackAlpha.300' : 'transparent'}
                transition='all 0.2s'
                _hover={{
                  bg: 'blackAlpha.200'
                }}
              />
              <Image
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                w='80px'
                h='80px'
                objectFit='cover'
                loading='lazy'
                onError={handleImageError}
                border='2px solid'
                borderColor={currentImageIndex === idx ? 'blue.500' : 'transparent'}
              />
            </Box>
          ))}
        </HStack>
      )}

      {/* Zoom Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='6xl' isCentered>
        <ModalOverlay bg='blackAlpha.900' />
        <ModalContent bg='transparent' boxShadow='none' position='relative'>
          <IconButton
            icon={<CloseIcon boxSize={4} />}
            position='absolute'
            right={-10}
            top={-10}
            onClick={onClose}
            aria-label='Close modal'
            rounded='sm'
            bg='gray.700'
            color='white'
            opacity={0.8}
            _hover={{
              opacity: 1,
              bg: 'gray.700'
            }}
            zIndex={2}
          />
          <ModalBody p={4}>
            <Box position='relative'>
              <Image
                src={images[currentImageIndex]}
                alt={`Product image ${currentImageIndex + 1}`}
                w='100%'
                maxH='80vh'
                objectFit='contain'
                onError={handleImageError}
              />
              <NavigationButton direction='left' onClick={prevImage} isDark />
              <NavigationButton direction='right' onClick={nextImage} isDark />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default ImageGallery
