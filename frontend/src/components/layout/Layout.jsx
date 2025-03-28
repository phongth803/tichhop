import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/rootStore'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BreadcrumbNav from '@/components/common/Breadcrumb'

const Layout = observer(() => {
  const {
    authStore: { loading }
  } = useStore()

  if (loading) {
    return (
      <Center h='100vh'>
        <Spinner size='xl' color='red.500' />
      </Center>
    )
  }

  return (
    <Box minH='100vh' display='flex' flexDirection='column'>
      <Header />
      <BreadcrumbNav />
      <Box flex='1' as='main'>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
})

export default Layout
