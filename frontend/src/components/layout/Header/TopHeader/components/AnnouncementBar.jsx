import { Text } from '@chakra-ui/react'
import { ANNOUNCEMENT_TEXT } from '@/components/layout/Header/constants'

const AnnouncementBar = () => {
  return (
    <Text color='white' fontSize='sm'>
      {ANNOUNCEMENT_TEXT}{' '}
      <Text
        as='span'
        textDecoration='underline'
        cursor='pointer'
        _hover={{ color: 'gray.200' }}
        transition='color 0.2s'
        fontWeight='bold'>
        ShopNow
      </Text>
    </Text>
  )
}

export default AnnouncementBar
