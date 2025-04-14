import { Box, HStack, Flex, Text, Heading, Link, Image } from '@chakra-ui/react'
import { FiArrowRight } from 'react-icons/fi'
import { FaChevronRight } from 'react-icons/fa'
import { Container, Grid } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const HeroSection = ({
  currentSlide,
  setCurrentSlide,
  heroSlides,
  sidebarCategories,
  startSlideTimer,
  pauseSlideTimer,
  onCategoryClick
}) => {
  const navigate = useNavigate()

  const handleShopNow = () => {
    navigate('/products')
  }
  return (
    <Container maxW='container.xl'>
      <Grid templateColumns='220px 1fr' gap={6}>
        {/* Sidebar */}
        <Box borderRight='1px' borderColor='gray.200' position='relative' ml={-4}>
          <Box pt={4}>
            {sidebarCategories.map((item) => (
              <Link
                key={item._id}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                py={2}
                px={4}
                color='black'
                onClick={() => onCategoryClick(item._id)}
                cursor='pointer'
                _hover={{
                  color: 'red.500',
                  bg: 'gray.50'
                }}
              >
                <Text>{item.name}</Text>
                {item.hasSubmenu && <FaChevronRight fontSize={12} />}
              </Link>
            ))}
          </Box>
        </Box>

        {/* Slider */}
        <Box
          bg='black'
          color='white'
          overflow='hidden'
          position='relative'
          mt={6}
          borderRadius='xl'
          onMouseEnter={pauseSlideTimer}
          onMouseLeave={startSlideTimer}
        >
          <Box
            position='relative'
            height='350px'
            transform={`translateX(-${currentSlide * 100}%)`}
            transition='transform 0.5s ease-in-out'
          >
            {heroSlides.map((slide, index) => (
              <Box
                key={slide.id}
                position={index === 0 ? 'relative' : 'absolute'}
                top={0}
                left={`${index * 100}%`}
                width='100%'
                height='100%'
                p={10}
              >
                <Box maxW='500px'>
                  <Flex align='center' gap={4} mb={8}>
                    <Image src={slide.logo} h={14} />
                    <Text fontSize='20px' color='gray.100' fontWeight='medium' whiteSpace='pre-line'>
                      {slide.title}
                    </Text>
                  </Flex>

                  <Heading
                    fontSize='48px'
                    fontWeight='600'
                    mb={8}
                    lineHeight='1.1'
                    maxW='280px'
                    sx={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {slide.subtitle}
                  </Heading>

                  <Link
                    display='inline-flex'
                    alignItems='center'
                    color='white'
                    fontSize='18px'
                    position='relative'
                    onClick={handleShopNow}
                    _hover={{
                      textDecoration: 'none',
                      '&::after': {
                        width: '85px'
                      }
                    }}
                    sx={{
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: '0',
                        bottom: '-3px',
                        width: '0',
                        height: '1.5px',
                        backgroundColor: 'white',
                        transition: 'width 0.3s ease'
                      }
                    }}
                  >
                    Shop Now <FiArrowRight style={{ marginLeft: '16px', fontSize: '20px', marginTop: '2px' }} />
                  </Link>
                </Box>
                <Image
                  src={slide.image}
                  position='absolute'
                  right={12}
                  top='50%'
                  transform='translateY(-50%)'
                  maxW='50%'
                  objectFit='contain'
                />
              </Box>
            ))}
          </Box>

          {/* Slider dots */}
          <HStack justify='center' position='absolute' bottom={4} left='0' right='0' spacing={2}>
            {heroSlides.map((_, i) => (
              <Box
                key={i}
                w={4}
                h={4}
                borderRadius='full'
                bg={i === currentSlide ? 'red.500' : 'whiteAlpha.400'}
                cursor='pointer'
                onClick={() => setCurrentSlide(i)}
                border={i === currentSlide ? '2px solid white' : 'none'}
                _hover={{
                  bg: 'red.400'
                }}
              />
            ))}
          </HStack>
        </Box>
      </Grid>
    </Container>
  )
}

export default HeroSection
