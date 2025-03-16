import { Box } from '@chakra-ui/react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <Box minH='100vh' display='flex' flexDirection='column'>
      <Header />
      <Box flex='1' as='main' py={8} px={4}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}

export default Layout
