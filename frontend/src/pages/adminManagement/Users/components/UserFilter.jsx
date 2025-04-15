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
  Flex,
  HStack
} from '@chakra-ui/react'

const UserFilter = ({ isOpen, onClose, onFilter, currentFilters }) => {
  const handleFilterChange = (type, value) => {
    const newFilters = { ...currentFilters, [type]: value }
    onFilter(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      role: '',
      status: ''
    }
    onFilter(resetFilters)
  }

  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose} size={{ base: 'full', md: 'sm' }}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>Filter Users</DrawerHeader>

        <DrawerBody>
          <Stack spacing={6} py={4}>
            {/* Role Filter */}
            <FormControl>
              <FormLabel fontWeight='bold' fontSize={{ base: 'md', md: 'sm' }}>
                Role
              </FormLabel>
              <RadioGroup onChange={(value) => handleFilterChange('role', value)} value={currentFilters.role}>
                <VStack align='start' spacing={{ base: 3, md: 2 }}>
                  <Radio value='' size={{ base: 'lg', md: 'md' }}>
                    All
                  </Radio>
                  <Radio value='user' size={{ base: 'lg', md: 'md' }}>
                    User
                  </Radio>
                  <Radio value='admin' size={{ base: 'lg', md: 'md' }}>
                    Admin
                  </Radio>
                </VStack>
              </RadioGroup>
            </FormControl>

            {/* Status Filter */}
            <FormControl>
              <FormLabel fontWeight='bold' fontSize={{ base: 'md', md: 'sm' }}>
                Status
              </FormLabel>
              <RadioGroup onChange={(value) => handleFilterChange('status', value)} value={currentFilters.status}>
                <VStack align='start' spacing={{ base: 3, md: 2 }}>
                  <Radio value='' size={{ base: 'lg', md: 'md' }}>
                    All
                  </Radio>
                  <Radio value='true' size={{ base: 'lg', md: 'md' }}>
                    Active
                  </Radio>
                  <Radio value='false' size={{ base: 'lg', md: 'md' }}>
                    Inactive
                  </Radio>
                </VStack>
              </RadioGroup>
            </FormControl>

            <Flex justify='space-between' mt={4} w='100%'>
              <Button colorScheme='gray' onClick={onClose} size={{ base: 'lg', md: 'md' }}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleReset} size={{ base: 'lg', md: 'md' }}>
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
