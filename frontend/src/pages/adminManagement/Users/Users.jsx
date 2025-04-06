import React, { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  HStack,
  Button,
  Flex,
  Image,
  Text,
  Badge,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons'
import DataTable from '@/components/common/DataTable'
import ConfirmModal from '@/components/common/ConfirmModal'
import { useStore } from '@/stores/rootStore'
import { observer } from 'mobx-react-lite'
import TaskBarAdmin from '@/components/common/TaskBarAdmin'
import UserActionModal from './components/AddUserModal'
import UserFilter from './components/UserFilter'
import { toast } from 'react-toastify'
import Loading from '@/components/common/Loading'
import { useDebounce } from '@/hooks/useDebounce'

const Users = observer(() => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    role: '',
    status: ''
  })
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { userStore } = useStore()
  const { userList, loading, isListLoading, pagination, addUser, deleteUser, updateUser } = userStore

  const handleAddUser = async (userData) => {
    try {
      const isSuccess = await addUser(userData)
      if (isSuccess) {
        toast.success('User created successfully')
        setIsAddModalOpen(false)
        userStore.getUsers(currentPage, itemsPerPage)
      }
    } catch (error) {
      toast.error('Error adding user: ' + error.message)
    }
  }

  const headers = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ]

  const handleToggleEdit = (item) => {
    setIsEdit(true)
    setSelectedUser(item)
  }

  const handleEdit = async (data) => {
    try {
      const isSuccess = await updateUser(selectedUser._id, data)
      if (isSuccess) {
        toast.success('User updated successfully')
        userStore.getUsers(currentPage, itemsPerPage)
        setIsEdit(false)
        setSelectedUser(null)
      }
    } catch (error) {
      setIsEdit(false)
      setSelectedUser(null)
      toast.error('Error updating user: ' + error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const isSuccess = await deleteUser(selectedUser._id)
      if (isSuccess) {
        toast.success('User deleted successfully')
        userStore.getUsers(currentPage, itemsPerPage)
        setIsRemoveModalOpen(false)
        setSelectedUser(null)
      }
    } catch (error) {
      toast.error('Error deleting user: ' + error.message)
      setIsRemoveModalOpen(false)
      setSelectedUser(null)
    }
  }

  const handleToggleDelete = (item) => {
    setSelectedUser(item)
    setIsRemoveModalOpen((prev) => !prev)
  }

  const dataInTable = userList?.map((item) => ({
    fullName: `${item.firstName} ${item.lastName}`,
    role: item.role === 'admin' ? <Badge colorScheme='purple'>Admin</Badge> : <Badge colorScheme='green'>User</Badge>,
    email: item.email,
    address: item.address,
    status: <Badge colorScheme={item.isActive ? 'green' : 'red'}>{item.isActive ? 'Active' : 'Inactive'}</Badge>,
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
    userStore.getUsers(1, itemsPerPage, debouncedSearchTerm, newFilters)
  }

  const handlePageChange = async (page, newItemsPerPage) => {
    setCurrentPage(page)
    setItemsPerPage(newItemsPerPage)
    await userStore.getUsers(page, newItemsPerPage, debouncedSearchTerm, filters)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  useEffect(() => {
    userStore.getUsers(currentPage, itemsPerPage, debouncedSearchTerm, filters)
  }, [currentPage, itemsPerPage, debouncedSearchTerm])

  return (
    <Box p={4}>
      <TaskBarAdmin
        title='Users'
        isFilter={true}
        isAdd={true}
        handleOpenFilter={() => setIsFilterOpen(true)}
        handleAdd={() => setIsAddModalOpen(true)}
        buttonText='Add User'
        searchPlaceholder='Search by name...'
        searchValue={searchTerm}
        onSearchChange={handleSearch}
      />
      <ConfirmModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleDelete}
        title='Delete User'
        message={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
        isLoading={loading}
      />
      <UserActionModal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        onSubmit={handleEdit}
        isEdit={true}
        initialData={selectedUser}
      />
      <UserActionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
        isEdit={false}
        initialData={null}
      />
      <UserFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilter={handleFilter}
        currentFilters={filters}
      />
      {isListLoading ? (
        <Loading />
      ) : (
        <DataTable
          headers={headers}
          dataInTable={dataInTable}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  )
})

export default Users
