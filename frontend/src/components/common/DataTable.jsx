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
  useColorModeValue
} from '@chakra-ui/react'

const DataTable = ({ headers, dataInTable, itemsPerPage = 10, currentPage = 1, totalPages = 1, onPageChange }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

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
        <HStack spacing={4} justify='flex-end'>
          <HStack>
            <Text>Items per page:</Text>
            <Select width='70px' value={itemsPerPage} onChange={(e) => onPageChange(1, parseInt(e.target.value))}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
          </HStack>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            size='sm'
            variant='outline'
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1, itemsPerPage)}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            size='sm'
            variant='outline'
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1, itemsPerPage)}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
      </Box>
    </Box>
  )
}

export default DataTable
