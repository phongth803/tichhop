import { HStack, IconButton } from '@chakra-ui/react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

const NavigationButtons = ({ onPrev, onNext }) => (
  <HStack spacing={2}>
    <IconButton icon={<FiArrowLeft />} variant='outline' size='md' borderColor='gray.200' onClick={onPrev} />
    <IconButton icon={<FiArrowRight />} variant='outline' size='md' borderColor='gray.200' onClick={onNext} />
  </HStack>
)

export default NavigationButtons
