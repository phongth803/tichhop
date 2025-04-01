import {
  Box,
  Container,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Input,
  Image,
  Link,
  InputRightElement,
  InputGroup
} from '@chakra-ui/react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import qrCode from '@/assets/images/qr-code.png'
import googlePlay from '@/assets/images/google-play.png'
import appStore from '@/assets/images/app-store.png'

const Footer = () => {
  return (
    <Box as='footer' bg='black' color='white'>
      <Container maxW='container.xl' py={{ base: 8, md: 16 }}>
        <Grid
          templateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)'
          }}
          gap={8}
        >
          {/* Subscribe */}
          <GridItem w='100%'>
            <VStack align='flex-start' spacing={4}>
              <Text fontWeight='bold' fontSize='2xl'>
                PDT
              </Text>
              <Text fontSize='sm'>Subscribe</Text>
              <Text fontSize='sm'>Get 10% off your first order</Text>
              <HStack w='100%' position='relative'>
                <InputGroup size='md'>
                  <Input
                    placeholder='Enter your email'
                    bg='transparent'
                    border='1px'
                    borderColor='whiteAlpha.400'
                    borderRadius='4px'
                    height='45px'
                    fontSize='sm'
                    pl={4}
                    _placeholder={{ color: 'whiteAlpha.600' }}
                    _hover={{ borderColor: 'whiteAlpha.600' }}
                    _focus={{ borderColor: 'white', boxShadow: 'none' }}
                  />
                  <InputRightElement h='45px' w='45px'>
                    <Box
                      as='button'
                      h='45px'
                      w='45px'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      cursor='pointer'
                      transition='all 0.2s'
                      _hover={{ transform: 'translateX(2px)' }}
                    >
                      <Box
                        as='svg'
                        width='20px'
                        height='20px'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <line x1='5' y1='12' x2='19' y2='12' />
                        <polyline points='12 5 19 12 12 19' />
                      </Box>
                    </Box>
                  </InputRightElement>
                </InputGroup>
              </HStack>
            </VStack>
          </GridItem>

          {/* Support */}
          <GridItem w='100%'>
            <VStack align='flex-start' spacing={4}>
              <Text fontWeight='bold' fontSize='lg'>
                Support
              </Text>
              <VStack align='flex-start' spacing={2}>
                <Text>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</Text>
                <Text>exclusive@gmail.com</Text>
                <Text>+88015-88888-9999</Text>
              </VStack>
            </VStack>
          </GridItem>

          {/* Account */}
          <GridItem w='100%'>
            <VStack align='flex-start' spacing={4}>
              <Text fontWeight='bold' fontSize='lg'>
                Account
              </Text>
              <VStack align='flex-start' spacing={2}>
                <Link href='/profile/edit'>My Account</Link>
                <Link href='/cart'>Cart</Link>
                <Link href='/wishlist'>Wishlist</Link>
                <Link href='/shop'>Shop</Link>
              </VStack>
            </VStack>
          </GridItem>

          {/* Quick Link */}
          <GridItem w='100%'>
            <VStack align='flex-start' spacing={4}>
              <Text fontWeight='bold' fontSize='lg'>
                Quick Link
              </Text>
              <VStack align='flex-start' spacing={2}>
                <Link href='/privacy-policy'>Privacy Policy</Link>
                <Link href='/terms-of-use'>Terms Of Use</Link>
                <Link href='/faq'>FAQ</Link>
                <Link href='/contact'>Contact</Link>
              </VStack>
            </VStack>
          </GridItem>

          {/* Download App */}
          <GridItem w='100%' colSpan={{ base: 'auto', sm: 2, md: 'auto' }}>
            <VStack align='flex-start' spacing={4}>
              <Text fontWeight='bold' fontSize='lg'>
                Download App
              </Text>
              <Text fontSize='sm'>Save $3 with App New User Only</Text>
              <HStack spacing={4} mb={2}>
                <Box>
                  <Image src={qrCode} alt='QR Code' width='100px' borderRadius='md' />
                </Box>
                <VStack spacing={3}>
                  <Link href='https://play.google.com/store' isExternal>
                    <Image
                      src={googlePlay}
                      alt='Get it on Google Play'
                      height='36px'
                      transition='all 0.2s'
                      _hover={{ transform: 'scale(1.05)' }}
                    />
                  </Link>
                  <Link href='https://www.apple.com/app-store/' isExternal>
                    <Image
                      src={appStore}
                      alt='Download on the App Store'
                      height='36px'
                      transition='all 0.2s'
                      _hover={{ transform: 'scale(1.05)' }}
                    />
                  </Link>
                </VStack>
              </HStack>
              <HStack spacing={6} pt={2}>
                {[
                  { icon: FaFacebook, href: 'https://facebook.com' },
                  { icon: FaTwitter, href: 'https://twitter.com' },
                  { icon: FaInstagram, href: 'https://instagram.com' },
                  { icon: FaLinkedin, href: 'https://linkedin.com' }
                ].map((social, index) => (
                  <Link key={index} href={social.href} isExternal>
                    <Box
                      as={social.icon}
                      boxSize='24px'
                      color='white'
                      opacity={0.8}
                      transition='all 0.2s'
                      _hover={{
                        opacity: 1,
                        transform: 'translateY(-2px)'
                      }}
                    />
                  </Link>
                ))}
              </HStack>
            </VStack>
          </GridItem>
        </Grid>
      </Container>

      <Box borderTop='1px' borderColor='whiteAlpha.200'>
        <Container maxW='container.xl' py={6}>
          <Text color='gray.500' fontSize='sm' textAlign='center'>
            © Copyright Rimel 2022. All right reserved
          </Text>
        </Container>
      </Box>
    </Box>
  )
}

export default Footer
