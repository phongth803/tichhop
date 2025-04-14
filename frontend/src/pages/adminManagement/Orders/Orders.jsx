import React, { useEffect, useState } from 'react'
import {
  Box,
  Badge,
  IconButton,
  HStack,
  Text,
  Link,
  VStack,
  SimpleGrid,
  Divider,
  useBreakpointValue
} from '@chakra-ui/react'
import { EditIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import DataTable from '@/components/common/DataTable'
import TaskBarAdmin from '@/components/common/TaskBarAdmin'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/rootStore'
import Loading from '@/components/common/Loading'
import { useDebounce } from '@/hooks/useDebounce'
import { toast } from 'react-toastify'
import OrderStatusModal from './components/OrderStatusModal'
import OrderFilter from './components/OrderFilter'
import OrderItemsModal from './components/OrderItemsModal'
import useIsMobile from '@/hooks/useIsMobile'

const Orders = observer(() => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [filters, setFilters] = useState({
    status: ''
  })
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { orderStore } = useStore()
  const { orderList, loading, isListLoading, pagination, updateOrderStatus } = orderStore
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

  const headers = isMobile
    ? [
        { key: 'customerName', label: 'Customer Name' },
        { key: 'status', label: 'Status' },
        { key: 'expand', label: '' }
      ]
    : [
        { key: 'customerName', label: 'Customer Name' },
        { key: 'totalAmount', label: 'Total Amount' },
        { key: 'items', label: 'Items' },
        { key: 'createdAt', label: 'Order Date' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ]

  const handleStatusUpdate = async (statusData) => {
    try {
      const isSuccess = await updateOrderStatus(selectedOrder._id, statusData)
      if (isSuccess) {
        toast.success('Order status updated successfully')
        orderStore.getAllOrders(currentPage, itemsPerPage, debouncedSearchTerm, filters)
        setIsStatusModalOpen(false)
        setSelectedOrder(null)
      }
    } catch (error) {
      toast.error('Error updating order status: ' + error.message)
      setIsStatusModalOpen(false)
      setSelectedOrder(null)
    }
  }

  const handleToggleStatus = (item) => {
    setSelectedOrder(item)
    setIsStatusModalOpen(true)
  }

  const handleViewItems = (item) => {
    setSelectedOrder(item)
    setIsItemsModalOpen(true)
  }

  const dataInTable = orderList?.map((item) => {
    const baseData = {
      customerName: (
        <Text fontWeight="semibold">
          {`${item.user?.firstName} ${item.user?.lastName}`}
        </Text>
      ),
      status: (
        <Badge colorScheme={
          item.status === 'delivered' ? 'green' :
          item.status === 'pending' ? 'yellow' :
          item.status === 'processing' ? 'blue' :
          item.status === 'cancelled' ? 'red' : 'gray'
        }>
          {(item.status?.charAt(0).toUpperCase() + item.status?.slice(1)) || 'Unknown'}
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
            <SimpleGrid columns={2} spacing={4} mb={4}>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>Total Amount</Text>
                <Text fontSize="md" fontWeight="medium">${Number(item.totalAmount || 0).toFixed(2)}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>Order Date</Text>
                <Text fontSize="md" fontWeight="medium">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </Box>
            </SimpleGrid>

            <Box mb={4}>
              <Text fontSize="sm" color="gray.500" mb={1}>Items</Text>
              <Link
                color="blue.500"
                onClick={() => handleViewItems(item)}
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                View Items
              </Link>
            </Box>

            <Divider mb={4} />

            <HStack spacing={3} justify="flex-end">
              <IconButton
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                aria-label="Update Status"
                onClick={() => handleToggleStatus(item)}
              />
            </HStack>
          </Box>
        )
      }
    }

    return {
      ...baseData,
      totalAmount: `$${Number(item.totalAmount || 0).toFixed(2)}`,
      items: (
        <Link
          color="blue.500"
          onClick={() => handleViewItems(item)}
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
        >
          Items
        </Link>
      ),
      createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
      actions: (
        <HStack spacing={2}>
          <IconButton
            icon={<EditIcon />}
            size='sm'
            variant='ghost'
            aria-label='Update Status'
            onClick={() => handleToggleStatus(item)}
          />
        </HStack>
      )
    }
  }) || []

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    orderStore.getAllOrders(1, itemsPerPage, debouncedSearchTerm, newFilters)
  }

  const handlePageChange = async (page, newItemsPerPage) => {
    setCurrentPage(page)
    setItemsPerPage(newItemsPerPage)
    await orderStore.getAllOrders(page, newItemsPerPage, debouncedSearchTerm, filters)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  useEffect(() => {
    orderStore.getAllOrders(currentPage, itemsPerPage, debouncedSearchTerm, filters)
  }, [currentPage, itemsPerPage, debouncedSearchTerm])

  return (
    <Box p={{ base: 0, md: 4 }} width="100%" overflowX={{ base: 'hidden', md: 'auto' }}>
      <Box px={2}>
        <TaskBarAdmin
          title='Orders'
          isFilter={true}
          isAdd={false}
          handleOpenFilter={() => setIsFilterOpen(true)}
          searchPlaceholder='Search by customer name...'
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          isMobile={isMobile}
        />
      </Box>
      
      <OrderStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSubmit={handleStatusUpdate}
        initialData={selectedOrder}
      />

      <OrderItemsModal
        isOpen={isItemsModalOpen}
        onClose={() => setIsItemsModalOpen(false)}
        items={selectedOrder?.items || []}
      />

      <OrderFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilter={handleFilter}
        currentFilters={filters}
      />

      {isListLoading ? (
        <Loading />
      ) : (
        <Box width="100%" overflowX="auto">
          <DataTable
            headers={headers}
            dataInTable={dataInTable}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  )
})

export default Orders
