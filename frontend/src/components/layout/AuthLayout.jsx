import { Flex, Box } from '@chakra-ui/react'
import logoAuth from '../../assets/icons/logoAuth.svg'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <Flex minH='calc(80vh - 64px)' w='full'>
      <Box
        flex='1'
        display={{ base: 'none', lg: 'block' }}
        bgImage={`url(${logoAuth})`}
        bgSize='cover'
        bgPosition='center'
        bgRepeat='no-repeat'
        backgroundColor='brand.lightBlue'
        maxW={{ lg: '50%' }}
      />

      <Flex flex={{ base: '1', lg: '1' }} alignItems='center' justifyContent='center'>
        <Box w='full' maxW='480px'>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}

export default AuthLayout
