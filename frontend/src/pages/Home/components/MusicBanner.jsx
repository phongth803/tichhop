import { Box, Text, Heading, Grid, Button, Image } from '@chakra-ui/react'
import jblSpeaker from '@/assets/images/jbl-speaker.png'

const MusicBanner = ({ bannerCountdown }) => (
  <Box my={8} bg='black' color='white' borderRadius='xl' overflow='hidden' position='relative' p={{ base: 4, md: 8 }}>
    <Box maxW={{ base: '100%', md: '50%' }} position='relative' zIndex={1}>
      <Text color='#00FF66' mb={2}>
        Categories
      </Text>
      <Heading size={{ base: 'xl', md: '2xl' }} mb={8}>
        Enhance Your
        <br />
        Music Experience
      </Heading>
      <Grid 
        templateColumns='repeat(4, 1fr)' 
        gap={{ base: 2, md: 4 }} 
        mb={8} 
        maxW='400px'
      >
        {[
          { value: bannerCountdown.hours, label: 'Hours' },
          { value: bannerCountdown.days, label: 'Days' },
          { value: bannerCountdown.minutes, label: 'Minutes' },
          { value: bannerCountdown.seconds, label: 'Seconds' }
        ].map((item) => (
          <Box
            key={item.label}
            bg='white'
            color='black'
            borderRadius='full'
            width={{ base: '60px', md: '80px' }}
            height={{ base: '60px', md: '80px' }}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
          >
            <Text fontSize='20px' fontWeight='600'>
              {String(item.value).padStart(2, '0')}
            </Text>
            <Text fontSize='xs'>{item.label}</Text>
          </Box>
        ))}
      </Grid>
      <Button bg='#00FF66' color='white' size={{ base: 'md', md: 'lg' }} px={8}>
        Buy Now!
      </Button>
    </Box>
    <Image
      src={jblSpeaker}
      position='absolute'
      right={0}
      top='50%'
      transform='translateY(-50%) scaleX(-1)'
      maxW={{ base: '80%', md: '60%' }}
      opacity={{ base: 0.3, md: 1 }}
      objectFit='contain'
      sx={{
        filter: 'drop-shadow(0 0 20px rgba(0,255,102,0.2))' // Thêm hiệu ứng glow xanh
      }}
    />
  </Box>
)

export default MusicBanner
