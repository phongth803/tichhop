import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/rootStore'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

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
      <Box flex='1' as='main' py={8}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
})

export default Layout
