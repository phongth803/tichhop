import React, { useEffect, useState } from 'react'
import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Image,
  Text,
  VStack,
  SimpleGrid,
  Divider,
  Button
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, SearchIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import DataTable from '@/components/common/DataTable'
import ConfirmModal from '@/components/common/ConfirmModal'
import { useStore } from '@/stores/rootStore'
import { observer } from 'mobx-react-lite'
import TaskBarAdmin from '@/components/common/TaskBarAdmin'
import ProductActionModal from './components/ProductActionModal'
import ProductFilter from './components/ProductFilter'
import { toast } from 'react-toastify'
import Loading from '@/components/common/Loading'
import { useDebounce } from '@/hooks/useDebounce'
import useIsMobile from '@/hooks/useIsMobile'

const Products = observer(() => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    onSale: false,
    sort: 'newest'
  })
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const debouncedMinPrice = useDebounce(filters.minPrice, 500)
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 500)
  const { adminProductStore, adminCategoryStore } = useStore()
  const isMobile = useIsMobile()

  useEffect(() => {
    adminProductStore.getProductsList()
    adminCategoryStore.getCategories()
  }, [])

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
      category: filters.category,
      status: filters.status,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      onSale: filters.onSale,
      sort: filters.sort
    }
    adminProductStore.getProductsList(params)
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearchTerm,
    debouncedMinPrice,
    debouncedMaxPrice,
    filters.category,
    filters.status,
    filters.onSale,
    filters.sort
  ])

  const handleAddProduct = async (productData) => {
    try {
      const isSuccess = await adminProductStore.addProduct(productData)
      if (isSuccess) {
        toast.success('Product created successfully')
        setIsAddModalOpen(false)
        adminProductStore.getProductsList()
      }
    } catch (error) {
      toast.error('Error adding product: ' + error.message)
    }
  }

  const handleToggleEdit = (item) => {
    setIsEdit(true)
    setSelectedProduct(item)
  }

  const handleEdit = async (data) => {
    try {
      const isSuccess = await adminProductStore.updateProduct(selectedProduct._id, data)
      if (isSuccess) {
        toast.success('Product updated successfully')
        adminProductStore.getProductsList()
        setIsEdit(false)
        setSelectedProduct(null)
      }
    } catch (error) {
      setIsEdit(false)
      setSelectedProduct(null)
      toast.error('Error updating product: ' + error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const isSuccess = await adminProductStore.deleteProduct(selectedProduct._id)
      if (isSuccess) {
        toast.success('Product deleted successfully')
        adminProductStore.getProductsList()
        setIsRemoveModalOpen(false)
        setSelectedProduct(null)
      }
    } catch (error) {
      toast.error('Error deleting product: ' + error.message)
      setIsRemoveModalOpen(false)
      setSelectedProduct(null)
    }
  }

  const handleToggleDelete = (item) => {
    setSelectedProduct(item)
    setIsRemoveModalOpen((prev) => !prev)
  }

  const handleToggleExpand = (itemId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const tableHeaders = isMobile
    ? [
        { key: 'thumbnail', label: 'Thumbnail' },
        { key: 'name', label: 'Name' },
        { key: 'expand', label: '' }
      ]
    : [
        { key: 'thumbnail', label: 'Thumbnail' },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price' },
        { key: 'category', label: 'Category' },
        { key: 'stock', label: 'Stock' },
        { key: 'status', label: 'Status' },
        { key: 'discount', label: 'Discount' },
        { key: 'actions', label: 'Actions' }
      ]

  const dataInTable = adminProductStore.productsList?.map((item) => {
    const baseData = {
      thumbnail: (
        <Image
          src={item.thumbnail}
          alt={item.name}
          boxSize={{ base: '40px', md: '50px' }}
          objectFit='cover'
          borderRadius='md'
        />
      ),
      name: (
        <VStack align='start' spacing={{ base: 0.5, md: 1 }}>
          <Text fontWeight='semibold' fontSize={{ base: 'sm', md: 'md' }} noOfLines={2}>
            {item.name}
          </Text>
          <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
            ${item.price}
          </Text>
        </VStack>
      )
    }

    if (isMobile) {
      return {
        ...baseData,
        expand: (
          <IconButton
            icon={expandedRows.has(item._id) ? <ViewOffIcon /> : <ViewIcon />}
            size='sm'
            variant='ghost'
            aria-label='View details'
            color={expandedRows.has(item._id) ? 'purple.500' : 'gray.500'}
            _hover={{ color: 'purple.500' }}
            onClick={() => handleToggleExpand(item._id)}
          />
        ),
        expandedContent: expandedRows.has(item._id) && (
          <Box bg='gray.50' p={{ base: 3, md: 4 }} borderRadius='md' mx={0} mb={{ base: 2, md: 4 }} boxShadow='sm'>
            <SimpleGrid columns={2} spacing={{ base: 3, md: 4 }} mb={{ base: 3, md: 4 }}>
              <Box>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mb={1}>
                  Category
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight='medium'>
                  {item.category?.name || 'N/A'}
                </Text>
              </Box>
              <Box>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mb={1}>
                  Stock
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight='medium'>
                  {item.stock}
                </Text>
              </Box>
              <Box>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mb={1}>
                  Status
                </Text>
                <Badge
                  colorScheme={item.isActive ? 'green' : 'red'}
                  borderRadius='md'
                  fontSize={{ base: 'xs', md: 'sm' }}
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Box>
              <Box>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mb={1}>
                  Discount
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight='medium'>
                  {item.discount ? `${item.discount}%` : 'N/A'}
                </Text>
              </Box>
            </SimpleGrid>

            <Box mb={{ base: 3, md: 4 }}>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mb={1}>
                Description
              </Text>
              <Text fontSize={{ base: 'sm', md: 'md' }}>{item.description}</Text>
            </Box>

            <Divider mb={{ base: 3, md: 4 }} />

            <HStack spacing={{ base: 2, md: 3 }} justify='flex-end'>
              <Button
                leftIcon={<EditIcon />}
                size={{ base: 'xs', md: 'sm' }}
                variant='ghost'
                colorScheme='blue'
                onClick={() => handleToggleEdit(item)}
              >
                Edit
              </Button>
              <Button
                leftIcon={<DeleteIcon />}
                size={{ base: 'xs', md: 'sm' }}
                variant='ghost'
                colorScheme='red'
                onClick={() => handleToggleDelete(item)}
              >
                Delete
              </Button>
            </HStack>
          </Box>
        )
      }
    }

    return {
      ...baseData,
      description: item.description,
      price: `$${item.price}`,
      category: item.category?.name || 'N/A',
      stock: item.stock,
      status: (
        <Badge colorScheme={item.isActive ? 'green' : 'red'} borderRadius='md'>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
      discount: item.discount ? `${item.discount}%` : 'N/A',
      actions: (
        <HStack spacing={2}>
          <IconButton
            icon={<EditIcon />}
            size='sm'
            variant='ghost'
            colorScheme='blue'
            aria-label='Edit'
            onClick={() => handleToggleEdit(item)}
          />
          <IconButton
            icon={<DeleteIcon />}
            size='sm'
            variant='ghost'
            colorScheme='red'
            aria-label='Delete'
            onClick={() => handleToggleDelete(item)}
          />
        </HStack>
      )
    }
  })

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = async (page, newItemsPerPage) => {
    setCurrentPage(page)
    setItemsPerPage(newItemsPerPage)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  return (
    <Box p={{ base: 0, md: 4 }} width='100%' overflowX={{ base: 'hidden', md: 'auto' }}>
      <Box px={2}>
        <TaskBarAdmin
          title='Products'
          isFilter={true}
          isAdd={true}
          handleOpenFilter={() => setIsFilterOpen(true)}
          handleAdd={() => setIsAddModalOpen(true)}
          buttonText='Add Product'
          searchPlaceholder='Search by name...'
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          isMobile={isMobile}
        />
      </Box>
      <ConfirmModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleDelete}
        title='Delete Product'
        message={`Are you sure you want to delete ${selectedProduct?.name}?`}
        isLoading={adminProductStore.loading}
      />
      <ProductActionModal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        onSubmit={handleEdit}
        isEdit={true}
        initialData={selectedProduct}
        categories={adminCategoryStore.categoryList}
      />
      <ProductActionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
        isEdit={false}
        initialData={null}
        categories={adminCategoryStore.categoryList}
      />
      <ProductFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilter={handleFilter}
        currentFilters={filters}
        categories={adminCategoryStore.categoryList}
      />
      {adminProductStore.isListLoading ? (
        <Loading />
      ) : (
        <Box width='100%' overflowX='auto'>
          <DataTable
            headers={tableHeaders}
            dataInTable={dataInTable}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={Math.ceil(adminProductStore.totalProducts / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  )
})

export default Products
