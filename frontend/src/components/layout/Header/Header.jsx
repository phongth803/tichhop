import { Box } from '@chakra-ui/react'
import TopHeader from './TopHeader'
import MainHeader from './MainHeader'
import useIsMobile from '@/hooks/useIsMobile'

const Header = () => {
  const isMobile = useIsMobile()

  return (
    <Box as='header' position='sticky' top={0} zIndex={1000} bg='white' boxShadow='sm'>
      {!isMobile && <TopHeader />} {/* Ẩn TopHeader trên mobile */}
      <MainHeader />
    </Box>
  )
}

export default Header
