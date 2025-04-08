import React, { useEffect, useState } from 'react'
import { Box, HStack, IconButton, Input, InputGroup, InputLeftElement, Badge, Image } from '@chakra-ui/react'
import { EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons'
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

const Products = observer(() => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
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

  const headers = [
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

  const dataInTable = adminProductStore.productsList?.map((item) => ({
    thumbnail: <Image src={item.thumbnail} alt={item.name} boxSize='50px' objectFit='cover' />,
    name: item.name,
    description: item.description,
    price: `$${item.price}`,
    category: item.category?.name || 'N/A',
    stock: item.stock,
    status: <Badge colorScheme={item.isActive ? 'green' : 'red'}>{item.isActive ? 'Active' : 'Inactive'}</Badge>,
    discount: item.discount ? `${item.discount}%` : 'N/A',
    actions: (
      <HStack spacing={2}>
        <IconButton
          icon={<EditIcon />}
          size='sm'
          variant='ghost'
          aria-label='Edit'
          onClick={() => handleToggleEdit(item)}
        />
        <IconButton
          icon={<DeleteIcon />}
          size='sm'
          variant='ghost'
          aria-label='Delete'
          colorScheme='red'
          onClick={() => handleToggleDelete(item)}
        />
      </HStack>
    )
  }))

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
    <Box p={4}>
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
      />
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
        <DataTable
          headers={headers}
          dataInTable={dataInTable}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={Math.ceil(adminProductStore.totalProducts / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  )
})

export default Products
