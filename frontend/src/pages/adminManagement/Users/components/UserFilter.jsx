import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  VStack,
  Button,
  Flex
} from '@chakra-ui/react'

const UserFilter = ({ isOpen, onClose, onFilter, currentFilters }) => {
  const handleFilterChange = (type, value) => {
    const newFilters = { ...currentFilters, [type]: value }
    onFilter(newFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters = {
      role: '',
      status: ''
    }
    onFilter(resetFilters)
    onClose()
  }

  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='sm'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>Filter Users</DrawerHeader>

        <DrawerBody>
          <Stack spacing={6} py={4}>
            {/* Role Filter */}
            <FormControl>
              <FormLabel fontWeight='bold'>Role</FormLabel>
              <RadioGroup onChange={(value) => handleFilterChange('role', value)} value={currentFilters.role}>
                <VStack align='start' spacing={2}>
                  <Radio value=''>All</Radio>
                  <Radio value='user'>User</Radio>
                  <Radio value='admin'>Admin</Radio>
                </VStack>
              </RadioGroup>
            </FormControl>

            {/* Status Filter */}
            <FormControl>
              <FormLabel fontWeight='bold'>Status</FormLabel>
              <RadioGroup onChange={(value) => handleFilterChange('status', value)} value={currentFilters.status}>
                <VStack align='start' spacing={2}>
                  <Radio value=''>All</Radio>
                  <Radio value='true'>Active</Radio>
                  <Radio value='false'>Inactive</Radio>
                </VStack>
              </RadioGroup>
            </FormControl>

            <Flex justify='flex-end' mt={4}>
              <Button colorScheme='red' onClick={handleReset}>
                Reset Filters
              </Button>
            </Flex>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default UserFilter
