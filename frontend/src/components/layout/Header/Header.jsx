import { Box } from '@chakra-ui/react'
import TopHeader from './TopHeader'
import MainHeader from './MainHeader'

const Header = () => {
  return (
    <Box as='header' position='sticky' top={0} zIndex={1000} bg='white' boxShadow='sm'>
      <TopHeader />
      <MainHeader />
    </Box>
  )
}

export default Header
