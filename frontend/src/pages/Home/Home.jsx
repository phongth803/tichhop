import { Box, Container, Divider } from '@chakra-ui/react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import { sidebarCategories, categories, heroSlides } from '@/data/mockData'
import { useStore } from '@/stores/rootStore'
import { useCountdown } from '@/hooks/useCountdown'
import { INITIAL_COUNTDOWN, SLIDER_INTERVAL, ITEMS_PER_PAGE } from './constants/home'
import ExploreProducts from './components/ExploreProducts'
import BestSellingProducts from './components/BestSellingProducts'
import HeroSection from './components/HeroSection'
import FlashSales from './components/FlashSales'
import Categories from './components/Categories'
import MusicBanner from './components/MusicBanner'
import NewArrival from './components/NewArrival'
import Services from './components/Services'
import LoadingSkeleton from './components/LoadingSkeleton'

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

  const { productStore } = useStore()
  const { products, bestSellingProducts, loading, flashSaleProducts } = productStore

  useEffect(() => {
    const loadData = async () => {
      try {
        // Prefetch data
        const productPromise = productStore.getProducts({ limit: 24 })
        const bestSellingPromise = productStore.getBestSellingProducts()
        const flashSalePromise = productStore.getFlashSaleProducts()

        // Start rendering UI while data is being fetched
        await Promise.all([productPromise, bestSellingPromise, flashSalePromise])
      } catch (error) {
        console.error('Failed to load products:', error)
      }
    }
    loadData()
  }, [productStore])

  // Auto slide with pause on hover
  useEffect(() => {
    startSlideTimer()
    return () => clearInterval(slideInterval.current)
  }, [])

  const startSlideTimer = () => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))
    }, SLIDER_INTERVAL)
  }

  const pauseSlideTimer = () => {
    clearInterval(slideInterval.current)
  }

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
          ? products.length
          : section === 'categories'
            ? categories.length
            : flashSaleProducts.length

      setCurrentIndex((prev) => ({
        ...prev,
        [section]: prev[section] - 1 < 0 ? Math.ceil(totalItems / itemsPerPage) - 1 : prev[section] - 1
      }))
    },
    [products.length, flashSaleProducts.length, categories.length, getItemsPerPage]
  )

  const handleNext = useCallback(
    (section) => {
      const itemsPerPage = getItemsPerPage(section)
      const totalItems =
        section === 'explore'
          ? products.length
          : section === 'categories'
            ? categories.length
            : flashSaleProducts.length

      setCurrentIndex((prev) => ({
        ...prev,
        [section]: prev[section] + 1 >= Math.ceil(totalItems / itemsPerPage) ? 0 : prev[section] + 1
      }))
    },
    [products.length, flashSaleProducts.length, categories.length, getItemsPerPage]
  )

  // Loading state
  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <Box as='main'>
      <HeroSection
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        heroSlides={heroSlides}
        sidebarCategories={sidebarCategories}
        startSlideTimer={startSlideTimer}
        pauseSlideTimer={pauseSlideTimer}
      />

      <Container maxW='container.xl' mt={10}>
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
        />

        <Divider borderColor='gray.300' my={8} />

        <BestSellingProducts products={bestSellingProducts} />

        <MusicBanner bannerCountdown={bannerCountdown} />

        <ExploreProducts
          products={products}
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
