import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Box,
  Button,
  Select,
  Text,
  Collapse,
  useColorModeValue,
  Icon
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

const DataTable = ({ headers, dataInTable, itemsPerPage = 10, currentPage = 1, totalPages = 1, onPageChange }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const getPageNumbers = () => {
    const pageNumbers = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)

      if (currentPage > 2 && currentPage < totalPages - 1) {
        pageNumbers.push('...')
        pageNumbers.push(currentPage)
        pageNumbers.push('...')
      } else {
        if (currentPage > 2) {
          pageNumbers.push('...')
        }

        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)

        for (let i = start; i <= end; i++) {
          pageNumbers.push(i)
        }

        if (currentPage < totalPages - 1) {
          pageNumbers.push('...')
        }
      }

      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <Box borderWidth='1px' borderColor={borderColor} borderRadius='lg' overflow='hidden'>
      <Box overflowX='auto'>
        <Table variant='simple'>
          <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
            <Tr>
              {headers.map((header, index) => (
                <Th key={index} py={4}>
                  {header.label}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {dataInTable.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <Tr _hover={{ bg: hoverBg }} transition='background-color 0.2s'>
                  {headers.map((header, cellIndex) => (
                    <Td key={cellIndex} py={3}>
                      {row[header.key]}
                    </Td>
                  ))}
                </Tr>
                {row.expandedContent && (
                  <Tr>
                    <Td colSpan={headers.length} p={0}>
                      <Collapse in={true}>{row.expandedContent}</Collapse>
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box px={6} py={4} borderTopWidth='1px' borderColor={borderColor} bg={useColorModeValue('white', 'gray.800')}>
        <HStack spacing={2} justify='flex-end' flexWrap='wrap'>
          <HStack spacing={2} mb={{ base: 2, md: 0 }}>
            <Text fontSize={{ base: 'sm', md: 'md' }}>Items per page:</Text>
            <Select
              width='70px'
              size={{ base: 'sm', md: 'md' }}
              value={itemsPerPage}
              onChange={(e) => onPageChange(1, parseInt(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
          </HStack>
          <Text fontSize={{ base: 'sm', md: 'md' }} display={{ base: 'none', md: 'block' }}>
            Page {currentPage} of {totalPages}
          </Text>
          <HStack spacing={1}>
            <Button
              size={{ base: 'sm', md: 'md' }}
              variant='outline'
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1, itemsPerPage)}
              isDisabled={currentPage === 1}
              px={2}
            >
              <Icon as={ChevronLeftIcon} boxSize={5} />
            </Button>
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                size={{ base: 'sm', md: 'md' }}
                variant={page === currentPage ? 'solid' : 'outline'}
                onClick={() => typeof page === 'number' && onPageChange(page, itemsPerPage)}
                isDisabled={page === '...'}
                minW={{ base: '30px', md: '40px' }}
                px={{ base: 1, md: 2 }}
              >
                {page}
              </Button>
            ))}
            <Button
              size={{ base: 'sm', md: 'md' }}
              variant='outline'
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1, itemsPerPage)}
              isDisabled={currentPage === totalPages}
              px={2}
            >
              <Icon as={ChevronRightIcon} boxSize={5} />
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Box>
  )
}

export default DataTable
