import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useStore } from '../../stores/rootStore'
import { useForm } from 'react-hook-form'

const Login = observer(() => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const { authStore } = useStore()
  const navigate = useNavigate()
  const toast = useToast()

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      await authStore.login(data)
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000
      })

      if (authStore.isAdmin) {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 3000
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box maxW='md' mx='auto' mt='8'>
      <Stack spacing='8'>
        <Stack align='center'>
          <Heading fontSize='2xl'>Sign in to your account</Heading>
          <Text fontSize='md' color='gray.600'>
            Don't have an account?{' '}
            <Text as={RouterLink} to='/register' color='blue.400'>
              Register
            </Text>
          </Text>
        </Stack>

        <Box as='form' onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing='4'>
            <FormControl isRequired isInvalid={errors.email}>
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
              />
              {errors.email && (
                <Text color='red.500' fontSize='sm'>
                  {errors.email.message}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={errors.password}>
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
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant='ghost'
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <Text color='red.500' fontSize='sm'>
                  {errors.password.message}
                </Text>
              )}
            </FormControl>

            <Button type='submit' colorScheme='blue' size='lg' fontSize='md' isLoading={isLoading}>
              Sign in
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
})

export default Login
