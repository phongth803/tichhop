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
  Grid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  HStack,
  Image,
  Box,
  Checkbox,
  IconButton,
  Text,
  Flex,
  useColorModeValue
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { uploadProductImages, deleteProductImage } from '@/apis/products'
import { DeleteIcon, AddIcon } from '@chakra-ui/icons'

const ProductActionModal = ({ isOpen, onClose, onSubmit, isEdit, initialData, categories }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
    watch
  } = useForm()

  const [selectedFiles, setSelectedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [deletingImages, setDeletingImages] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const images = watch('images') || []
  const fileInputRef = useRef(null)
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const handleOnClose = () => {
    reset()
    setSelectedFiles([])
    setSelectedImages([])
    setDeletingImages([])
    onClose()
  }

  useEffect(() => {
    if (initialData) {
      const data = {
        ...initialData,
        status: initialData.isActive ? 'active' : 'inactive',
        category: initialData.category?._id || initialData.category || '',
        images: initialData.images || []
      }
      reset(data)
    }
  }, [initialData, reset])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const currentImages = images.length
    const totalImages = currentImages + files.length

    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed per product')
      setSelectedFiles([])
    } else {
      setSelectedFiles(files)
    }
  }

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      selectedFiles.forEach((file) => {
        formData.append('images', file)
      })

      const response = await uploadProductImages(initialData._id, formData)
      const newImages = response.data.images.filter((img) => !images.includes(img))
      setValue('images', [...images, ...newImages], { shouldDirty: true })
      setSelectedFiles([])
    } catch (error) {
      if (error.response?.data?.message === 'Maximum 5 images allowed per product') {
        toast.error('Maximum 5 images allowed per product')
      } else {
        toast.error('Upload images failed')
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleSelectImage = (imageUrl) => {
    setSelectedImages((prev) =>
      prev.includes(imageUrl) ? prev.filter((img) => img !== imageUrl) : [...prev, imageUrl]
    )
  }

  const handleDeleteSelected = async () => {
    try {
      setDeletingImages(selectedImages)

      const deletedImages = []
      for (const imageUrl of selectedImages) {
        try {
          await deleteProductImage(initialData._id, imageUrl)
          deletedImages.push(imageUrl)
        } catch (error) {
          console.error(`Failed to delete image ${imageUrl}:`, error)
        }
      }

      if (deletedImages.length > 0) {
        const currentImages = watch('images') || []
        const remainingImages = currentImages.filter((img) => !deletedImages.includes(img))
        setValue('images', remainingImages, { shouldDirty: true })
      }

      if (deletedImages.length === selectedImages.length) {
        setSelectedImages([])
        toast.success('Selected images deleted successfully')
      } else {
        toast.warning('Some images could not be deleted')
      }
    } catch (error) {
      console.error('Delete selected images error:', error)
      toast.error('Failed to delete some images')
    } finally {
      setDeletingImages([])
    }
  }

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([])
    } else {
      setSelectedImages([...images])
    }
  }

  const onSubmitHandler = async (data) => {
    try {
      const submitData = {
        ...data,
        isActive: data.status === 'active'
      }

      // Handle image upload for both new and edit modes
      if (selectedFiles.length > 0) {
        if (isEdit) {
          // For edit mode, upload images first
          await handleUploadImages()
        } else {
          // For add mode, include files in the form data
          const formData = new FormData()
          selectedFiles.forEach((file) => {
            formData.append('images', file)
          })
          submitData.files = formData
        }
      }

      await onSubmit(submitData)
      handleOnClose()
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'adding'} product:`, error)
    }
  }

  const handleFileButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} size={{ base: 'full', md: '4xl' }}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <ModalHeader>{isEdit ? 'Edit Product' : 'Add New Product'}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={5} w='100%'>
                <FormControl isInvalid={errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                  <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.category}>
                  <FormLabel>Category</FormLabel>
                  <Select
                    {...register('category', {
                      required: 'Category is required'
                    })}
                  >
                    <option value=''>Select category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.category && errors.category.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.price}>
                  <FormLabel>Price</FormLabel>
                  <NumberInput min={0} precision={2}>
                    <NumberInputField
                      {...register('price', {
                        required: 'Price is required',
                        min: {
                          value: 0,
                          message: 'Price must be greater than 0'
                        }
                      })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.price && errors.price.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.stock}>
                  <FormLabel>Stock</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register('stock', {
                        required: 'Stock is required',
                        min: {
                          value: 0,
                          message: 'Stock must be greater than or equal to 0'
                        }
                      })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.stock && errors.stock.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.discount}>
                  <FormLabel>Discount (%)</FormLabel>
                  <NumberInput min={0} max={100}>
                    <NumberInputField
                      {...register('discount', {
                        min: {
                          value: 0,
                          message: 'Discount must be between 0 and 100'
                        },
                        max: {
                          value: 100,
                          message: 'Discount must be between 0 and 100'
                        }
                      })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.discount && errors.discount.message}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select {...register('status')} defaultValue='active'>
                    <option value='active'>Active</option>
                    <option value='inactive'>Inactive</option>
                  </Select>
                </FormControl>

                <FormControl isInvalid={errors.description} gridColumn={{ base: 'span 1', md: 'span 2' }}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...register('description', {
                      required: 'Description is required'
                    })}
                  />
                  <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                </FormControl>

                <FormControl gridColumn={{ base: 'span 1', md: 'span 2' }}>
                  <FormLabel>Product Images</FormLabel>
                  {isEdit && Array.isArray(images) && images.length > 0 && (
                    <>
                      <HStack justify='space-between' mb={2}>
                        <Button size='sm' variant='outline' onClick={handleSelectAll}>
                          {selectedImages.length === images.length ? 'Deselect All' : 'Select All'}
                        </Button>
                        {selectedImages.length > 0 && (
                          <Button
                            colorScheme='red'
                            size='sm'
                            onClick={handleDeleteSelected}
                            isLoading={deletingImages.length > 0}
                          >
                            Delete Selected ({selectedImages.length})
                          </Button>
                        )}
                      </HStack>
                      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }} gap={4} mb={4}>
                        {images.map((image, index) => (
                          <Box
                            key={index}
                            position='relative'
                            cursor='pointer'
                            onClick={() => handleSelectImage(image)}
                            opacity={deletingImages.includes(image) ? 0.5 : 1}
                            border={selectedImages.includes(image) ? '2px solid' : 'none'}
                            borderColor='blue.500'
                            borderRadius='md'
                            p={1}
                          >
                            <Image src={image} alt={`Product image ${index + 1}`} objectFit='cover' borderRadius='md' />
                            <Checkbox
                              position='absolute'
                              top={2}
                              left={2}
                              isChecked={selectedImages.includes(image)}
                              onChange={(e) => {
                                e.stopPropagation()
                                handleSelectImage(image)
                              }}
                            />
                          </Box>
                        ))}
                      </Grid>
                    </>
                  )}
                  {selectedFiles.length > 0 && (
                    <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }} gap={4} mb={4}>
                      {selectedFiles.map((file, index) => (
                        <Box
                          key={index}
                          position='relative'
                          border='1px solid'
                          borderColor='gray.200'
                          borderRadius='md'
                          p={1}
                        >
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            objectFit='cover'
                            borderRadius='md'
                          />
                          <IconButton
                            position='absolute'
                            top={2}
                            right={2}
                            size='sm'
                            colorScheme='red'
                            icon={<DeleteIcon />}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
                            }}
                          />
                        </Box>
                      ))}
                    </Grid>
                  )}

                  {/* Improved file selection UI */}
                  <Box
                    border='1px dashed'
                    borderColor={borderColor}
                    borderRadius='md'
                    p={4}
                    textAlign='center'
                    cursor={images.length >= 5 ? 'not-allowed' : 'pointer'}
                    onClick={images.length >= 5 ? undefined : handleFileButtonClick}
                    _hover={{ bg: images.length >= 5 ? undefined : hoverBg }}
                    opacity={images.length >= 5 ? 0.6 : 1}
                  >
                    <input
                      type='file'
                      multiple
                      accept='image/*'
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      disabled={images.length >= 5}
                    />
                    <Flex direction='column' align='center' justify='center'>
                      <AddIcon boxSize={8} mb={2} />
                      <Text fontWeight='medium'>
                        {images.length >= 5 ? 'Maximum 5 images reached' : 'Click to add images'}
                      </Text>
                      <Text fontSize='sm' color='gray.500'>
                        {images.length >= 5
                          ? "You can't add more images"
                          : `You can add up to ${5 - images.length} more images`}
                      </Text>
                    </Flex>
                  </Box>
                </FormControl>
              </Grid>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={handleOnClose}>
              Cancel
            </Button>
            <Button
              colorScheme='purple'
              type='submit'
              isLoading={isSubmitting || isUploading}
              isDisabled={!isDirty && selectedFiles.length === 0}
            >
              {isEdit ? 'Update Product' : 'Add Product'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ProductActionModal
