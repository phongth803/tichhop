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
  InputLeftElement,
  VStack,
  SimpleGrid,
  Divider
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, SearchIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
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
import useIsMobile from '@/hooks/useIsMobile'

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
  const [expandedRows, setExpandedRows] = useState(new Set())
  const isMobile = useIsMobile()

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

  const headers = isMobile
    ? [
        { key: 'fullName', label: 'Full Name', width: '50%' },
        { key: 'role', label: 'Role', width: '30%' },
        { key: 'expand', label: '', width: '20%' }
      ]
    : [
        { key: 'fullName', label: 'Full Name' },
        { key: 'role', label: 'Role' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
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

  const dataInTable = userList?.map((item) => {
    const baseData = {
      fullName: isMobile ? (
        <VStack align='start' spacing={{ base: 0.5, md: 1 }} width='100%' maxW='100%'>
          <Text fontWeight='semibold' fontSize={{ base: 'sm', md: 'md' }} noOfLines={1}>
            {`${item.firstName} ${item.lastName}`}
          </Text>
        </VStack>
      ) : (
        <VStack align='start' spacing={{ base: 0.5, md: 1 }} width='100%' maxW='100%'>
          <Text fontWeight='semibold' fontSize={{ base: 'sm', md: 'md' }} noOfLines={1}>
            {`${item.firstName} ${item.lastName}`}
          </Text>
          <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' noOfLines={1}>
            {item.email}
          </Text>
        </VStack>
      ),
      role: (
        <Box minW='60px' maxW='80px'>
          {item.role === 'admin' ? (
            <Badge colorScheme='purple' fontSize={{ base: 'xs', md: 'sm' }}>
              Admin
            </Badge>
          ) : (
            <Badge colorScheme='green' fontSize={{ base: 'xs', md: 'sm' }}>
              User
            </Badge>
          )}
        </Box>
      )
    }

    if (isMobile) {
      return {
        ...baseData,
        expand: (
          <Box display='flex' justifyContent='flex-end' width='100%' maxW='40px' ml='auto'>
            <IconButton
              icon={expandedRows.has(item._id) ? <ViewOffIcon /> : <ViewIcon />}
              size='sm'
              variant='ghost'
              aria-label='View details'
              color={expandedRows.has(item._id) ? 'purple.500' : 'gray.500'}
              _hover={{ color: 'purple.500' }}
              onClick={() => handleToggleExpand(item._id)}
              padding={1}
            />
          </Box>
        ),
        expandedContent: expandedRows.has(item._id) && (
          <Box
            bg='gray.50'
            p={{ base: 3, md: 4 }}
            borderRadius='md'
            mx={0}
            mb={{ base: 2, md: 4 }}
            boxShadow='sm'
            width='100%'
          >
            <SimpleGrid columns={2} spacing={{ base: 3, md: 4 }} mb={{ base: 3, md: 4 }}>
              <Box>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mb={1}>
                  Email
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight='medium' noOfLines={2}>
                  {item.email}
                </Text>
              </Box>
              <Box>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mb={1}>
                  Status
                </Text>
                <Badge colorScheme={item.isActive ? 'green' : 'red'} fontSize={{ base: 'xs', md: 'sm' }}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Box>
            </SimpleGrid>

            <SimpleGrid columns={2} spacing={{ base: 3, md: 4 }} mb={{ base: 3, md: 4 }}>
              <Box>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mb={1}>
                  Phone
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight='medium'>
                  {item.phone || '-'}
                </Text>
              </Box>
              <Box>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mb={1}>
                  Address
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight='medium'>
                  {item.address || '-'}
                </Text>
              </Box>
            </SimpleGrid>

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
      email: item.email,
      phone: item.phone || '-',
      address: item.address || '-',
      status: (
        <Badge colorScheme={item.isActive ? 'green' : 'red'} fontSize={{ base: 'xs', md: 'sm' }}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
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
  })

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
    <Box p={{ base: 0, md: 4 }} width='100%' overflowX={{ base: 'hidden', md: 'auto' }}>
      <Box px={{ base: 1, md: 2 }} mb={4}>
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
          isMobile={isMobile}
        />
      </Box>
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
        <Box width='100%' overflowX='auto' px={{ base: 1, md: 0 }}>
          <DataTable
            headers={headers}
            dataInTable={dataInTable}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={Math.ceil(pagination?.totalItems / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  )
})

export default Users
