import { useState, useEffect } from 'react'
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

const ProductList = observer(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const { productStore, categoryStore } = useStore()
  const { productsList, totalProducts, currentPage, filters, loadingStates } = productStore
  const { categories } = categoryStore

  const isMobile = useBreakpointValue({ base: true, md: false })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)

  useEffect(() => {
    const parsed = queryString.parse(location.search, {
      parseNumbers: true,
      parseBooleans: true,
      skipEmptyString: true
    })

    const initialFilters = {
      ...DEFAULT_FILTERS,
      ...parsed
    }

    setLocalFilters(initialFilters)
    productStore.filters = initialFilters
    productStore.currentPage = parsed.page || 1

    productStore.getProductsList()
    categoryStore.getCategories()

    return () => {
      productStore.resetFilters()
    }
  }, [location.search])

  const updateUrl = (params) => {
    const cleanParams = {
      ...params,
      page: params.page > 1 ? params.page : undefined,
      category: params.category !== DEFAULT_FILTERS.category ? params.category : undefined,
      search: params.search !== DEFAULT_FILTERS.search ? params.search : undefined,
      minPrice: params.minPrice !== DEFAULT_FILTERS.minPrice ? params.minPrice : undefined,
      maxPrice: params.maxPrice !== DEFAULT_FILTERS.maxPrice ? params.maxPrice : undefined,
      sort: params.sort !== DEFAULT_FILTERS.sort ? params.sort : undefined,
      onSale: params.onSale !== DEFAULT_FILTERS.onSale ? params.onSale : undefined
    }

    const queryParams = queryString.stringify(cleanParams, {
      skipEmptyString: true,
      skipNull: true,
      sort: false
    })
    navigate(`?${queryParams}`, { replace: true })
  }

  const handleApplyFilters = () => {
    productStore.setFilters(localFilters)
    updateUrl(localFilters)
    if (isMobile) onClose()
  }

  const handleResetFilters = () => {
    setLocalFilters(DEFAULT_FILTERS)
    productStore.resetFilters()
    navigate({ search: '' }, { replace: true })
    if (isMobile) onClose()
  }

  const handlePageChange = (page) => {
    productStore.setPage(page)
    window.scrollTo(0, 0)
    updateUrl({ ...productStore.filters, page })
  }

  const handleSortChange = (value) => {
    const newFilters = { ...productStore.filters, sort: value }
    productStore.setFilters(newFilters)
    updateUrl(newFilters)
  }

  if (loadingStates.products) {
    return <Loading text='Loading products...' />
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
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
          )}

          <Box>
            <ProductGrid products={productsList} />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalProducts / 20)}
              onPageChange={handlePageChange}
            />
          </Box>
        </Grid>

        {isMobile && (
          <MobileFilters
            isOpen={isOpen}
            onClose={onClose}
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            categories={categories}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
      </Container>
    </Box>
  )
})

export default ProductList
