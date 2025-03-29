import { IconButton } from '@chakra-ui/react'
import { FaArrowUp } from 'react-icons/fa'
import { useState, useEffect } from 'react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <IconButton
          icon={<FaArrowUp />}
          onClick={scrollToTop}
          position='fixed'
          bottom='4'
          right='4'
          colorScheme='red'
          size='lg'
          rounded='full'
          zIndex='tooltip'
          aria-label='Back to top'
          boxShadow='lg'
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'xl'
          }}
        />
      )}
    </>
  )
}

export default ScrollToTop
