import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Box } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import { getProduct } from '../../apis/products'

const BreadcrumbNav = () => {
  const location = useLocation()
  const [productName, setProductName] = useState('')

  useEffect(() => {
    const fetchProductName = async () => {
      const pathnames = location.pathname.split('/').filter((x) => x)
      if (pathnames[0] === 'product' && pathnames[1]) {
        try {
          const response = await getProduct(pathnames[1])
          setProductName(response.data.name)
        } catch (error) {
          console.error('Error fetching product name:', error)
        }
      }
    }
    fetchProductName()
  }, [location.pathname])

  // Return null for home page and auth pages
  if (location.pathname === '/' || location.pathname.match(/\/(login|register)$/)) {
    return null
  }

  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <Box borderBottom='1px' borderColor='gray.100' bg='gray.50'>
      <Container maxW='container.xl'>
        <Breadcrumb
          spacing='8px'
          separator={<ChevronRightIcon color='gray.400' fontSize='14px' />}
          py={4}
          fontSize='md'
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              to='/'
              color='gray.500'
              fontSize='15px'
              _hover={{
                color: 'gray.700',
                textDecoration: 'none'
              }}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
            const isLast = index === pathnames.length - 1

            // Xử lý hiển thị tên cho route product
            let displayName = name
            if (name === 'product') {
              displayName = 'Product'
            } else if (pathnames[0] === 'product' && index === 1) {
              displayName = productName || 'Loading...' // Hiển thị "Loading..." trong khi đợi fetch
            }

            return (
              <BreadcrumbItem key={routeTo} isCurrentPage={isLast}>
                <BreadcrumbLink
                  as={Link}
                  to={routeTo}
                  color={isLast ? 'black' : 'gray.500'}
                  fontWeight={isLast ? 'bold' : 'normal'}
                  fontSize='15px'
                  _hover={{
                    color: isLast ? 'black' : 'gray.700',
                    textDecoration: 'none'
                  }}
                  textTransform='capitalize'
                >
                  {displayName.replace(/-/g, ' ')}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )
          })}
        </Breadcrumb>
      </Container>
    </Box>
  )
}

export default BreadcrumbNav
