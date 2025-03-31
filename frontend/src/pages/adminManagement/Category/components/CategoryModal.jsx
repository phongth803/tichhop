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

const CategoryModal = ({ isOpen, onClose, onSubmit, isEdit, initialData }) => {
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
      console.error(`Error ${isEdit ? 'updating' : 'adding'} category:`, error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW='800px'>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <ModalHeader>{isEdit ? 'Edit Category' : 'Add New Category'}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <Grid templateColumns='repeat(2, 1fr)' gap={5} w='100%'>
                <FormControl isInvalid={errors.name}>
                  <FormLabel>Category Name</FormLabel>
                  <Input
                    {...register('name', {
                      required: 'Category name is required',
                      minLength: {
                        value: 2,
                        message: 'Category name must be at least 2 characters'
                      }
                    })}
                  />
                  <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    {...register('description', {
                      required: 'Description is required'
                    })}
                  />
                  <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.status}>
                  <FormLabel>Status</FormLabel>
                  <Select
                    {...register('isActive', {
                      required: 'Status is required'
                    })}
                  >
                    <option value=''>Select status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Select>
                  <FormErrorMessage>{errors.status && errors.status.message}</FormErrorMessage>
                </FormControl>
              </Grid>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='purple' type='submit' isLoading={isSubmitting} isDisabled={!isDirty}>
              {isEdit ? 'Update Category' : 'Add Category'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default CategoryModal
