import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/rootStore'
import { Box } from '@chakra-ui/react'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import BreadcrumbNav from '@/components/common/Breadcrumb'
import Loading from '@/components/common/Loading'
import ScrollToTop from '@/components/common/ScrollToTop'
import ChatBubble from '@/components/chat/ChatBubble'

const Layout = observer(() => {
  const {
    authStore: { loading }
  } = useStore()

  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (loading) {
    return <Loading text='Loading...' />
  }

  return (
    <Box minH='100vh' display='flex' flexDirection='column'>
      <Header />
      <BreadcrumbNav />
      <Box flex='1' as='main'>
        <Outlet />
      </Box>
      <Footer />
      <ScrollToTop />
      <ChatBubble />
    </Box>
  )
})

export default Layout
