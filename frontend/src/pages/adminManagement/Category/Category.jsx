import React, { useEffect, useState } from 'react'
import { Box, Heading, HStack, Button, Flex, Image, Text, Badge, IconButton } from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import DataTable from '../../../components/common/DataTable'
import ConfirmModal from '../../../components/common/ConfirmModal'
import { useStore } from '../../../stores/rootStore'
import { observer } from 'mobx-react-lite'
import TaskBarAdmin from '../../../components/common/TaskBarAdmin'
import { toast } from 'react-toastify'
import CategoryModal from './components/CategoryModal'

const Category = observer(() => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { adminCategoryStore } = useStore()
  const { categoryList, loading, addCategory, deleteCategory, updateCategory, totalItems, currentPage, totalPages } = adminCategoryStore

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

  const headers = [
    { key: 'name', label: 'Category Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ]

  const handleToggleEdit = (item) => {
    setIsEdit(true)
    setSelectedCategory(item)
  }

  const handleEdit = async (data) => {
    try {
      const isSuccess = await updateCategory(selectedCategory._id, data)
      if (isSuccess) {
        toast.success('Category updated successfully')
        adminCategoryStore.getCategories({ all: true })
        setIsEdit(false)
        setSelectedCategory(null)
      }
    } catch (error) {
      setIsEdit(false)
      setSelectedCategory(null)
      toast.error('Error updating category: ' + error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const isSuccess = await deleteCategory(selectedCategory._id)
      if (isSuccess) {
        toast.success('Category deleted successfully')
        adminCategoryStore.getCategories({ all: true })
        setIsRemoveModalOpen(false)
        setSelectedCategory(null)
      }
    } catch (error) {
      toast.error('Error deleting category: ' + error.message)
      setIsRemoveModalOpen(false)
      setSelectedCategory(null)
    }
  }

  const handleToggleDelete = (item) => {
    setSelectedCategory(item)
    setIsRemoveModalOpen((prev) => !prev)
  }

  const handleSearch = (value) => {
    setSearchQuery(value || '')
    adminCategoryStore.getCategories({ search: value || '', all: true })
  }

  const handlePageChange = (page, itemsPerPage) => {
    adminCategoryStore.getCategories({ 
      page, 
      limit: itemsPerPage,
      search: searchQuery || '',
      all: true 
    })
  }

  const dataInTable = categoryList?.map((item) => ({
    name: item.name,
    description: item.description,
    status: item.isActive ? <Badge colorScheme='green'>Active</Badge> : <Badge colorScheme='red'>Inactive</Badge>,
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

  useEffect(() => {
    adminCategoryStore.getCategories({ all: true })
  }, [])

  return (
    <Box p={4}>
      <TaskBarAdmin
        buttonText='Add Category'
        title={'Categories'}
        isAdd={true}
        handleAdd={() => setIsAddModalOpen(true)}
        searchPlaceholder='Search categories...'
        searchValue={searchQuery || ''}
        onSearchChange={(e) => handleSearch(e.target.value)}
      />

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
      <DataTable
        headers={headers}
        dataInTable={dataInTable}
        currentPage={currentPage}
        itemsPerPage={10}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        totalPages={totalPages}
      />
    </Box>
  )
})

export default Category
