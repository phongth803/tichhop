import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Flex,
  Button,
  HStack,
  VStack,
  Image,
  IconButton,
  Link,
  Divider,
  GridItem
} from '@chakra-ui/react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import ProductCard from '@/components/common/ProductCard'
import { useState, useEffect, useRef } from 'react'
import {
  sidebarCategories,
  categories,
  heroSlides,
  flashSaleProducts,
  bestSellingProducts,
  exploreProducts
} from '@/data/mockData'
import { useNavigate } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'
import { HiOutlineTruck, HiOutlinePhone, HiOutlineShieldCheck } from 'react-icons/hi'

// Tạo component riêng cho phần header chung
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

// Component cho đồng hồ đếm ngược
const CountdownTimer = ({ days, hours, minutes, seconds }) => (
  <Flex gap={4} mb={2}>
    <Box>
      <Text color='black' fontSize='12px' fontWeight='600' mb={1}>
        Days
      </Text>
      <Text fontSize='32px' fontWeight='700' lineHeight='1'>
        {String(days).padStart(2, '0')}
      </Text>
    </Box>
    <Text fontSize='32px' fontWeight='600' color='red.500' mt={3}>
      :
    </Text>
    <Box>
      <Text color='black' fontSize='12px' fontWeight='600' mb={1}>
        Hours
      </Text>
      <Text fontSize='32px' fontWeight='700' lineHeight='1'>
        {String(hours).padStart(2, '0')}
      </Text>
    </Box>
    <Text fontSize='32px' fontWeight='600' color='red.500' mt={3}>
      :
    </Text>
    <Box>
      <Text color='black' fontSize='12px' fontWeight='600' mb={1}>
        Minutes
      </Text>
      <Text fontSize='32px' fontWeight='700' lineHeight='1'>
        {String(minutes).padStart(2, '0')}
      </Text>
    </Box>
    <Text fontSize='32px' fontWeight='600' color='red.500' mt={3}>
      :
    </Text>
    <Box>
      <Text color='black' fontSize='12px' fontWeight='600' mb={1}>
        Seconds
      </Text>
      <Text fontSize='32px' fontWeight='700' lineHeight='1'>
        {String(seconds).padStart(2, '0')}
      </Text>
    </Box>
  </Flex>
)

// Navigation Buttons Component
const NavigationButtons = ({ onPrev, onNext }) => (
  <HStack spacing={2}>
    <IconButton icon={<FiArrowLeft />} variant='outline' size='md' borderColor='gray.200' onClick={onPrev} />
    <IconButton icon={<FiArrowRight />} variant='outline' size='md' borderColor='gray.200' onClick={onNext} />
  </HStack>
)

// View All Button Component
const ViewAllButton = ({ onClick }) => (
  <Flex justify='center' mt={8}>
    <Button
      size='lg'
      bg='red.500'
      color='white'
      px={8}
      py={3}
      fontSize='md'
      rounded='md'
      _hover={{ bg: 'red.600' }}
      onClick={onClick}
    >
      View All Products
    </Button>
  </Flex>
)

// Product Slider Component
const ProductSlider = ({ products, currentIndex, itemsPerPage = 4, renderItem }) => (
  <Box overflow='hidden' mx={-4}>
    <Box
      display='flex'
      width={`${Math.ceil(products.length / itemsPerPage) * 100}%`}
      transform={`translateX(-${(currentIndex * 100) / Math.ceil(products.length / itemsPerPage)}%)`}
      transition='transform 0.5s ease-in-out'
    >
      {products.map((item) => (
        <Box key={item.id} width={`${(100 / products.length) * itemsPerPage}%`} px={4}>
          {renderItem(item)}
        </Box>
      ))}
    </Box>
  </Box>
)

// Card Overlay Component
const CardOverlay = ({ title, description, size = 'lg' }) => (
  <Box
    position='absolute'
    bottom={0}
    p={6}
    w='100%'
    bgGradient='linear(to-t, blackAlpha.900 0%, blackAlpha.700 50%, transparent 100%)'
  >
    <Heading size={size} color='white' mb={2}>
      {title}
    </Heading>
    <Text color='white' mb={4} maxW='250px'>
      {description}
    </Text>
    <Link
      display='inline-flex'
      alignItems='center'
      color='white'
      fontSize='18px'
      position='relative'
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
      Shop Now
    </Link>
  </Box>
)

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [countdown, setCountdown] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56
  })
  const slideInterval = useRef(null)
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState({
    flashSale: 0,
    bestSelling: 0,
    explore: 0,
    categories: 0
  })

  const [bannerCountdown, setBannerCountdown] = useState({
    days: 5,
    hours: 23,
    minutes: 59,
    seconds: 35
  })

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto slide with pause on hover
  useEffect(() => {
    startSlideTimer()
    return () => clearInterval(slideInterval.current)
  }, [])

  // Banner countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const startSlideTimer = () => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))
    }, 5000)
  }

  const pauseSlideTimer = () => {
    clearInterval(slideInterval.current)
  }

  const handleViewAll = (category) => {
    navigate(`/products?category=${category}`)
  }

  const handlePrev = (section) => {
    setCurrentIndex((prev) => ({
      ...prev,
      [section]:
        prev[section] - 1 < 0
          ? Math.ceil(section === 'explore' ? exploreProducts.length / 8 : flashSaleProducts.length / 4) - 1
          : prev[section] - 1
    }))
  }

  const handleNext = (section) => {
    setCurrentIndex((prev) => ({
      ...prev,
      [section]:
        prev[section] + 1 >=
        Math.ceil(section === 'explore' ? exploreProducts.length / 8 : flashSaleProducts.length / 4)
          ? 0
          : prev[section] + 1
    }))
  }

  const getCurrentProducts = (products, section) => {
    const itemsPerPage = section === 'explore' ? 8 : 4
    const start = currentIndex[section] * itemsPerPage
    return products.slice(start, start + itemsPerPage)
  }

  return (
    <Box as='main'>
      {/* Hero Section */}
      <Container maxW='container.xl'>
        <Grid templateColumns='220px 1fr' gap={6}>
          {/* Sidebar with hover effect */}
          <Box
            borderRight='1px'
            borderColor='gray.200'
            position='relative'
            ml={-4}
            _before={{
              content: '""',
              position: 'absolute',
              top: '-1px',
              right: '-1px',
              width: '1px',
              height: '20px',
              bg: 'gray.200'
            }}
          >
            <Box pt={4}>
              {sidebarCategories.map((item) => (
                <Link
                  key={item.name}
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  py={2}
                  px={4}
                  color='black'
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

          {/* Hero Slider */}
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
                      Shop Now <FiArrowRight style={{ marginLeft: '16px', fontSize: '20px' }} />
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

      <Container maxW='container.xl' mt={10}>
        {/* Flash Sales */}
        <Box py={8}>
          <Flex justify='space-between' align='center'>
            <Flex align='center' gap={16}>
              <SectionHeader label="Today's" title='Flash Sales' />
              <CountdownTimer
                days={countdown.days}
                hours={countdown.hours}
                minutes={countdown.minutes}
                seconds={countdown.seconds}
              />
            </Flex>
            <NavigationButtons onPrev={() => handlePrev('flashSale')} onNext={() => handleNext('flashSale')} />
          </Flex>

          <ProductSlider
            products={flashSaleProducts}
            currentIndex={currentIndex.flashSale}
            itemsPerPage={4}
            renderItem={(product) => <ProductCard {...product} />}
          />

          <ViewAllButton onClick={() => handleViewAll('flash-sale')} />
        </Box>

        <Divider borderColor='gray.300' my={8} />

        {/* Categories */}
        <Box py={8}>
          <SectionHeader label='Categories' title='Browse By Category'>
            <NavigationButtons onPrev={() => handlePrev('categories')} onNext={() => handleNext('categories')} />
          </SectionHeader>

          <Box overflow='hidden'>
            <Box
              display='flex'
              width={`${Math.ceil(categories.length / 6) * 100}%`}
              transform={`translateX(-${currentIndex.categories * (100 / categories.length)}%)`}
              transition='transform 0.5s ease-in-out'
            >
              {categories.map((cat, idx) => (
                <Box key={idx} width={`${100 / 6}%`} px={3}>
                  <Box
                    p={8}
                    border='1px solid'
                    borderColor='gray.200'
                    borderRadius='md'
                    bg='white'
                    textAlign='center'
                    cursor='pointer'
                    transition='all 0.3s'
                    _hover={{
                      borderColor: 'red.500',
                      bg: 'red.500',
                      color: 'white'
                    }}
                  >
                    <cat.icon size={40} style={{ margin: '0 auto 12px' }} />
                    <Text fontSize='md'>{cat.name}</Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider borderColor='gray.300' my={8} />

        {/* Best Selling Products */}
        <Box py={8}>
          <SectionHeader label='This Month' title='Best Selling Products'>
            <ViewAllButton onClick={() => handleViewAll('best-selling')} />
          </SectionHeader>

          <Grid templateColumns='repeat(4, 1fr)' gap={6}>
            {getCurrentProducts(bestSellingProducts, 'bestSelling').map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </Grid>
        </Box>

        {/* Music Experience Banner */}
        <Box my={8} bg='black' color='white' borderRadius='xl' overflow='hidden' position='relative' p={8}>
          <Box maxW='50%'>
            <Text color='#00FF66' mb={2}>
              Categories
            </Text>
            <Heading size='2xl' mb={8}>
              Enhance Your
              <br />
              Music Experience
            </Heading>
            <Grid templateColumns='repeat(4, 1fr)' gap={4} mb={8} maxW='400px'>
              {[
                { value: bannerCountdown.hours, label: 'Hours' },
                { value: bannerCountdown.days, label: 'Days' },
                { value: bannerCountdown.minutes, label: 'Minutes' },
                { value: bannerCountdown.seconds, label: 'Seconds' }
              ].map((item) => (
                <Box
                  key={item.label}
                  bg='white'
                  color='black'
                  borderRadius='full'
                  width='80px'
                  height='80px'
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Text fontSize='20px' fontWeight='600'>
                    {String(item.value).padStart(2, '0')}
                  </Text>
                  <Text fontSize='xs'>{item.label}</Text>
                </Box>
              ))}
            </Grid>
            <Button bg='#00FF66' color='white' size='lg' px={8} _hover={{ bg: '#00DD55' }}>
              Buy Now!
            </Button>
          </Box>
          <Image
            src='src/assets/images/jbl-speaker.png'
            position='absolute'
            right={0}
            top='50%'
            transform='translateY(-50%) scaleX(-1)'
            maxW='60%'
            objectFit='contain'
            sx={{
              filter: 'drop-shadow(0 0 20px rgba(0,255,102,0.2))' // Thêm hiệu ứng glow xanh
            }}
          />
        </Box>

        {/* Explore Products */}
        <Box py={8}>
          <SectionHeader label='Our Products' title='Explore Our Products'>
            <NavigationButtons onPrev={() => handlePrev('explore')} onNext={() => handleNext('explore')} />
          </SectionHeader>

          <Box overflow='hidden' mx={-4}>
            <Box
              display='flex'
              width={`${Math.ceil(exploreProducts.length / 8) * 100}%`}
              transform={`translateX(-${(currentIndex.explore * 100) / Math.ceil(exploreProducts.length / 8)}%)`}
              transition='transform 0.5s ease-in-out'
            >
              {Array.from({ length: Math.ceil(exploreProducts.length / 8) }).map((_, pageIndex) => (
                <Box key={pageIndex} width={`${100 / Math.ceil(exploreProducts.length / 8)}%`} px={4}>
                  <Grid templateColumns='repeat(4, 1fr)' templateRows='repeat(2, 1fr)' gap={6}>
                    {exploreProducts.slice(pageIndex * 8, (pageIndex + 1) * 8).map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          </Box>

          {/* View All Button */}
          <ViewAllButton onClick={() => handleViewAll('explore')} />
        </Box>

        {/* New Arrival */}
        <Box py={8}>
          <SectionHeader label='Featured' title='New Arrival' />
          <Grid templateColumns='repeat(4, 1fr)' templateRows='repeat(2, 1fr)' gap={6} h='600px'>
            {/* PlayStation 5 Card - Chiếm 2 cột, 2 hàng */}
            <GridItem colSpan={2} rowSpan={2} position='relative'>
              <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
                <Image src='src/assets/images/ps5.jpg' alt='PS5' objectFit='cover' w='100%' h='100%' />
                <CardOverlay
                  title='PlayStation 5'
                  description='Black and White version of the PS5 coming out on sale.'
                />
              </Box>
            </GridItem>

            {/* Women's Collections Card */}
            <GridItem colSpan={2} position='relative'>
              <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
                <Image
                  src='src/assets/images/women.jpg'
                  alt="Women's Collections"
                  objectFit='cover'
                  w='100%'
                  h='100%'
                  transform='scaleX(-1)'
                />
                <CardOverlay
                  title="Women's Collections"
                  description='Featured woman collections that give you another vibe.'
                />
              </Box>
            </GridItem>

            {/* Speakers Card */}
            <GridItem position='relative'>
              <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
                <Image src='src/assets/images/speakers.jpg' alt='Speakers' objectFit='cover' w='100%' h='100%' />
                <CardOverlay title='Speakers' description='Amazon wireless speakers' />
              </Box>
            </GridItem>

            {/* Perfume Card */}
            <GridItem position='relative'>
              <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
                <Image src='src/assets/images/perfume.jpg' alt='Perfume' objectFit='cover' w='100%' h='100%' />
                <CardOverlay title='Perfume' description='GUCCI INTENSE OUD EDP' />
              </Box>
            </GridItem>
          </Grid>
        </Box>

        {/* Services */}
        <Grid templateColumns='repeat(3, 1fr)' gap={8} py={20} mt={100}>
          {[
            {
              icon: HiOutlineTruck,
              title: 'FREE AND FAST DELIVERY',
              description: 'Free delivery for all orders over $140'
            },
            {
              icon: HiOutlinePhone,
              title: '24/7 CUSTOMER SERVICE',
              description: 'Friendly 24/7 customer support'
            },
            {
              icon: HiOutlineShieldCheck,
              title: 'MONEY BACK GUARANTEE',
              description: 'We reurn money within 30 days'
            }
          ].map((service) => (
            <VStack key={service.title} spacing={4} align='center'>
              <Box p={4} borderRadius='full' bg='black' position='relative'>
                <Box
                  position='absolute'
                  top={-1}
                  left={-1}
                  right={-1}
                  bottom={-1}
                  borderRadius='full'
                  border='2px solid'
                  borderColor='gray.200'
                />
                <service.icon size={24} color='white' />
              </Box>
              <Heading size='md'>{service.title}</Heading>
              <Text color='black' textAlign='center'>
                {service.description}
              </Text>
            </VStack>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Home
