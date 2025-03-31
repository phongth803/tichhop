import { Box, Container, Divider } from '@chakra-ui/react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'

import { useStore } from '@/stores/rootStore'
import { useCountdown } from '@/hooks/useCountdown'
import { INITIAL_COUNTDOWN, SLIDER_INTERVAL, ITEMS_PER_PAGE, heroSlides } from './constants/home'
import ExploreProducts from './components/ExploreProducts'
import BestSellingProducts from './components/BestSellingProducts'
import HeroSection from './components/HeroSection'
import FlashSales from './components/FlashSales'
import Categories from './components/Categories'
import MusicBanner from './components/MusicBanner'
import NewArrival from './components/NewArrival'
import Services from './components/Services'
import Loading from '@/components/common/Loading'

const Home = observer(() => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentIndex, setCurrentIndex] = useState({
    flashSale: 0,
    bestSelling: 0,
    explore: 0,
    categories: 0
  })

  const countdown = useCountdown(INITIAL_COUNTDOWN.FLASH_SALE)
  const bannerCountdown = useCountdown(INITIAL_COUNTDOWN.BANNER)
  const slideInterval = useRef(null)

  const { productStore, categoryStore } = useStore()
  const { exploreProducts, bestSellingProducts, flashSaleProducts, loadingStates } = productStore
  const { categories, loading: categoriesLoading } = categoryStore

  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          productStore.getExploreProducts(),
          productStore.getBestSellingProducts(),
          productStore.getFlashSaleProducts(),
          categoryStore.getCategories()
        ])
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    loadData()
  }, [])

  const startSlideTimer = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current)
    }
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))
    }, SLIDER_INTERVAL)
  }, [])

  const pauseSlideTimer = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current)
      slideInterval.current = null
    }
  }, [])

  // Auto slide with pause on hover
  useEffect(() => {
    startSlideTimer()
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current)
      }
    }
  }, [startSlideTimer])

  const getItemsPerPage = useCallback((section) => {
    switch (section) {
      case 'explore':
        return ITEMS_PER_PAGE.EXPLORE
      case 'categories':
        return ITEMS_PER_PAGE.CATEGORIES
      default:
        return ITEMS_PER_PAGE.FLASH_SALE
    }
  }, [])

  const handlePrev = useCallback(
    (section) => {
      const itemsPerPage = getItemsPerPage(section)
      const totalItems =
        section === 'explore'
          ? exploreProducts.length
          : section === 'categories'
            ? categories.length
            : flashSaleProducts.length
      const totalPages = Math.ceil(totalItems / itemsPerPage)

      setCurrentIndex((prev) => ({
        ...prev,
        [section]: prev[section] - 1 < 0 ? totalPages - 1 : prev[section] - 1
      }))
    },
    [exploreProducts.length, flashSaleProducts.length, categories.length, getItemsPerPage]
  )

  const handleNext = useCallback(
    (section) => {
      const itemsPerPage = getItemsPerPage(section)
      const totalItems =
        section === 'explore'
          ? exploreProducts.length
          : section === 'categories'
            ? categories.length
            : flashSaleProducts.length
      const totalPages = Math.ceil(totalItems / itemsPerPage)

      setCurrentIndex((prev) => ({
        ...prev,
        [section]: prev[section] + 1 >= totalPages ? 0 : prev[section] + 1
      }))
    },
    [exploreProducts.length, flashSaleProducts.length, categories.length, getItemsPerPage]
  )

  const handleCategoryClick = useCallback(
    (categoryId) => {
      navigate(`/products?category=${categoryId}`)
    },
    [navigate]
  )

  // Loading state
  if (loadingStates.explore || loadingStates.bestSelling || loadingStates.flashSale || categoriesLoading) {
    return <Loading text='Loading home page...' />
  }

  return (
    <Box as='main'>
      <Box display={{ base: 'none', md: 'block' }}>
        <HeroSection
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          heroSlides={heroSlides}
          sidebarCategories={categories}
          startSlideTimer={startSlideTimer}
          pauseSlideTimer={pauseSlideTimer}
          onCategoryClick={handleCategoryClick}
        />
      </Box>

      <Container maxW='container.xl' mt={{ base: 0, md: 10 }} px={{ base: 4, md: 6, lg: 8 }}>
        <FlashSales
          countdown={countdown}
          flashSaleProducts={flashSaleProducts}
          currentIndex={currentIndex.flashSale}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />

        <Divider borderColor='gray.300' my={8} />

        <Categories
          currentIndex={currentIndex.categories}
          handlePrev={handlePrev}
          handleNext={handleNext}
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />

        <Divider borderColor='gray.300' my={8} />

        <BestSellingProducts products={bestSellingProducts} />

        <MusicBanner bannerCountdown={bannerCountdown} />

        <ExploreProducts
          products={exploreProducts}
          currentIndex={currentIndex.explore}
          onPrev={() => handlePrev('explore')}
          onNext={() => handleNext('explore')}
        />

        {/* New Arrival */}
        <NewArrival />

        {/* Services */}
        <Services />
      </Container>
    </Box>
  )
})

export default Home
