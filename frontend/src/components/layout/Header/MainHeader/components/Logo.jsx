import { Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to='/'>
      <Text fontSize='2xl' fontWeight='bold' _hover={{ opacity: 0.8 }} transition='opacity 0.2s'>
        Exclusive
      </Text>
    </Link>
  )
}

export default Logo
