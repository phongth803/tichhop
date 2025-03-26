import { Box, Text, Heading, Grid, Button, Image } from '@chakra-ui/react'

const MusicBanner = ({ bannerCountdown }) => (
  <Box my={8} bg='black' color='white' borderRadius='xl' overflow='hidden' position='relative' p={8}>
    <Box maxW='50%'>
      <Text color='#00FF66' mb={2}>
        Categories
      </Text>
      <Heading size='2xl' mb={8}>
        Enhance Your
        <br />
        Music Experience
      </Heading>
      <Grid templateColumns='repeat(4, 1fr)' gap={4} mb={8} maxW='400px'>
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
            width='80px'
            height='80px'
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
      <Button bg='#00FF66' color='white' size='lg' px={8} _hover={{ bg: '#00DD55' }}>
        Buy Now!
      </Button>
    </Box>
    <Image
      src='src/assets/images/jbl-speaker.png'
      position='absolute'
      right={0}
      top='50%'
      transform='translateY(-50%) scaleX(-1)'
      maxW='60%'
      objectFit='contain'
      sx={{
        filter: 'drop-shadow(0 0 20px rgba(0,255,102,0.2))' // Thêm hiệu ứng glow xanh
      }}
    />
  </Box>
)

export default MusicBanner
