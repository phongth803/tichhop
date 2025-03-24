import React, { useState } from 'react'
import { Box, Heading, HStack, Button, Flex, Image, Text, Badge, IconButton } from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import DataTable from '../../../components/common/DataTable'
import ConfirmModal from '../../../components/common/ConfirmModal'

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

  const headers = [
    { key: 'productInfo', label: 'Product Name' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'stock', label: 'Stock' },
    { key: 'statusBadge', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ]

  const rawData = [
    {
      id: 1,
      image: '/path-to-image/tshirt.jpg',
      productName: 'T-Shirt',
      startDate: '20-07-2024 12:00am',
      endDate: '30-07-2024 12:00pm',
      stock: 79,
      status: 'Upcoming'
    }
  ]

  const handleEdit = (item) => {
    console.log('Edit:', item)
  }

  const handleDelete = (item) => {
    setIsRemoveModalOpen(true)
  }

  const dataInTable = rawData.map((item) => ({
    productInfo: (
      <HStack>
        <Image src={item.image} boxSize='40px' objectFit='cover' borderRadius='md' />
        <Text>{item.productName}</Text>
      </HStack>
    ),
    startDate: item.startDate,
    endDate: item.endDate,
    stock: item.stock,
    statusBadge: (
      <Badge
        colorScheme={item.status === 'Upcoming' ? 'blue' : item.status === 'Ongoing' ? 'green' : 'red'}
        borderRadius='full'
        px={2}
      >
        {item.status}
      </Badge>
    ),
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

  return (
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
        totalItems={rawData.length}
        onPageChange={handlePageChange}
      />
    </Box>
  )
}

export default Users
