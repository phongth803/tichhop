import React, { useEffect, useState } from 'react'
import { 
  Box, 
  HStack, 
  IconButton, 
  Badge, 
  Text, 
  VStack,
  SimpleGrid,
  Divider
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import DataTable from '@/components/common/DataTable'
import ConfirmModal from '@/components/common/ConfirmModal'
import { useStore } from '@/stores/rootStore'
import { observer } from 'mobx-react-lite'
import TaskBarAdmin from '@/components/common/TaskBarAdmin'
import { toast } from 'react-toastify'
import FilterModal from '@/components/common/FilterModal'
import CategoryModal from './components/CategoryModal'
import useIsMobile from '@/hooks/useIsMobile'

const Category = observer(() => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const { adminCategoryStore } = useStore()
  const { categoryList, loading, addCategory, deleteCategory, updateCategory } = adminCategoryStore
  const isMobile = useIsMobile()

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

  const handleAddCategory = async (categoryData) => {
    try {
      const isSuccess = await addCategory(categoryData)
      if (isSuccess) {
        toast.success('Category created successfully')
        setIsAddModalOpen(false)
        adminCategoryStore.getCategories({ all: true })
      }
    } catch (error) {
      toast.error('Error adding category: ' + error.message)
    }
  }

  const headers = isMobile
    ? [
        { key: 'name', label: 'Category Name' },
        { key: 'status', label: 'Status' },
        { key: 'expand', label: '' }
      ]
    : [
        { key: 'name', label: 'Category Name' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ]

  const handleToggleEdit = (item) => {
    setIsEdit(true)
    setSelectedCategory(item)
  }

  const handleToggleDelete = (item) => {
    setSelectedCategory(item)
    setIsRemoveModalOpen(true)
  }

  const handleDelete = async () => {
    try {
      const isSuccess = await deleteCategory(selectedCategory._id)
      if (isSuccess) {
        toast.success('Category deleted successfully')
        setIsRemoveModalOpen(false)
        setSelectedCategory(null)
        adminCategoryStore.getCategories({ all: true })
      }
    } catch (error) {
      toast.error('Error deleting category: ' + error.message)
    }
  }

  const handleEdit = async (categoryData) => {
    try {
      const isSuccess = await updateCategory(selectedCategory._id, categoryData)
      if (isSuccess) {
        toast.success('Category updated successfully')
        setIsEdit(false)
        setSelectedCategory(null)
        adminCategoryStore.getCategories({ all: true })
      }
    } catch (error) {
      toast.error('Error updating category: ' + error.message)
    }
  }

  const dataInTable = categoryList?.map((item) => {
    const baseData = {
      name: (
        <Text fontWeight="semibold">
          {item.name}
        </Text>
      ),
      status: (
        <Badge colorScheme={item.isActive ? 'green' : 'red'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
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
          <Box 
            bg="gray.50" 
            p={4}
            borderRadius="md"
            mx={0}
            mb={4}
            boxShadow="sm"
          >
            <Box mb={4}>
              <Text fontSize="sm" color="gray.500" mb={1}>Description</Text>
              <Text fontSize="md">{item.description || 'No description'}</Text>
            </Box>

            <Divider mb={4} />

            <HStack spacing={3} justify="flex-end">
              <IconButton
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                aria-label="Edit"
                onClick={() => handleToggleEdit(item)}
              />
              <IconButton
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                aria-label="Delete"
                onClick={() => handleToggleDelete(item)}
              />
            </HStack>
          </Box>
        )
      }
    }

    return {
      ...baseData,
      description: item.description || 'No description',
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
    }
  }) || []

  useEffect(() => {
    adminCategoryStore.getCategories({ all: true })
  }, [])

  return (
    <Box p={{ base: 0, md: 4 }} width="100%" overflowX={{ base: 'hidden', md: 'auto' }}>
      <Box px={2}>
        <TaskBarAdmin
          title='Categories'
          isFilter={false}
          isAdd={true}
          handleAdd={() => setIsAddModalOpen(true)}
          buttonText='Add Category'
          isMobile={isMobile}
        />
      </Box>

      <ConfirmModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleDelete}
        title='Delete Category'
        message={`Are you sure you want to delete ${selectedCategory?.name}?`}
        isLoading={loading}
      />

      <CategoryModal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        onSubmit={handleEdit}
        isEdit={true}
        initialData={selectedCategory}
      />

      <CategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategory}
        isEdit={false}
        initialData={null}
      />

      {loading ? (
        <Loading />
      ) : (
        <Box width="100%" overflowX="auto">
          <DataTable
            headers={headers}
            dataInTable={dataInTable}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={Math.ceil(categoryList?.length / itemsPerPage)}
            onPageChange={(page, newItemsPerPage) => {
              setCurrentPage(page)
              setItemsPerPage(newItemsPerPage)
            }}
          />
        </Box>
      )}
    </Box>
  )
})

export default Category
