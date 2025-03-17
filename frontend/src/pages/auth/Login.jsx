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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { authStore } = useStore()
  const navigate = useNavigate()
  const { isLoading } = authStore

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const { email, password } = data
      const payload = { email, password }
      const isLogin = await authStore.login(payload)
      if (isLogin) {
        toast.success('Login successful')
        navigate('/')
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
            Sign In
          </Heading>
          <Text color='gray.600'>
            Don't have an account?{' '}
            <Text as={RouterLink} to='/register' color='blue.500' _hover={{ textDecoration: 'underline' }}>
              Sign Up
            </Text>
          </Text>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6}>
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

            <Button type='submit' colorScheme='blue' size='lg' fontSize='md' isLoading={isLoading}>
              Sign In
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  )
}

export default Login
