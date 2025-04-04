import { Box, Grid, GridItem, Image } from '@chakra-ui/react'
import SectionHeader from './SectionHeader'
import CardOverlay from './CardOverlay'
import ps5 from '@/assets/images/ps5.jpg'
import women from '@/assets/images/women.jpg'
import speakers from '@/assets/images/speakers.jpg'
import perfume from '@/assets/images/perfume.jpg'

const NewArrival = () => {
  return (
    <Box py={8}>
      <SectionHeader label='Featured' title='New Arrival' />
      <Grid 
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        templateRows={{ base: 'auto', md: 'repeat(2, 1fr)' }}
        gap={{ base: 4, md: 6 }}
        h={{ base: 'auto', md: '600px' }}
      >
        <GridItem 
          colSpan={{ base: 1, md: 2 }} 
          rowSpan={{ base: 1, md: 2 }}
          h={{ base: '300px', md: 'auto' }}
        >
          <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
              <Image src={ps5} alt='PS5' objectFit='cover' w='100%' h='100%' />
            <CardOverlay title='PlayStation 5' description='Black and White version of the PS5 coming out on sale.' />
          </Box>
        </GridItem>
        
        <GridItem 
          colSpan={{ base: 1, md: 2 }}
          h={{ base: '200px', md: 'auto' }}
        >
          <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
            <Image
              src={women}
              alt="Women's Collections"
              objectFit='cover'
              w='100%'
              h='100%'
              transform='scaleX(-1)'
            />
            <CardOverlay
              title="Women's Collections"
              description='Featured woman collections that give you another vibe.'
            />
          </Box>
        </GridItem>

        {/* Speakers Card */}
        <GridItem position='relative'>
          <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
            <Image src={speakers} alt='Speakers' objectFit='cover' w='100%' h='100%' />
            <CardOverlay title='Speakers' description='Amazon wireless speakers' />
          </Box>
        </GridItem>

        {/* Perfume Card */}
        <GridItem position='relative'>
          <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
            <Image src={perfume} alt='Perfume' objectFit='cover' w='100%' h='100%' />
            <CardOverlay title='Perfume' description='GUCCI INTENSE OUD EDP' />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default NewArrival
