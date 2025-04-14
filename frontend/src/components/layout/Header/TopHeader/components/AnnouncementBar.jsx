import { Text } from '@chakra-ui/react'
import { ANNOUNCEMENT_TEXT } from '@/components/layout/Header/constants'
import { useNavigate } from 'react-router-dom'

const AnnouncementBar = () => {
  const navigate = useNavigate()

  const handleShopNow = () => {
    navigate('/products')
  }

  return (
    <Text color='white' fontSize='sm'>
      {ANNOUNCEMENT_TEXT}{' '}
      <Text
        as='span'
        textDecoration='underline'
        cursor='pointer'
        _hover={{ color: 'gray.200' }}
        transition='color 0.2s'
        fontWeight='bold'
        onClick={handleShopNow}
      >
        ShopNow
      </Text>
    </Text>
  )
}

export default AnnouncementBar
