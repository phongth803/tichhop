import React, { useEffect, useState } from 'react'
import { Box, Heading, HStack, Button, Flex, Image, Text, Badge, IconButton } from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import DataTable from '../../../components/common/DataTable'
import ConfirmModal from '../../../components/common/ConfirmModal'
import { useStore } from '../../../stores/rootStore'
import Loading from '../../../components/common/Loading'
import { observer } from 'mobx-react-lite'
import TaskBarAdmin from '../../../components/common/TaskBarAdmin'
import UserActionModal from './components/AddUserModal'
import { toast } from 'react-toastify'

const Users = observer(() => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { userStore } = useStore()
  const { userList, loading, isListLoading, addUser, deleteUser, updateUser } = userStore

  const handleAddUser = async (userData) => {
    try {
      const isSuccess = await addUser(userData)
      if (isSuccess) {
        toast.success('User created successfully')
        setIsAddModalOpen(false)
        userStore.getUsers()
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
        userStore.getUsers()
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
        userStore.getUsers()
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

  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page)
    setItemsPerPage(newItemsPerPage)
  }

  useEffect(() => {
    userStore.getUsers()
  }, [])

  return (
    <Box p={4}>
      <TaskBarAdmin
        title={'Users'}
        isFilter={true}
        handleOpenFilter={() => setIsFilterOpen(true)}
        handleAdd={() => setIsAddModalOpen(true)}
        isAdd={true}
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
      <DataTable
        headers={headers}
        dataInTable={dataInTable}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </Box>
  )
})

export default Users
