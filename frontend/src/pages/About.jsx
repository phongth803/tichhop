import { Box, Container, Heading, Text, Flex, Image, SimpleGrid, Icon } from '@chakra-ui/react'
import { FaStore, FaDollarSign, FaUsers, FaMoneyBillAlt } from 'react-icons/fa'
import { TeamMember, StatCard } from '../components/About'
import aboutImage from '../assets/images/imageAbout.png'
import leAnhDuy from '../assets/images/image-merber-lad.png'
import tranHoaiPhong from '../assets/images/image-merber-thp.png'
import luongVinhTuong from '../assets/images/image-merber-lvt.png'

const About = () => {
  return (
    <Container maxW='container.xl' py={10}>
      <Flex direction={{ base: 'column', md: 'row' }} align='center' justify='space-between' gap={8} mb={16}>
        <Box flex={1}>
          <Heading as='h1' size='2xl' mb={6} fontWeight='bold'>
            Our Story
          </Heading>

          <Text fontSize='lg' mb={4}>
            Launched in 2025, PDT Commerce has quickly become Vietnam’s leading online shopping platform, with a strong
            presence in Bangladesh. Powered by tailored marketing solutions, data-driven insights, and dedicated
            services, PDT Commerce connects over 10,500 sellers and 300 brands, serving 3 million customers across the
            region.
          </Text>

          <Text fontSize='lg'>
            With a rapidly expanding inventory of over 1 million products, PDT Commerce offers a diverse range of
            categories to meet consumer needs. As we continue to grow, we remain committed to delivering a seamless,
            versatile, and reliable shopping experience.
          </Text>
        </Box>

        <Box flex={1}>
          <Image src={aboutImage} alt='Happy shoppers' borderRadius='lg' w='full' h='auto' />
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
        <StatCard icon={FaStore} number='10.5K' text='Sellers active our site' />
        <StatCard icon={FaDollarSign} number='33K' text='Monthly Product Sale' bgColor='red.500' />
        <StatCard icon={FaUsers} number='45.5K' text='Customer active in our site' />
        <StatCard icon={FaMoneyBillAlt} number='25K' text='Annual gross sale in our site' />
      </SimpleGrid>
      <Box textAlign='center' mb={10}>
        <Heading size='2xl' mb={4}>
          Meet Our Team
        </Heading>
        <Text fontSize='lg' color='gray.600' maxW='container.md' mx='auto'>
          Get to know the faces behind our success
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <TeamMember name='Trần Hoài Phong' role='Leader' image={tranHoaiPhong} />
        <TeamMember name='Lê Anh Duy' role='User' image={leAnhDuy} />
        <TeamMember name='Lương Vĩnh Tường' role='User' image={luongVinhTuong} />
      </SimpleGrid>
    </Container>
  )
}

export default About
