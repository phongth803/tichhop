import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  VStack,
  Grid
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

const UserActionModal = ({ isOpen, onClose, onSubmit, isEdit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm()

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  const onSubmitHandler = async (data) => {
    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'adding'} user:`, error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW='800px'>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <ModalHeader>{isEdit ? 'Edit User' : 'Add New User'}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <Grid templateColumns='repeat(2, 1fr)' gap={5} w='100%'>
                <FormControl isInvalid={errors.firstName}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters'
                      }
                    })}
                  />
                  <FormErrorMessage>{errors.firstName && errors.firstName.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.lastName}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters'
                      }
                    })}
                  />
                  <FormErrorMessage>{errors.lastName && errors.lastName.message}</FormErrorMessage>
                </FormControl>

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
                  />
                  <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type='password'
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.address}>
                  <FormLabel>Address</FormLabel>
                  <Input
                    {...register('address', {
                      required: 'Address is required'
                    })}
                  />
                  <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.role}>
                  <FormLabel>Role</FormLabel>
                  <Select
                    {...register('role', {
                      required: 'Role is required'
                    })}
                  >
                    <option value=''>Select role</option>
                    <option value='admin'>Admin</option>
                    <option value='user'>User</option>
                  </Select>
                  <FormErrorMessage>{errors.role && errors.role.message}</FormErrorMessage>
                </FormControl>
              </Grid>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='purple' type='submit' isLoading={isSubmitting} isDisabled={!isDirty}>
              {isEdit ? 'Update User' : 'Add User'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default UserActionModal
