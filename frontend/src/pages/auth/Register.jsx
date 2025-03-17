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
  Box
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useStore } from '../../stores/rootStore'
import { toast } from 'react-toastify'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { authStore } = useStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const { email, password, fullName } = data
      const payload = { email, password, fullName }
      const isRegister = await authStore.register(payload)
      if (isRegister) {
        toast.success('Register successful')
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <Box px={6}>
      <Stack spacing={8}>
        <Stack spacing={3}>
          <Heading fontSize='3xl' fontWeight='bold'>
            Sign Up
          </Heading>
          <Text color='gray.600'>
            Already have an account?{' '}
            <Text as={RouterLink} to='/login' color='blue.500' _hover={{ textDecoration: 'underline' }}>
              Sign In
            </Text>
          </Text>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6}>
            <FormControl isInvalid={errors.fullName}>
              <FormLabel>Full Name</FormLabel>
              <Input
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters'
                  }
                })}
              />
              <FormErrorMessage>{errors.fullName && errors.fullName.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
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
              <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => {
                    if (watch('password') !== val) {
                      return 'Passwords do not match'
                    }
                  }
                })}
              />
              <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
            </FormControl>

            <Button type='submit' colorScheme='blue' size='lg' fontSize='md' isLoading={isSubmitting}>
              Create Account
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  )
}

export default Register
