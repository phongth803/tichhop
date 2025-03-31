import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export const useProductFilters = (initialFilters) => {
  const [localFilters, setLocalFilters] = useState(initialFilters)
  const [currentPageState, setCurrentPageState] = useState(1)
  const debouncedFilters = useDebounce(localFilters, 500)

  const validatePageNumber = (page, totalPages) => {
    const pageNum = parseInt(page)
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      return 1
    }
    return pageNum
  }

  const cleanFilters = (filters) => {
    return Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        if (key === 'page') return false
        if (key === 'category') return value !== ''
        if (value === initialFilters[key]) return false
        if (typeof value === 'string' && !value.trim()) return false
        return value !== null && value !== undefined
      })
    )
  }

  return {
    localFilters,
    setLocalFilters,
    currentPageState,
    setCurrentPageState,
    debouncedFilters,
    validatePageNumber,
    cleanFilters
  }
}
