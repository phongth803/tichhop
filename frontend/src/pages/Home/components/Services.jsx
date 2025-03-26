import { Grid, VStack, Box, Heading, Text } from '@chakra-ui/react'
import { HiOutlineTruck, HiOutlinePhone, HiOutlineShieldCheck } from 'react-icons/hi'

const Services = () => {
  return (
    <Grid templateColumns='repeat(3, 1fr)' gap={8} py={20} mt={100}>
      {[
        {
          icon: HiOutlineTruck,
          title: 'FREE AND FAST DELIVERY',
          description: 'Free delivery for all orders over $140'
        },
        {
          icon: HiOutlinePhone,
          title: '24/7 CUSTOMER SERVICE',
          description: 'Friendly 24/7 customer support'
        },
        {
          icon: HiOutlineShieldCheck,
          title: 'MONEY BACK GUARANTEE',
          description: 'We reurn money within 30 days'
        }
      ].map((service) => (
        <VStack key={service.title} spacing={4} align='center'>
          <Box p={4} borderRadius='full' bg='black' position='relative'>
            <Box
              position='absolute'
              top={-1}
              left={-1}
              right={-1}
              bottom={-1}
              borderRadius='full'
              border='2px solid'
              borderColor='gray.200'
            />
            <service.icon size={24} color='white' />
          </Box>
          <Heading size='md'>{service.title}</Heading>
          <Text color='black' textAlign='center'>
            {service.description}
          </Text>
        </VStack>
      ))}
    </Grid>
  )
}

export default Services
