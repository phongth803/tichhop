import { Box, Grid, GridItem, Image } from '@chakra-ui/react'
import SectionHeader from './SectionHeader'
import CardOverlay from './CardOverlay'

const NewArrival = () => {
  return (
    <Box py={8}>
      <SectionHeader label='Featured' title='New Arrival' />
      <Grid templateColumns='repeat(4, 1fr)' templateRows='repeat(2, 1fr)' gap={6} h='600px'>
        {/* PlayStation 5 Card - Chiếm 2 cột, 2 hàng */}
        <GridItem colSpan={2} rowSpan={2} position='relative'>
          <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
            <Image src='src/assets/images/ps5.jpg' alt='PS5' objectFit='cover' w='100%' h='100%' />
            <CardOverlay title='PlayStation 5' description='Black and White version of the PS5 coming out on sale.' />
          </Box>
        </GridItem>

        {/* Women's Collections Card */}
        <GridItem colSpan={2} position='relative'>
          <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
            <Image
              src='src/assets/images/women.jpg'
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
            <Image src='src/assets/images/speakers.jpg' alt='Speakers' objectFit='cover' w='100%' h='100%' />
            <CardOverlay title='Speakers' description='Amazon wireless speakers' />
          </Box>
        </GridItem>

        {/* Perfume Card */}
        <GridItem position='relative'>
          <Box bg='black' borderRadius='lg' overflow='hidden' h='100%' position='relative'>
            <Image src='src/assets/images/perfume.jpg' alt='Perfume' objectFit='cover' w='100%' h='100%' />
            <CardOverlay title='Perfume' description='GUCCI INTENSE OUD EDP' />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default NewArrival
