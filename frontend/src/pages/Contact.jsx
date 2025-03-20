import {
  Box,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  Textarea,
  Button,
  VStack,
  HStack,
  Icon
} from '@chakra-ui/react'
import { PhoneIcon, EmailIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { useStore } from '../stores/rootStore'
import { toast } from 'react-toastify'

export default function ContactForm() {
  const { contactStore } = useStore()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const success = await contactStore.sendMessage(data)
      if (success) {
        toast.success('Message sent successfully!')
        reset()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending message')
    }
  }

  return (
    <Container maxW='container.xl' py={10}>
      <Flex gap={10} direction={{ base: 'column', md: 'row' }}>
        <Box flex={1}>
          <VStack align='flex-start' mb={8} spacing={4}>
            <HStack>
              <Icon as={PhoneIcon} color='red.500' w={6} h={6} />
              <Text fontSize='xl' fontWeight='bold'>
                Call To Us
              </Text>
            </HStack>
            <Text>We are available 24/7, 7 days a week.</Text>
            <Text>Phone: +880161111222</Text>
          </VStack>

          <VStack align='flex-start' spacing={4}>
            <HStack>
              <Icon as={EmailIcon} color='red.500' w={6} h={6} />
              <Text fontSize='xl' fontWeight='bold'>
                Write To US
              </Text>
            </HStack>
            <Text>Fill out our form and we will contact you within 24 hours.</Text>
            <Text>Emails: customer@exclusive.com</Text>
            <Text>Emails: support@exclusive.com</Text>
          </VStack>
        </Box>

        <Box flex={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6}>
              <HStack w='full' spacing={4}>
                <FormControl isInvalid={errors.name}>
                  <Input
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Minimum length should be 2' }
                    })}
                    placeholder='Your Name *'
                    bg='gray.50'
                    size='lg'
                  />
                  <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.email}>
                  <Input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    placeholder='Your Email *'
                    bg='gray.50'
                    size='lg'
                  />
                  <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.phone}>
                  <Input
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Invalid phone number'
                      }
                    })}
                    placeholder='Your Phone *'
                    bg='gray.50'
                    size='lg'
                    type='tel'
                  />
                  <FormErrorMessage>{errors.phone && errors.phone.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={errors.message}>
                <Textarea
                  {...register('message', {
                    required: 'Message is required',
                    minLength: { value: 10, message: 'Message is too short' }
                  })}
                  placeholder='Your Message'
                  bg='gray.50'
                  size='lg'
                  rows={6}
                />
                <FormErrorMessage>{errors.message && errors.message.message}</FormErrorMessage>
              </FormControl>

              <Button type='submit' alignSelf='flex-end' colorScheme='red' size='lg' px={8} isLoading={isSubmitting}>
                Send Message
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Container>
  )
}
