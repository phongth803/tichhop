import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Box, Container, Grid, useBreakpointValue, useDisclosure } from '@chakra-ui/react'
import { useStore } from '@/stores/rootStore'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import Loading from '@/components/common/Loading'
import ProductFilters from './components/ProductFilters'
import ProductGrid from './components/ProductGrid'
import Pagination from './components/Pagination'
import ProductListHeader from './components/ProductListHeader'
import MobileFilters from './components/MobileFilters'
import { DEFAULT_FILTERS } from '@/stores/productStore'
import { useProductFilters } from '@/hooks/useProductFilters'

const ProductList = observer(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const { productStore, categoryStore } = useStore()
  const { productsList, totalProducts, filters, loadingStates } = productStore
  const { categories } = categoryStore

  const isMobile = useBreakpointValue({ base: true, md: false })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    localFilters,
    setLocalFilters,
    currentPageState,
    setCurrentPageState,
    debouncedFilters,
    validatePageNumber,
    cleanFilters
  } = useProductFilters(DEFAULT_FILTERS)

  useEffect(() => {
    const parsed = queryString.parse(location.search, {
      parseNumbers: true,
      parseBooleans: true,
      skipEmptyString: true
    })

    const totalPages = Math.ceil(totalProducts / 20)
    const validatedPage = validatePageNumber(parsed.page, totalPages)

    const newFilters = {
      ...DEFAULT_FILTERS,
      ...parsed,
      category: parsed.category || DEFAULT_FILTERS.category,
      page: validatedPage
    }

    if (parsed.page && parsed.page !== validatedPage) {
      const cleanedFilters = cleanFilters(newFilters)
      updateUrl({ ...cleanedFilters, page: validatedPage })
      return
    }

    setLocalFilters(newFilters)
    setCurrentPageState(validatedPage)
    productStore.setFilters(newFilters)
    productStore.getProductsList()

    if (!categories.length) {
      categoryStore.getCategories()
    }
  }, [location.search, totalProducts])

  // Xử lý khi filters thay đổi qua debounce
  useEffect(() => {
    if (JSON.stringify(debouncedFilters) === JSON.stringify(filters)) {
      return
    }

    const cleanedFilters = cleanFilters(debouncedFilters)
    const newFilters = { ...debouncedFilters, page: 1 }
    productStore.setFilters(newFilters)
    productStore.getProductsList()

    updateUrl(cleanedFilters)
    if (isMobile) {
      onClose()
    }
  }, [debouncedFilters])

  useEffect(() => {
    return () => {
      productStore.resetFilters()
    }
  }, [])

  const updateUrl = (params) => {
    const queryParams = queryString.stringify(params, {
      skipEmptyString: true,
      skipNull: true,
      sort: false
    })
    navigate(`?${queryParams}`, { replace: true })
  }

  const handleResetFilters = () => {
    setLocalFilters(DEFAULT_FILTERS)
    productStore.resetFilters()
    productStore.getProductsList()
    navigate('', { replace: true })
    if (isMobile) onClose()
  }

  const handlePageChange = (page) => {
    const totalPages = Math.ceil(totalProducts / 20)
    const validatedPage = validatePageNumber(page, totalPages)

    setCurrentPageState(validatedPage)
    const newFilters = { ...filters, page: validatedPage }
    productStore.setFilters(newFilters)
    productStore.getProductsList()
    window.scrollTo(0, 0)
    updateUrl({ ...filters, page: validatedPage })
  }

  const handleSortChange = (value) => {
    const newFilters = {
      ...filters,
      sort: value,
      page: 1
    }
    setLocalFilters(newFilters)
    setCurrentPageState(1)
    productStore.setFilters(newFilters)
    productStore.getProductsList()
    updateUrl({ ...cleanFilters(newFilters) })
  }

  return (
    <Box bg='gray.50' minH='100vh'>
      <Container maxW='container.xl' py={8}>
        <ProductListHeader
          totalProducts={totalProducts}
          filters={filters}
          onSortChange={handleSortChange}
          onOpenFilters={onOpen}
          isMobile={isMobile}
        />

        <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={8} mt={6}>
          {!isMobile && (
            <ProductFilters
              localFilters={localFilters}
              setLocalFilters={setLocalFilters}
              categories={categories}
              onReset={handleResetFilters}
            />
          )}

          <Box>
            {loadingStates.products ? (
              <Loading text='Loading products...' />
            ) : (
              <>
                <ProductGrid products={productsList} />
                {totalProducts > 0 && (
                  <Pagination
                    currentPage={currentPageState}
                    totalPages={Math.ceil(totalProducts / 20)}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </Box>
        </Grid>

        {isMobile && (
          <MobileFilters
            isOpen={isOpen}
            onClose={onClose}
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            categories={categories}
            onReset={handleResetFilters}
          />
        )}
      </Container>
    </Box>
  )
})

export default ProductList
