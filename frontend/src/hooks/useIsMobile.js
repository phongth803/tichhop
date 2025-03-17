import { useBreakpointValue } from '@chakra-ui/react'

const useIsMobile = () => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  return isMobile
}

export default useIsMobile