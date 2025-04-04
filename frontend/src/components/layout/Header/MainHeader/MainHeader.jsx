import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Container,
  HStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  DrawerCloseButton
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Logo, Navigation, SearchBar, ActionButtons } from './components'
import useIsMobile from '@/hooks/useIsMobile'

const MainHeader = () => {
  const isMobile = useIsMobile()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const location = useLocation()

  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [location.pathname])

  return (
    <Box py={4} borderBottom='1px' borderColor='gray.200' bg='white'>
      <Container maxW='container.xl'>
        <HStack justify='space-between' align='center' spacing={8}>
          {isMobile ? (
            <>
              <IconButton aria-label='Menu' icon={<HamburgerIcon />} variant='ghost' onClick={onOpen} />
              <Logo />
              <ActionButtons isMobile={isMobile} />
            </>
          ) : (
            <>
              <Logo />
              <Navigation />
              <HStack spacing={6}>
                <SearchBar />
                <ActionButtons />
              </HStack>
            </>
          )}
        </HStack>
      </Container>

      {/* Mobile Drawer */}
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px' fontWeight='bold' fontSize='2xl' color='red.500'>
            PDT
          </DrawerHeader>
          <DrawerBody px={0}>
            <Box p={4}>
              <SearchBar isMobile={true} />
            </Box>
            <Navigation isMobile={true} onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default MainHeader
