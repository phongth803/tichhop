import {
  Box,
  Container,
  Grid,
  GridItem,
  Stack,
  Text,
  Input,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel
} from '@chakra-ui/react'
import { useStore } from '@/stores/rootStore'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { debounce } from 'lodash'

const SidebarItem = ({ label, isActive, onClick }) => (
  <Text cursor='pointer' color={isActive ? 'red.500' : 'gray.500'} onClick={onClick} mb={2}>
    {label}
  </Text>
)

const EditProfile = () => {
  const { authStore } = useStore()
  const { user } = authStore
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const [passwordError, setPasswordError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setError,
    reset,
    setValue
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      address: user?.address || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  useEffect(() => {
    let isSubscribed = true

    if (user && isSubscribed) {
      setValue('firstName', user.firstName || '')
      setValue('lastName', user.lastName || '')
      setValue('email', user.email || '')
      setValue('address', user.address || '')
    }

    return () => {
      isSubscribed = false
    }
  }, [user, setValue])

  const handleCancel = () => {
    const hasChanges = isDirty || watch('currentPassword') || watch('newPassword') || watch('confirmPassword')
    if (hasChanges) {
      onOpen()
    } else {
      navigate('/')
    }
  }

  const validatePassword = (data) => {
    const isChangingPassword = data.currentPassword || data.newPassword || data.confirmPassword

    if (!isChangingPassword) return true

    if (data.currentPassword?.trim() !== data.currentPassword) {
      setError('currentPassword', { type: 'manual', message: 'Password cannot contain leading/trailing spaces' })
      return false
    }

    if (!data.currentPassword?.trim()) {
      setError('currentPassword', { type: 'manual', message: 'Current password is required' })
      return false
    }
    if (!data.newPassword?.trim()) {
      setError('newPassword', { type: 'manual', message: 'New password is required' })
      return false
    }
    if (data.newPassword.length < 6) {
      setError('newPassword', { type: 'manual', message: 'New password must be at least 6 characters' })
      return false
    }
    if (data.currentPassword === data.newPassword) {
      setError('newPassword', { type: 'manual', message: 'New password must be different' })
      return false
    }
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' })
      return false
    }
    return true
  }

  const resetForm = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      address: user?.address || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordError('')
  }

  const handleError = (error) => {
    console.error('Submit error:', error)
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred while updating profile'
    toast.error(errorMessage)
  }

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setPasswordError('')
      if (!validatePassword(data)) return

      const isChangingPassword = data.currentPassword || data.newPassword || data.confirmPassword

      const updateData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        address: data.address?.trim(),
        ...(isChangingPassword && {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      }

      const response = await authStore.updateProfile(updateData)

      if (response.success) {
        toast.success(response.message)

        if (response.isPasswordChanged) {
          resetForm()
        }
      } else {
        if (response.message === 'Current password is incorrect') {
          setError('currentPassword', {
            type: 'manual',
            message: 'Current password is incorrect'
          })
        } else {
          toast.error(response.message)
        }
      }
    } catch (error) {
      handleError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const debouncedValidation = debounce((value) => {
    if (value && value.length < 2) {
      setError('firstName', {
        type: 'manual',
        message: 'First name must be at least 2 characters'
      })
    }
  }, 300)

  return (
    <>
      <Container maxW='container.xl' py={8}>
        {/* Welcome Message */}
        <Box display='flex' justifyContent='flex-end' mb={8}>
          <Text>
            Welcome!{' '}
            <Text as='span' color='red.500'>
              {user?.firstName} {user?.lastName}
            </Text>
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={8}>
          {/* Sidebar */}
          <GridItem>
            <Stack spacing={6}>
              <Box>
                <Text fontSize='lg' fontWeight='medium' mb={3}>
                  Manage My Account
                </Text>
                <Stack spacing={2}>
                  <SidebarItem label='My Profile' isActive={true} />
                  <SidebarItem label='Address Book' onClick={() => navigate('/address-book')} />
                  <SidebarItem label='My Payment Options' onClick={() => navigate('/payment-options')} />
                </Stack>
              </Box>

              <Box>
                <Text fontSize='lg' fontWeight='medium' mb={3} onClick={() => navigate('/my-orders')}>
                  My Orders
                </Text>
                <Stack spacing={2}>
                  <SidebarItem label='My Returns' onClick={() => navigate('/returns')} />
                  <SidebarItem label='My Cancellations' onClick={() => navigate('/cancellations')} />
                </Stack>
              </Box>

              <Box>
                <Text fontSize='lg' fontWeight='medium'>
                  My Wishlist
                </Text>
              </Box>
            </Stack>
          </GridItem>

          {/* Main Content */}
          <GridItem>
            <Box bg='white' p={6} borderRadius='md' boxShadow='sm'>
              <Text fontSize='2xl' color='red.500' mb={6}>
                Edit Your Profile
              </Text>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid templateColumns='repeat(2, 1fr)' gap={6} mb={6}>
                  <FormControl isInvalid={errors.firstName}>
                    <FormLabel htmlFor='firstName' color='gray.700'>
                      First Name
                    </FormLabel>
                    <Input
                      id='firstName'
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: { value: 2, message: 'First name must be at least 2 characters' }
                      })}
                      placeholder='Enter your first name'
                      bg='gray.100'
                      border='none'
                    />
                    <FormErrorMessage>{errors.firstName && errors.firstName.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.lastName}>
                    <FormLabel htmlFor='lastName' color='gray.700'>
                      Last Name
                    </FormLabel>
                    <Input
                      id='lastName'
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                      })}
                      placeholder='Enter your last name'
                      bg='gray.100'
                      border='none'
                    />
                    <FormErrorMessage>{errors.lastName && errors.lastName.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.email}>
                    <FormLabel htmlFor='email' color='gray.700'>
                      Email Address
                    </FormLabel>
                    <Input
                      id='email'
                      {...register('email')}
                      placeholder='Your email address'
                      bg='gray.100'
                      border='none'
                      isReadOnly
                      title='Email cannot be changed'
                    />
                    <FormHelperText color='gray.500'>Email cannot be changed</FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={errors.address}>
                    <FormLabel htmlFor='address' color='gray.700'>
                      Address
                    </FormLabel>
                    <Input
                      id='address'
                      {...register('address')}
                      placeholder='Enter your address'
                      bg='gray.100'
                      border='none'
                    />
                    <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
                  </FormControl>
                </Grid>

                <Box mb={6}>
                  <Text fontSize='md' fontWeight='medium' mb={4}>
                    Password Changes
                  </Text>
                  <Stack spacing={4}>
                    <FormControl isInvalid={errors.currentPassword || passwordError}>
                      <Input
                        id='currentPassword'
                        type='password'
                        {...register('currentPassword', {
                          validate: (value) => {
                            if (watch('newPassword') || watch('confirmPassword')) {
                              return value ? true : 'Current password is required when changing password'
                            }
                            return true
                          }
                        })}
                        placeholder='Current Password'
                        bg='gray.100'
                        border='none'
                        onChange={() => {
                          if (passwordError) setPasswordError('')
                        }}
                      />
                      <FormErrorMessage>{errors.currentPassword?.message || passwordError}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.newPassword}>
                      <Input
                        id='newPassword'
                        type='password'
                        {...register('newPassword', {
                          validate: (value) => {
                            if (watch('currentPassword')) {
                              if (!value) return 'New password is required'
                              if (value.length < 6) return 'Password must be at least 6 characters'
                            }
                            return true
                          }
                        })}
                        placeholder='New Password'
                        bg='gray.100'
                        border='none'
                      />
                      <FormErrorMessage>{errors.newPassword && errors.newPassword.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.confirmPassword}>
                      <Input
                        id='confirmPassword'
                        type='password'
                        {...register('confirmPassword', {
                          validate: (value) => {
                            if (watch('newPassword')) {
                              if (!value) return 'Please confirm your new password'
                              if (value !== watch('newPassword')) return 'Passwords do not match'
                            }
                            return true
                          }
                        })}
                        placeholder='Confirm New Password'
                        bg='gray.100'
                        border='none'
                      />
                      <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Box>
                <Box display='flex' justifyContent='flex-end' gap={4}>
                  <Button variant='ghost' onClick={handleCancel} isDisabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    bg='red.500'
                    color='white'
                    _hover={{ bg: 'red.600' }}
                    px={6}
                    isLoading={isSubmitting}
                    loadingText='Saving...'
                  >
                    Save Changes
                  </Button>
                </Box>
              </form>
            </Box>
          </GridItem>
        </Grid>
      </Container>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to cancel? All changes will be lost.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme='red' onClick={() => navigate('/')} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default EditProfile
