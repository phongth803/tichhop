import React, { useEffect, useState } from 'react'
import { Box, Heading, HStack, Button, Flex, Image, Text, Badge, IconButton } from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import DataTable from '../../../components/common/DataTable'
import ConfirmModal from '../../../components/common/ConfirmModal'
import { useStore } from '../../../stores/rootStore'
import Loading from '../../../components/common/Loading'
import { observer } from 'mobx-react-lite'

const Users = observer(() => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const { userStore } = useStore()
  const { userList, loading } = userStore

  const headers = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'actions', label: 'Actions' }
  ]

  const handleEdit = (item) => {
    console.log('Edit:', item)
  }

  const handleDelete = (item) => {
    setIsRemoveModalOpen(true)
  }

  const dataInTable = userList?.map((item) => ({
    fullName: `${item.firstName} ${item.lastName}`,
    role: item.role === 'admin' ? <Badge colorScheme='purple'>Admin</Badge> : <Badge colorScheme='green'>User</Badge>,
    email: item.email,
    address: item.address,
    actions: (
      <HStack spacing={2}>
        <IconButton icon={<EditIcon />} size='sm' variant='ghost' aria-label='Edit' onClick={() => handleEdit(item)} />
        <IconButton
          icon={<DeleteIcon />}
          size='sm'
          variant='ghost'
          aria-label='Delete'
          colorScheme='red'
          onClick={() => handleDelete(item)}
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
    <>
      {loading ? (
        <Loading text='Loading users...' />
      ) : (
        <Box p={4}>
          <Flex justify='space-between' align='center' mb={4}>
            <Heading size='lg'>Users</Heading>
            <HStack spacing={4}>
              <Button>Filter</Button>
              <Button>See All</Button>
              <Button colorScheme='purple'>Add User</Button>
            </HStack>
          </Flex>
          {isRemoveModalOpen && (
            <ConfirmModal
              isOpen={isRemoveModalOpen}
              onClose={() => setIsRemoveModalOpen(false)}
              onConfirm={handleDelete}
              title='Delete User'
              message='Are you sure you want to delete this user?'
            />
          )}
          <DataTable
            headers={headers}
            dataInTable={dataInTable}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </>
  )
})

export default Users
