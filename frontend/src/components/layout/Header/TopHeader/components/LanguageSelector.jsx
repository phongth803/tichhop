import { Select } from '@chakra-ui/react'
import { LANGUAGES } from '@/components/layout/Header/constants'

const LanguageSelector = () => {
  return (
    <Select
      w='auto'
      size='sm'
      variant='unstyled'
      color='white'
      defaultValue='en'
      _hover={{ color: 'gray.200' }}
      sx={{
        option: {
          color: 'black',
          bg: 'white'
        }
      }}
    >
      {LANGUAGES.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </Select>
  )
}

export default LanguageSelector
