import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  Box,
  Container,
  VStack,
  useBreakpointValue,
  SimpleGrid
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useStore } from '../../stores/rootStore'
import { toast } from 'react-toastify'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { authStore } = useStore()
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const { email, password, firstName, lastName } = data
      const payload = { email, password, firstName, lastName }
      const isRegister = await authStore.register(payload)
      if (isRegister) {
        toast.success('Registration successful!')
        navigate('/')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message || 'Registration failed')
    }
  }

  return (
    <Container maxW='container.sm' py={{ base: 6, md: 10 }}>
      <VStack spacing={8} align='stretch'>
        <Box textAlign='center'>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold' mb={3}>
            Create New Account
          </Heading>
          <Text color='gray.600'>
            Already have an account?{' '}
            <Text
              as={RouterLink}
              to='/login'
              color='red.500'
              _hover={{ textDecoration: 'underline' }}
              display='inline-block'
            >
              Sign In
            </Text>
          </Text>
        </Box>

        <Box
          as='form'
          onSubmit={handleSubmit(onSubmit)}
          bg='white'
          p={{ base: 6, md: 8 }}
          borderRadius='lg'
          boxShadow='sm'
        >
          <VStack spacing={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w='full'>
              <FormControl isInvalid={errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 2, message: 'First name must be at least 2 characters' }
                  })}
                  size='lg'
                  bg='gray.50'
                />
                <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                  })}
                  size='lg'
                  bg='gray.50'
                />
                <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type='email'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                size='lg'
                bg='gray.50'
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup size='lg'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  bg='gray.50'
                />
                <InputRightElement>
                  <IconButton
                    variant='ghost'
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup size='lg'>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => {
                      if (watch('password') !== val) {
                        return 'Passwords do not match'
                      }
                    }
                  })}
                  bg='gray.50'
                />
                <InputRightElement>
                  <IconButton
                    variant='ghost'
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
            </FormControl>

            <Button type='submit' colorScheme='red' size='lg' fontSize='md' isLoading={isSubmitting} w='full' mt={4}>
              Create Account
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default Register
