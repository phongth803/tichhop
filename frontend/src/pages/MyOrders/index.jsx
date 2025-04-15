import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/rootStore'
import { Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, useBreakpointValue } from '@chakra-ui/react'
import Loading from '@/components/common/Loading'
import OrderList from '@/components/MyOrders/OrderList'

const MyOrders = observer(() => {
  const { userOrderStore } = useStore()
  const [tabIndex, setTabIndex] = useState(0)
  const [defaultIndex, setDefaultIndex] = useState([])
  const isMobile = useBreakpointValue({ base: true, md: false })

  const handleTabChange = (index) => {
    setTabIndex(index)
    const status = getStatusFromIndex(index)
    userOrderStore.fetchOrders(status)
  }

  useEffect(() => {
    userOrderStore.fetchOrders()
  }, [])

  const getStatusFromIndex = (index) => {
    switch (index) {
      case 1:
        return 'pending'
      case 2:
        return 'processing'
      case 3:
        return 'delivered'
      case 4:
        return 'cancelled'
      default:
        return ''
    }
  }

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'yellow',
      processing: 'blue',
      delivered: 'green',
      cancelled: 'red'
    }
    return statusColors[status.toLowerCase()] || 'gray'
  }

  if (userOrderStore.loading) {
    return <Loading text='Loading orders...' />
  }

  return (
    <Container maxW='container.xl' py={4} px={{ base: 2, md: 8 }}>
      <Heading as='h1' size={{ base: 'lg', md: 'xl' }} mb={4}>
        My Orders
      </Heading>
      <Tabs variant='enclosed' index={tabIndex} onChange={handleTabChange}>
        <TabList
          overflowX='auto'
          overflowY='hidden'
          whiteSpace='nowrap'
          css={{
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          <Tab minWidth={isMobile ? '80px' : 'auto'} fontSize={{ base: 'sm', md: 'md' }}>
            All
          </Tab>
          <Tab minWidth={isMobile ? '80px' : 'auto'} fontSize={{ base: 'sm', md: 'md' }}>
            Pending
          </Tab>
          <Tab minWidth={isMobile ? '80px' : 'auto'} fontSize={{ base: 'sm', md: 'md' }}>
            Processing
          </Tab>
          <Tab minWidth={isMobile ? '80px' : 'auto'} fontSize={{ base: 'sm', md: 'md' }}>
            Delivered
          </Tab>
          <Tab minWidth={isMobile ? '80px' : 'auto'} fontSize={{ base: 'sm', md: 'md' }}>
            Cancelled
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={{ base: 0, md: 4 }}>
            <OrderList
              orders={userOrderStore.orders}
              getStatusColor={getStatusColor}
              defaultIndex={defaultIndex}
              setDefaultIndex={setDefaultIndex}
            />
          </TabPanel>
          <TabPanel px={{ base: 0, md: 4 }}>
            <OrderList
              orders={userOrderStore.orders}
              getStatusColor={getStatusColor}
              defaultIndex={defaultIndex}
              setDefaultIndex={setDefaultIndex}
            />
          </TabPanel>
          <TabPanel px={{ base: 0, md: 4 }}>
            <OrderList
              orders={userOrderStore.orders}
              getStatusColor={getStatusColor}
              defaultIndex={defaultIndex}
              setDefaultIndex={setDefaultIndex}
            />
          </TabPanel>
          <TabPanel px={{ base: 0, md: 4 }}>
            <OrderList
              orders={userOrderStore.orders}
              getStatusColor={getStatusColor}
              defaultIndex={defaultIndex}
              setDefaultIndex={setDefaultIndex}
            />
          </TabPanel>
          <TabPanel px={{ base: 0, md: 4 }}>
            <OrderList
              orders={userOrderStore.orders}
              getStatusColor={getStatusColor}
              defaultIndex={defaultIndex}
              setDefaultIndex={setDefaultIndex}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
})

export default MyOrders
