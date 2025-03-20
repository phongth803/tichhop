import { VStack, Image, Heading, Text, HStack, Link, Icon } from '@chakra-ui/react'
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

const TeamMember = ({ name, role, image }) => (
  <VStack spacing={4} align='center'>
    <Image src={image} alt={name} borderRadius='lg' w='full' h='350px' objectFit='cover' />
    <Heading size='md'>{name}</Heading>
    <Text color='gray.600'>{role}</Text>
    <HStack spacing={4}>
      <Link href='#'>
        <Icon as={FaTwitter} />
      </Link>
      <Link href='#'>
        <Icon as={FaInstagram} />
      </Link>
      <Link href='#'>
        <Icon as={FaLinkedin} />
      </Link>
    </HStack>
  </VStack>
)

export default TeamMember
