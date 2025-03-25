import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, HStack, Box, Button, Select, Text } from '@chakra-ui/react'

const DataTable = ({ headers, dataInTable, itemsPerPage = 10, currentPage = 1, onPageChange }) => {
  const totalItems = dataInTable.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <Box>
      <Table variant='simple'>
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th key={index}>{header.label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {dataInTable.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {headers.map((header, cellIndex) => (
                <Td key={cellIndex}>{row[header.key]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <HStack spacing={4} justify='flex-end' mt={4}>
        <Select width='auto' value={itemsPerPage} onChange={(e) => onPageChange(1, parseInt(e.target.value))}>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </Select>

        <HStack>
          <Button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1, itemsPerPage)}>
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1, itemsPerPage)}>
            Next
          </Button>
        </HStack>
      </HStack>
    </Box>
  )
}

export default DataTable
