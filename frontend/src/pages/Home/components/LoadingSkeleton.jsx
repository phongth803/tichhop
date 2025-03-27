import { Box, Container, Grid, Skeleton, SkeletonText } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const LoadingSkeleton = () => (
  <Container maxW='container.xl'>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <Grid templateColumns='repeat(4, 1fr)' gap={6} mt={10}>
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            p={4}
            borderWidth='1px'
            borderRadius='lg'
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Skeleton height='200px' startColor='gray.100' endColor='gray.300' />
            <SkeletonText mt={4} noOfLines={2} spacing={4} />
          </Box>
        ))}
      </Grid>
    </motion.div>
  </Container>
)

export default LoadingSkeleton
